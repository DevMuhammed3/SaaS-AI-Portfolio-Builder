import { type Job, Worker } from "bullmq";
import { redisConnection } from "../config";
import type { WelcomeEmailJobData } from "../email-queue";
import { devLog } from "@/lib/utils";
import { EmailService } from "@/lib/services/email-service";

// Job processor for email queue
export class EmailProcessor {
  private static worker: Worker;

  static async initialize() {
    if (this.worker) {
      return this.worker;
    }

    this.worker = new Worker(
      "email-queue",
      async (job: Job) => {
        devLog.warn(`📧 Processing email job: ${job.name} (ID: ${job.id})`);

        try {
          switch (job.name) {
            case "welcome-email":
              await this.processWelcomeEmail(job);
              break;
            case "password-reset-email":
              await this.processPasswordResetEmail(job);
              break;
            case "notification-email":
              await this.processNotificationEmail(job);
              break;
            default:
              throw new Error(`Unknown job type: ${job.name}`);
          }

          devLog.warn(`✅ Email job completed: ${job.name} (ID: ${job.id})`);
        } catch (error) {
          devLog.error(
            `❌ Email job failed: ${job.name} (ID: ${job.id})`,
            error
          );
          throw error;
        }
      },
      {
        connection: redisConnection,
        concurrency: 5, // Process up to 5 jobs concurrently
        removeOnComplete: {
          count: 10,
        },
        removeOnFail: {
          count: 50,
        },
      }
    );

    // Event listeners
    this.worker.on("completed", (job) => {
      devLog.warn(`✅ Job completed: ${job.id}`);
    });

    this.worker.on("failed", (job, err) => {
      devLog.error(`❌ Job failed: ${job?.id}`, err);
    });

    this.worker.on("error", (err) => {
      devLog.error("❌ Worker error:", err);
    });

    devLog.warn("✅ Email processor initialized");
    return this.worker;
  }

  private static async processWelcomeEmail(job: Job<WelcomeEmailJobData>) {
    const { email, name } = job.data;

    const success = await EmailService.sendWelcomeEmail(email, name);

    if (!success) {
      throw new Error(`Failed to send welcome email to ${email}`);
    }

    // Update job progress
    await job.updateProgress(100);
  }

  private static async processPasswordResetEmail(
    job: Job<{ email: string; name: string; resetToken: string }>
  ) {
    const { email, name, resetToken } = job.data;

    const success = await EmailService.sendPasswordResetEmail(
      email,
      name,
      resetToken
    );

    if (!success) {
      throw new Error(`Failed to send password reset email to ${email}`);
    }

    await job.updateProgress(100);
  }

  private static async processNotificationEmail(
    job: Job<{ email: string; name: string; subject: string; content: string }>
  ) {
    const { email, name, subject, content } = job.data;

    const success = await EmailService.sendNotificationEmail(
      email,
      name,
      subject,
      content
    );

    if (!success) {
      throw new Error(`Failed to send notification email to ${email}`);
    }

    await job.updateProgress(100);
  }

  static async shutdown() {
    if (this.worker) {
      await this.worker.close();
      devLog.warn("📧 Email processor shutdown");
    }
  }
}

import { Queue } from "bullmq";
import { redisConnection, queueConfig } from "./config";
import { devLog } from "@/lib/utils";

// Email job types
export interface WelcomeEmailJobData {
  userId: string;
  email: string;
  name: string;
  clerkId: string;
}

export interface EmailJobData {
  type: "welcome" | "password-reset" | "notification";
  data: WelcomeEmailJobData | unknown;
}

// Create email queue
export const emailQueue = new Queue("email-queue", {
  connection: redisConnection,
  defaultJobOptions: queueConfig.defaultJobOptions,
});

// Email queue methods
export class EmailQueueService {
  static async addWelcomeEmailJob(data: WelcomeEmailJobData) {
    try {
      const job = await emailQueue.add("welcome-email", data, {
        priority: 1, // High priority for welcome emails
        delay: 5000, // 5 second delay to ensure user creation is complete
      });

      devLog.warn(
        `✅ Welcome email job added for user: ${data.email} (Job ID: ${job.id})`
      );
      return job;
    } catch (error) {
      devLog.error("❌ Failed to add welcome email job:", error);
      throw error;
    }
  }

  static async addPasswordResetEmailJob(data: {
    email: string;
    resetToken: string;
    name: string;
  }) {
    try {
      const job = await emailQueue.add("password-reset-email", data, {
        priority: 2, // High priority for password reset
      });

      devLog.warn(`✅ Password reset email job added for user: ${data.email}`);
      return job;
    } catch (error) {
      devLog.error("❌ Failed to add password reset email job:", error);
      throw error;
    }
  }

  static async addNotificationEmailJob(data: {
    email: string;
    subject: string;
    content: string;
    name: string;
  }) {
    try {
      const job = await emailQueue.add("notification-email", data, {
        priority: 3, // Lower priority for notifications
      });

      devLog.warn(`✅ Notification email job added for user: ${data.email}`);
      return job;
    } catch (error) {
      devLog.error("❌ Failed to add notification email job:", error);
      throw error;
    }
  }

  static async getQueueStats() {
    try {
      const waiting = await emailQueue.getWaiting();
      const active = await emailQueue.getActive();
      const completed = await emailQueue.getCompleted();
      const failed = await emailQueue.getFailed();

      return {
        waiting: waiting.length,
        active: active.length,
        completed: completed.length,
        failed: failed.length,
      };
    } catch (error) {
      devLog.error("❌ Failed to get queue stats:", error);
      return null;
    }
  }
}

import nodemailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";
import { devLog } from "@/lib/utils";

// Convert fs.readFile to Promise-based

// Email configuration interface
export interface EmailConfig {
  host?: string;
  port?: number;
  secure?: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

// Email data interface
export interface EmailData {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  cc?: string | string[];
  bcc?: string | string[];
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
}

// Template data interface
export interface TemplateData {
  [key: string]: unknown;
}

class MailService {
  private transporter: nodemailer.Transporter;

  constructor(config: EmailConfig) {
    // Create a nodemailer transporter
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      host: config.host || "smtp.gmail.com",
      port: config.port || 587,
      secure: config.secure || false, // true for 465, false for other ports
      auth: {
        user: config.auth.user,
        pass: config.auth.pass,
      },
    });
  }

  /**
   * Send an email
   * @param emailData Email data including recipients, subject, and content
   * @returns Promise with send info
   */
  async sendMail(emailData: EmailData): Promise<nodemailer.SentMessageInfo> {
    try {
      const mailOptions = {
        from:
          process.env.MAIL_FROM ||
          (this.transporter.options as SMTPTransport.Options).auth?.user,
        ...emailData,
      };

      return await this.transporter.sendMail(mailOptions);
    } catch (error) {
      devLog.error("Error sending email:", error);
      throw error;
    }
  }

  /**
   * Verify SMTP connection
   * @returns Promise with verification result
   */
  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      return true;
    } catch (error) {
      devLog.error("SMTP connection verification failed:", error);
      return false;
    }
  }
}

// Create and export a singleton instance
let mailService: MailService | null = null;

export function getMailService(): MailService {
  if (!mailService) {
    // Check for required environment variables
    if (!process.env.MAIL_USER || !process.env.MAIL_PASSWORD) {
      throw new Error(
        "Mail configuration is missing. Please set MAIL_USER and MAIL_PASSWORD environment variables."
      );
    }

    mailService = new MailService({
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
      // Optional custom configuration
      // host: process.env.MAIL_HOST,
      // port: process.env.MAIL_PORT
      //   ? Number.parseInt(process.env.MAIL_PORT, 10)
      //   : undefined,
      // secure: process.env.MAIL_SECURE === "false",
    });
  }

  return mailService;
}

import nodemailer from "nodemailer";
import { devLog } from "@/lib/utils";

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export class EmailService {
  private static transporter: nodemailer.Transporter;

  static async initialize() {
    if (this.transporter) {
      return this.transporter;
    }

    try {
      // Create transporter based on environment
      if (process.env.NODE_ENV === "production") {
        // Production email configuration (e.g., SendGrid, AWS SES, etc.)
        this.transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number.parseInt(process.env.SMTP_PORT || "587"),
          secure: process.env.SMTP_SECURE === "true",
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
          },
        });
      } else {
        // Development: Use Ethereal Email for testing
        const testAccount = await nodemailer.createTestAccount();
        this.transporter = nodemailer.createTransport({
          host: "smtp.ethereal.email",
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass,
          },
        });
      }

      // Verify connection
      await this.transporter.verify();
      devLog.warn("✅ Email service initialized successfully");

      return this.transporter;
    } catch (error) {
      devLog.error("❌ Failed to initialize email service:", error);
      throw error;
    }
  }

  static async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      const transporter = await this.initialize();

      const mailOptions = {
        from: process.env.FROM_EMAIL || "noreply@yourapp.com",
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text || this.stripHtml(options.html),
      };

      const info = await transporter.sendMail(mailOptions);

      if (process.env.NODE_ENV !== "production") {
        devLog.warn("📧 Preview URL:", nodemailer.getTestMessageUrl(info));
      }

      devLog.warn(`✅ Email sent successfully to: ${options.to}`);
      return true;
    } catch (error) {
      devLog.error("❌ Failed to send email:", error);
      return false;
    }
  }

  static async sendWelcomeEmail(email: string, name: string): Promise<boolean> {
    const subject = "Welcome to Our Platform! 🎉";
    const html = this.generateWelcomeEmailTemplate(name);

    return this.sendEmail({ to: email, subject, html });
  }

  static async sendPasswordResetEmail(
    email: string,
    name: string,
    resetToken: string
  ): Promise<boolean> {
    const subject = "Password Reset Request";
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;
    const html = this.generatePasswordResetEmailTemplate(name, resetUrl);

    return this.sendEmail({ to: email, subject, html });
  }

  static async sendNotificationEmail(
    email: string,
    name: string,
    subject: string,
    content: string
  ): Promise<boolean> {
    const html = this.generateNotificationEmailTemplate(name, content);

    return this.sendEmail({ to: email, subject, html });
  }

  // Email templates
  private static generateWelcomeEmailTemplate(name: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Our Platform</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Our Platform! 🎉</h1>
            </div>
            <div class="content">
              <h2>Hello ${name}!</h2>
              <p>We're thrilled to have you join our community. Your account has been successfully created and you're ready to start building amazing portfolios.</p>
              
              <h3>What's next?</h3>
              <ul>
                <li>✨ Create your first portfolio</li>
                <li>🎨 Choose from our beautiful templates</li>
                <li>🚀 Share your work with the world</li>
              </ul>
              
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/user/portfolios/new" class="button">Create Your First Portfolio</a>
              
              <p>If you have any questions, feel free to reach out to our support team. We're here to help!</p>
              
              <p>Best regards,<br>The Portfolio Team</p>
            </div>
            <div class="footer">
              <p>© 2024 Portfolio Platform. All rights reserved.</p>
              <p>If you didn't create this account, please ignore this email.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private static generatePasswordResetEmailTemplate(
    name: string,
    resetUrl: string
  ): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset Request</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #dc3545; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #dc3545; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Reset Request 🔐</h1>
            </div>
            <div class="content">
              <h2>Hello ${name}!</h2>
              <p>We received a request to reset your password. Click the button below to create a new password:</p>
              
              <a href="${resetUrl}" class="button">Reset Password</a>
              
              <div class="warning">
                <strong>⚠️ Important:</strong>
                <ul>
                  <li>This link will expire in 1 hour</li>
                  <li>If you didn't request this reset, please ignore this email</li>
                  <li>Your password won't change until you create a new one</li>
                </ul>
              </div>
              
              <p>If the button doesn't work, copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #666;">${resetUrl}</p>
              
              <p>Best regards,<br>The Portfolio Team</p>
            </div>
            <div class="footer">
              <p>© 2024 Portfolio Platform. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private static generateNotificationEmailTemplate(
    name: string,
    content: string
  ): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Notification</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #28a745; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Notification 📢</h1>
            </div>
            <div class="content">
              <h2>Hello ${name}!</h2>
              <div>${content}</div>
              <p>Best regards,<br>The Portfolio Team</p>
            </div>
            <div class="footer">
              <p>© 2024 Portfolio Platform. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private static stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, "");
  }
}

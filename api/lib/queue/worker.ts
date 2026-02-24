import { validateRedisConnection } from "./config";
import { devLog } from "@/lib/utils";
import { EmailProcessor } from "./processors/email-processor";

// Main worker initialization
export class QueueWorker {
  private static isInitialized = false;

  static async initialize() {
    if (this.isInitialized) {
      devLog.warn("⚠️ Queue worker already initialized");
      return;
    }

    try {
      // Validate Redis connection first
      const isRedisConnected = await validateRedisConnection();
      if (!isRedisConnected) {
        throw new Error("Redis connection failed");
      }

      // Initialize email processor
      await EmailProcessor.initialize();

      this.isInitialized = true;
      devLog.warn("🚀 Queue worker initialized successfully");

      // Graceful shutdown handling
      process.on("SIGTERM", this.shutdown);
      process.on("SIGINT", this.shutdown);
    } catch (error) {
      devLog.error("❌ Failed to initialize queue worker:", error);
      throw error;
    }
  }

  static async shutdown() {
    devLog.warn("🛑 Shutting down queue worker...");

    try {
      await EmailProcessor.shutdown();
      devLog.warn("✅ Queue worker shutdown complete");
      process.exit(0);
    } catch (error) {
      devLog.error("❌ Error during shutdown:", error);
      process.exit(1);
    }
  }
}

// Auto-initialize if this file is run directly
if (require.main === module) {
  QueueWorker.initialize().catch((error) => {
    devLog.error("❌ Failed to start queue worker:", error);
    process.exit(1);
  });
}

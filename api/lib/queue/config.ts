import Redis from "ioredis";
import type { ConnectionOptions } from "bullmq"; // Used by BullMQ only
import type { RedisOptions } from "ioredis"; // Used by ioredis directly
import { devLog } from "@/lib/utils";

// Unified Redis connection config values
const redisConfig = {
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379", 10),
  password: process.env.REDIS_PASSWORD,
  db: parseInt(process.env.REDIS_DB || "0", 10),
};

// BullMQ connection config (compatible with BullMQ)
export const redisConnection: ConnectionOptions = {
  ...redisConfig,
  maxRetriesPerRequest: 3,
  retryDelayOnFailover: 100,
  lazyConnect: true,
};

// Queue configuration
export const queueConfig = {
  defaultJobOptions: {
    removeOnComplete: 10,
    removeOnFail: 50,
    attempts: 3,
    backoff: {
      type: "exponential" as const,
      delay: 2000,
    },
  },
};

// Validate Redis connection using ioredis
export const validateRedisConnection = async (): Promise<boolean> => {
  const redisOptions: RedisOptions = {
    ...redisConfig,
    lazyConnect: true,
  };

  const redis = new Redis(redisOptions);

  try {
    await redis.ping();
    devLog.warn("✅ Redis connection successful");
    return true;
  } catch (error) {
    devLog.error("❌ Redis connection failed:", error);
    return false;
  } finally {
    await redis.disconnect();
  }
};

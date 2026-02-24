import mongoose from "mongoose";

// Load MongoDB connection URI from environment variables
const MONGODB_URI = process.env.MONGODB_URI;

// Ensure the MongoDB URI is defined
if (!MONGODB_URI) {
  if (process.env.NODE_ENV === "development") {
    throw new Error(
      "❌ Please define the MONGODB_URI environment variable in .env.local"
    );
  }
}

// Interface for caching the mongoose connection across hot reloads in development
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Use a global variable to persist connection cache across reloads in dev
declare global {
  var myMongoose: MongooseCache | undefined;
}

// Initialize cache object if not already defined
let cached = global.myMongoose;

if (!cached) {
  cached = global.myMongoose = { conn: null, promise: null };
}

/**
 * Asynchronously connects to the MongoDB database using Mongoose.
 * Reuses existing connection if available (important for local development).
 *
 * @returns The mongoose connection instance
 */
async function connectDB(): Promise<typeof mongoose> {
  // Return cached connection if it exists
  if (cached!.conn) {
    return cached!.conn;
  }

  // If not already connecting, create a new connection promise
  if (!cached!.promise) {
    const opts = {
      bufferCommands: false, // Disable mongoose buffering for better error visibility
      maxPoolSize: 10, // Connection pool size
      serverSelectionTimeoutMS: 5000, // Time to wait for server selection
      socketTimeoutMS: 45000, // Socket timeout
      family: 4, // Use IPv4
    };

    // Initiate the connection
    cached!.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      console.log("✅ Connected to MongoDB");
      return mongoose;
    });
  }

  try {
    // Await the connection and cache it
    cached!.conn = await cached!.promise;
  } catch (e) {
    // Reset the promise on failure for retry
    cached!.promise = null;
    throw e;
  }

  return cached!.conn;
}

export default connectDB;

/**
 * Clerk Webhook Handler for User & Session events.
 * Handles `user.created`, `user.updated`, `user.deleted`, `session.created`, `session.removed`.
 * Automatically syncs Clerk user data with local MongoDB database and logs relevant user activity.
 */

import connectDB from "@/lib/database";
import { userRepository } from "@/repositories/UserRepository";
import { clerkClient, WebhookEvent } from "@clerk/nextjs/server";
import type { Handler } from "@netlify/functions";
import isEqual from "lodash.isequal";
import { Webhook } from "svix";
import { devLog } from "@/lib/utils";
import { EmailQueueService } from "@/lib/queue/email-queue";

type ClerkWebhookUser = {
  id: string;
  email_addresses: {
    id: string;
    email_address: string;
  }[];
  first_name: string | null;
  last_name: string | null;
  username: string | null;
  image_url: string;
  updated_at: number; // Unix timestamp (milliseconds)
  primary_email_address_id: string | null;
};

type Session = {
  abandon_at: number;
  client_id: string;
  created_at: number;
  expire_at: number;
  id: string;
  last_active_at: number;
  object: "session";
  status: "active" | "inactive" | string; // expand if there are other known statuses
  updated_at: number;
  user_id: string;
};

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

if (!webhookSecret) {
  throw new Error("Missing CLERK_WEBHOOK_SECRET in .env");
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  const headers = event.headers;
  const payload = event.body;

  if (!payload) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "No payload provided" }),
    };
  }

  // Extract Svix signature headers
  const svix_id = headers["Svix-Id"] || headers["svix-id"];
  const svix_timestamp = headers["Svix-Timestamp"] || headers["svix-timestamp"];
  const svix_signature = headers["Svix-Signature"] || headers["svix-signature"];

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing Svix signature headers" }),
    };
  }

  const wh = new Webhook(webhookSecret);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    devLog.error("❌ Svix verification failed:", err);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid webhook signature" }),
    };
  }

  try {
    await connectDB();
    devLog.warn("✅ MongoDB connected");

    devLog.warn("📥 Incoming Clerk event:", evt.type);

    // Route the event type to the appropriate handler
    switch (evt.type) {
      case "user.created":
        await handleUserCreated(evt.data);
        break;
      case "user.updated":
        await handleUserUpdated(evt.data);
        break;
      case "user.deleted":
        await handleUserDeleted(evt.data);
        break;
      case "session.created":
        await handleSessionCreated(evt.data);
        break;
      case "session.removed":
        await handleSessionRemoved(evt.data);
        break;
      default:
        devLog.warn(`⚠️ Unhandled Clerk event: ${evt.type}`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Webhook processed successfully" }),
    };
  } catch (error) {
    devLog.error("🔥 Webhook processing failed:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Internal server error",
        details: error,
      }),
    };
  }
};

async function handleUserCreated(userData: ClerkWebhookUser) {
  try {
    const { id: clerkId, email_addresses, first_name, last_name } = userData;

    // Get primary email
    const primaryEmail = email_addresses.find(
      (email: { id: string }) => email.id === userData.primary_email_address_id
    );

    if (!primaryEmail) {
      throw new Error("No primary email found");
    }

    // Check if user already exists by clerkId
    const existingUser = await userRepository.findByClerkId(clerkId);

    if (existingUser) {
      if (existingUser.status === "suspended") {
        devLog.warn(`Reactivating user ${clerkId}`);
        await userRepository.updateByClerkId(clerkId, {
          status: "active",
          updatedAt: new Date(),
        });
      } else {
        devLog.warn(`User ${clerkId} already active`);
      }
      return;
    }

    // 🔍 Check by email in case user recreated their Clerk account
    const existingByEmail = await userRepository.findByEmail(
      primaryEmail.email_address
    );

    if (existingByEmail) {
      devLog.warn(
        `User with email ${primaryEmail.email_address} exists but has a different Clerk ID. Re-linking...`
      );

      await userRepository.updateById(existingByEmail._id.toString(), {
        clerkId,
        status: "active",
        updatedAt: new Date(),
      });

      try {
        devLog.warn("✅ User activity logged (user.relinked)");
      } catch (err) {
        devLog.error("❌ Failed to log user activity:", err);
      }

      return;
    }

    // Create new user
    devLog.warn("Creating new user with email:", primaryEmail.email_address);
    const newUser = await userRepository.create({
      clerkId,
      email: primaryEmail.email_address,
      name: first_name + " " + last_name,
      plan: "free",
      role: "user",
      status: "active",
    });
    devLog.warn("User created successfully:", newUser.email);

    // Queue welcome email for new user
    try {
      await EmailQueueService.addWelcomeEmailJob({
        userId: newUser._id.toString(),
        email: primaryEmail.email_address,
        name: first_name + " " + last_name,
        clerkId: clerkId,
      });
      devLog.warn(
        `✅ Welcome email queued for new user: ${primaryEmail.email_address}`
      );
    } catch (emailError) {
      devLog.error("❌ Failed to queue welcome email:", emailError);
      // Don't throw error here - user creation should still succeed even if email fails
    }

    // Handle Clerk user private metadata update
    let clerk = null;
    try {
      const clerkAwait = await clerkClient();
      devLog.warn(`Fetching Clerk user with id: ${clerkId}`);
      clerk = await clerkAwait.users.getUser(clerkId);
      devLog.warn("Clerk user fetched:", clerk);

      const newPrivateMetadata = {
        role: "user",
        plan: "free",
      };

      const shouldUpdate = clerk
        ? !isEqual(clerk.privateMetadata, newPrivateMetadata)
        : false;

      if (shouldUpdate) {
        try {
          await clerkAwait.users.updateUser(clerkId, {
            privateMetadata: newPrivateMetadata,
          });
          devLog.warn("Clerk user privateMetadata updated");
        } catch (updateError) {
          devLog.error(
            "Failed to update Clerk user privateMetadata:",
            updateError
          );
        }
      } else {
        devLog.warn("No privateMetadata update needed");
      }
    } catch (err) {
      devLog.error("Failed to get Clerk user:", err);
      // Decide: continue or throw
      clerk = null;
    }
  } catch (error) {
    devLog.error("Error creating user:", error);
    throw error;
  }
}

async function handleUserUpdated(userData: ClerkWebhookUser) {
  try {
    const { id: clerkId, email_addresses, last_name, updated_at } = userData;

    // Get primary email
    const primaryEmail = email_addresses.find(
      (email: { id: string }) => email.id === userData.primary_email_address_id
    );

    if (!primaryEmail) {
      throw new Error("No primary email found");
    }

    // Find existing user
    const existingUser = await userRepository.findByClerkId(clerkId);
    if (!existingUser) {
      devLog.warn(`User with Clerk ID ${clerkId} not found, creating new user`);
      await handleUserCreated(userData);
      return;
    }

    // Update user
    await userRepository.updateByClerkId(clerkId, {
      email: primaryEmail.email_address,
      name: last_name || existingUser.name,
      updatedAt: new Date(updated_at),
    });
  } catch (error) {
    devLog.error("Error updating user:", error);
    throw error;
  }
}

async function handleUserDeleted(userData: Partial<ClerkWebhookUser>) {
  try {
    const { id: clerkId } = userData;

    // Find existing user
    const existingUser = await userRepository.findByClerkId(clerkId ?? "");
    if (!existingUser) {
      devLog.warn(`User with Clerk ID ${clerkId} not found`);
      return;
    }

    // Soft delete user (update status instead of hard delete)
    await userRepository.updateByClerkId(clerkId ?? "", {
      status: "suspended",
      updatedAt: new Date(),
    });
  } catch (error) {
    devLog.error("Error deleting user:", error);
    throw error;
  }
}

async function handleSessionCreated(sessionData: Session) {
  try {
    const { id: sessionId, user_id: clerkUserId } = sessionData;

    // Find user by Clerk ID
    const user = await userRepository.findByClerkId(clerkUserId);
    if (!user) {
      devLog.warn(`Session created but user ${clerkUserId} not found`);
      return;
    }

    devLog.warn(
      `Session created for user ${clerkUserId}, session ID: ${sessionId}`
    );

    // Optional: update user's session info or status if needed
    // await userRepository.addSession(user._id, sessionId);
  } catch (error) {
    devLog.error("Error handling session.created:", error);
    throw error;
  }
}

async function handleSessionRemoved(sessionData: Session) {
  try {
    const { id: sessionId, user_id: clerkUserId } = sessionData;

    // Find user by Clerk ID
    const user = await userRepository.findByClerkId(clerkUserId);
    if (!user) {
      devLog.warn(`Session removed but user ${clerkUserId} not found`);
      return;
    }

    devLog.warn(
      `Session removed for user ${clerkUserId}, session ID: ${sessionId}`
    );

    // Optional: update user's session info or status if needed
    // await userRepository.removeSession(user._id, sessionId);
  } catch (error) {
    devLog.error("Error handling session.removed:", error);
    throw error;
  }
}

import User, { UserDocument } from "@/models/User";
import { BaseRepository } from "./BaseRepository";

/**
 * UserRepositoryClass extends the generic BaseRepository
 * to provide user-specific data access methods.
 */
export class UserRepositoryClass extends BaseRepository<UserDocument> {
  constructor() {
    // Pass the User Mongoose model to the base repository
    super(User);
  }

  /**
   * Find a user document by their Clerk ID.
   * @param clerkId - The Clerk user ID to search for.
   * @returns The found UserDocument or null if not found.
   */
  async findByClerkId(clerkId: string): Promise<UserDocument | null> {
    return this.findOne({ clerkId });
  }

  /**
   * Update a user document by their Clerk ID.
   * @param clerkId - The Clerk user ID to search for.
   * @param data - Partial user data to update.
   * @returns The updated UserDocument or null if not found.
   */
  async updateByClerkId(
    clerkId: string,
    data: Partial<UserDocument>
  ): Promise<UserDocument | null> {
    // Use User model directly to update and return the new document
    return User.findOneAndUpdate({ clerkId }, data, { new: true }).exec();
  }

  /**
   * Delete a user document by their Clerk ID.
   * @param clerkId - The Clerk user ID to search for.
   * @returns The deleted UserDocument or null if not found.
   */
  async deleteByClerkId(clerkId: string): Promise<UserDocument | null> {
    // Use User model directly to find and delete the user document
    return User.findOneAndDelete({ clerkId }).exec();
  }

  /**
   * Find a user by email.
   * @param email - The email address to search for.
   */
  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.findOne({ email });
  }

  /**
   * Update a user by MongoDB `_id`.
   * @param id - The MongoDB ObjectId of the user.
   * @param data - Partial user update data.
   */
  async updateById(
    id: string,
    data: Partial<UserDocument>
  ): Promise<UserDocument | null> {
    return this.update(id, data);
  }
}

// Singleton instance of UserRepositoryClass for app-wide usage
export const userRepository = new UserRepositoryClass();

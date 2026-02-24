import {
  Schema,
  model,
  models,
  type InferSchemaType,
  type HydratedDocument,
  type Model,
  type ValidatorProps,
} from "mongoose";

/**
 * Mongoose schema for storing user metadata
 * synced with Clerk authentication system.
 */
const UserSchema = new Schema(
  {
    /**
     * Unique Clerk user ID.
     * Used to associate MongoDB documents with Clerk accounts.
     */
    clerkId: { type: String, required: true, unique: true },

    /**
     * Optional email field.
     * Includes basic format validation.
     */
    email: {
      type: String,
      required: false,
      trim: true,
      lowercase: true,
      validate: {
        validator: function (v: string) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: (props: ValidatorProps) =>
          `${props.value} is not a valid email!`,
      },
    },

    /**
     * Optional display name for the user.
     */
    name: {
      type: String,
      minlength: 2,
      maxlength: 50,
      required: false,
      trim: true,
    },

    /**
     * Role of the user in the system.
     * Defaults to `user`.
     */
    role: {
      type: String,
      enum: ["admin", "user"],
      required: false,
      default: "user",
    },

    /**
     * Subscription plan assigned to the user.
     * Defaults to `free`.
     */
    plan: {
      type: String,
      enum: ["free", "premium"],
      required: false,
      default: "free",
    },

    /**
     * Account status of the user.
     * Useful for banning or suspending users.
     */
    status: {
      type: String,
      enum: ["active", "banned", "suspended"],
      required: false,
      default: "active",
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Inferred TypeScript types from the schema
export type UserType = InferSchemaType<typeof UserSchema>;
export type UserDocument = HydratedDocument<UserType>;
type UserModel = Model<UserDocument>;

// Safe model export (prevents model overwrite in hot reloads)
const User =
  (models.User as UserModel) || model<UserType, UserModel>("User", UserSchema);

export default User;

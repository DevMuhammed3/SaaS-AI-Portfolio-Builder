import {
  Schema,
  model,
  models,
  type InferSchemaType,
  type HydratedDocument,
  type Model,
} from "mongoose";

// Define the schema for the Contact Form
const ContactSchema = new Schema(
  {
    portfolio: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Portfolio",
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters long"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      validate: {
        validator: function (email: string) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(email);
        },
        message: "Email must be a valid email address",
      },
    },

    subject: {
      type: String,
      required: [true, "Subject is required"],
      trim: true,
      minlength: [5, "Subject must be at least 5 characters long"],
      maxlength: [100, "Subject cannot exceed 100 characters"],
    },

    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      minlength: [10, "Message must be at least 10 characters long"],
      maxlength: [1000, "Message cannot exceed 1000 characters"],
    },

    status: {
      type: String,
      enum: {
        values: ["unread", "read", "archived"],
        message: "Status must be 'unread', 'read', or 'archived'",
      },
      default: "unread",
    },
  },
  {
    timestamps: true,
  }
);

// 🔐 Unique compound index: one email per portfolio
ContactSchema.index({ email: 1, portfolio: 1 }, { unique: true });

// Add indexes for common filters or dashboard views
ContactSchema.index({ email: 1, createdAt: -1 });
ContactSchema.index({ status: 1 });
ContactSchema.index({ createdAt: -1 });

// Pre-save hook: sanitize message input
ContactSchema.pre("save", function (next) {
  this.message = this.message.trim();
  this.subject = this.subject.trim();
  next();
});

// Infer TypeScript types
export type ContactType = InferSchemaType<typeof ContactSchema>;
export type ContactDocument = HydratedDocument<ContactType>;
type ContactModel = Model<ContactDocument>;

// Export the model (supports hot reload in dev)
const Contact =
  (models.Contact as ContactModel) ||
  model<ContactType, ContactModel>("Contact", ContactSchema);

export default Contact;

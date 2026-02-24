// Import Mongoose tools for schema, model creation, and type inference
import {
  Schema,
  model,
  models,
  type InferSchemaType,
  type HydratedDocument,
  type Model,
} from "mongoose";

// Define the schema for the Template collection
const TemplateSchema = new Schema(
  {
    // Title: unique, trimmed, required, and max 100 chars
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      unique: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
      lowercase: true,
    },

    // Description: trimmed, required, and max 500 chars
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
      lowercase: true,
    },

    // Tags: must be a non-empty array of strings
    tags: {
      type: [String],
      required: [true, "At least one tag is required"],
      validate: {
        validator: function (tags: string[]) {
          return tags.length > 0;
        },
        message: "At least one tag is required",
      },
    },

    // Thumbnail: must be a valid URL
    thumbnail: {
      type: String,
      required: [true, "Thumbnail is required"],
      validate: {
        validator: function (url: string) {
          const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
          return urlRegex.test(url);
        },
        message: "Thumbnail must be a valid URL",
      },
    },

    // Font: required and trimmed
    font: {
      type: String,
      required: [true, "Font is required"],
      trim: true,
    },

    // Primary color: must be a valid HEX color code
    primaryColor: {
      type: String,
      required: [true, "Primary color is required"],
      validate: {
        validator: function (color: string) {
          const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
          return hexColorRegex.test(color);
        },
        message: "Primary color must be a valid hex color",
      },
    },

    // Secondary color: must also be a valid HEX color
    secondaryColor: {
      type: String,
      required: [true, "Secondary color is required"],
      validate: {
        validator: function (color: string) {
          const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
          return hexColorRegex.test(color);
        },
        message: "Secondary color must be a valid hex color",
      },
    },

    // Premium flag: indicates whether this is a premium template
    premium: {
      type: Boolean,
      default: false,
    },

    // Status: can only be 'active' or 'inactive'
    status: {
      type: String,
      enum: {
        values: ["active", "inactive"],
        message: "Status must be either active or inactive",
      },
      default: "active",
    },
  },

  // Automatically add `createdAt` and `updatedAt` timestamps
  {
    timestamps: true,
  }
);

// Add indexes to improve performance on filter/search operations
TemplateSchema.index({ status: 1, createdAt: -1 }); // For sorting by status and recency
TemplateSchema.index({ tags: 1 }); // For filtering/searching by tags
TemplateSchema.index({ createdBy: 1 }); // Useful if you add multi-user support
TemplateSchema.index({ title: "text", description: "text" }); // Full-text search support

// Pre-save hook: normalize tags (lowercase and trimmed)
TemplateSchema.pre("save", function (next) {
  if (this.tags) {
    this.tags = this.tags.map((tag: string) => tag.toLowerCase().trim());
  }
  next();
});

// Infer TypeScript types from the schema for full type safety
export type TemplateType = InferSchemaType<typeof TemplateSchema>;
export type TemplateDocument = HydratedDocument<TemplateType>;
type TemplateModel = Model<TemplateDocument>;

// Export the model (reuse existing in hot-reload environments like Next.js)
const Template =
  (models.Template as TemplateModel) ||
  model<TemplateType, TemplateModel>("Template", TemplateSchema);

export default Template;

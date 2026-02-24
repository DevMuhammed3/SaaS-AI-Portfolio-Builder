import { generateSlug } from "@/lib/utils";
import mongoose, { models, Schema } from "mongoose";
import { model } from "mongoose";
import { Model } from "mongoose";
import { HydratedDocument } from "mongoose";
import { InferSchemaType } from "mongoose";

// Mongoose Schemas
const SocialMediaSchema = new Schema(
  {
    platform: {
      type: String,
      required: true,
      trim: true,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const SkillSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["frontend", "backend", "devops", "database", "tools", "other"],
    },
    proficiency: {
      type: String,
      required: false,
      enum: ["beginner", "intermediate", "advanced", "expert"],
    },

    level: {
      type: Number,
      required: false,
      default: 1,
      enum: [1, 2, 3, 4, 5],
    },
  },
  { _id: false }
);

const CertificationSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    provider: {
      type: String,
      required: true,
    },
    issueDate: {
      type: Date,
      required: false,
    },
    expiryDate: {
      type: Date,
    },
    credentialId: {
      type: String,
      trim: false,
    },
    credentialUrl: {
      type: String,
      trim: false,
    },
  },
  { _id: false }
);

const ExperienceSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  company: {
    type: String,
    required: true,
    trim: true,
  },
  location: {
    type: String,
    trim: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
  },
  isCurrent: {
    type: Boolean,
    default: false,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  achievements: [
    {
      type: String,
      trim: true,
    },
  ],
  technologies: [
    {
      type: String,
      trim: true,
    },
  ],
});

const ProjectSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  thumbnail: {
    type: String,
    trim: true,
    default: "https://images.unsplash.com/photo-1559311648-d46f5d8593d6",
  },
  technologies: [
    {
      type: String,
      required: true,
      trim: true,
    },
  ],
  demoUrl: {
    type: String,
    trim: true,
  },
  githubUrl: {
    type: String,
    trim: true,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  completedDate: {
    type: Date,
  },
});

const PortfolioProfileSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    bio: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    location: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    phone: {
      type: String,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
    },
    profilePhoto: {
      type: String,
      trim: true,
    },
    socialMedia: [SocialMediaSchema],

    status: {
      type: String,
      enum: {
        values: ["draft", "publish", "archived"],
        message: "Status must be either active or inactive",
      },
      default: "draft",
    },
  },
  { _id: false }
);

const PortfolioSettingsSchema = new Schema(
  {
    isPublic: {
      type: Boolean,
      default: false,
    },
    allowComments: {
      type: Boolean,
      default: true,
    },
    showContactInfo: {
      type: Boolean,
      default: true,
    },
    customDomain: {
      type: String,
      trim: true,
    },
    seoTitle: {
      type: String,
      trim: true,
      maxlength: 60,
    },
    seoDescription: {
      type: String,
      trim: true,
      maxlength: 160,
    },
  },
  { _id: false }
);

// Main Portfolio Schema
const PortfolioSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      index: true,
    },
    templateId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Template",
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      minlength: 3,
      maxlength: 50,
      match: [
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Slug must contain only lowercase letters, numbers, and hyphens",
      ],
    },
    profile: {
      type: PortfolioProfileSchema,
      required: true,
    },
    skills: [SkillSchema],
    certifications: [CertificationSchema],
    experiences: [ExperienceSchema],
    projects: [ProjectSchema],
    settings: {
      type: PortfolioSettingsSchema,
      required: true,
      default: () => ({}),
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    viewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better performance

PortfolioSchema.index({
  "profile.name": "text",
  "profile.title": "text",
  "profile.bio": "text",
});
PortfolioSchema.index({ createdAt: -1 });
PortfolioSchema.index({ updatedAt: -1 });
PortfolioSchema.index({ viewCount: -1 });

// Pre-save middleware to generate slug if not provided
PortfolioSchema.pre("save", function (next) {
  if (!this.slug && this.profile?.name) {
    this.slug = generateSlug(this.profile.name);
  }
  next();
});

// Pre-save middleware to ensure slug uniqueness
PortfolioSchema.pre("save", async function (next) {
  if (this.isModified("slug")) {
    const existingPortfolio = await mongoose.models.Portfolio.findOne({
      slug: this.slug,
      _id: { $ne: this._id },
    });

    if (existingPortfolio) {
      let counter = 1;
      let newSlug = `${this.slug}-${counter}`;

      while (await mongoose.models.Portfolio.findOne({ slug: newSlug })) {
        counter++;
        newSlug = `${this.slug}-${counter}`;
      }

      this.slug = newSlug;
    }
  }
  next();
});

// Infer TypeScript types from the schema for full type safety
export type PortfolioType = InferSchemaType<typeof PortfolioSchema>;
export type PortfolioDocument = HydratedDocument<PortfolioType>;
type PortfolioModel = Model<PortfolioDocument>;

// Export the model (reuse existing in hot-reload environments like Next.js)
const Portfolio =
  (models.Portfolio as PortfolioModel) ||
  model<PortfolioType, PortfolioModel>("Portfolio", PortfolioSchema);

export default Portfolio;

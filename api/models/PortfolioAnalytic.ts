// models/PortfolioAnalytic.ts
import { Schema, models, model } from "mongoose";
import { HydratedDocument, InferSchemaType, Model } from "mongoose";

const PortfolioAnalyticSchema = new Schema(
  {
    portfolioId: {
      type: Schema.Types.ObjectId,
      ref: "Portfolio",
      required: true,
      index: true,
    },
    userId: {
      type: String, // Owner of the portfolio
      required: true,
      index: true,
    },
    viewerIp: {
      type: String, // optional: track unique visitors
      index: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true }
);

// **Add compound unique index comment because a user can see multiple time a portfolio**
// PortfolioAnalyticSchema.index({ userId: 1, portfolioId: 1 }, { unique: true });

// ✅ Pre-save hook to prevent duplicate inserts at app level
// **comment because a user can see multiple time a portfolio**

// PortfolioAnalyticSchema.pre("save", async function (next) {
//   const doc = this as PortfolioAnalyticDocument;

//   const existing = await PortfolioAnalytic.findOne({
//     userId: doc.userId,
//     portfolioId: doc.portfolioId,
//   });

//   if (existing) {
//     // Cancel save and return an error
//     const err = new Error("Duplicate view record already exists");
//     return next(err);
//   }

//   next();
// });

export type PortfolioAnalyticType = InferSchemaType<
  typeof PortfolioAnalyticSchema
>;
export type PortfolioAnalyticDocument = HydratedDocument<PortfolioAnalyticType>;
type PortfolioAnalyticModel = Model<PortfolioAnalyticDocument>;

const PortfolioAnalytic =
  (models.PortfolioAnalytic as PortfolioAnalyticModel) ||
  model<PortfolioAnalyticType, PortfolioAnalyticModel>(
    "PortfolioAnalytic",
    PortfolioAnalyticSchema
  );

export default PortfolioAnalytic;

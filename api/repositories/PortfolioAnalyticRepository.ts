// repositories/PortfolioAnalyticRepository.ts
import { BaseRepository } from "./BaseRepository";
import PortfolioAnalytic, {
  PortfolioAnalyticDocument,
} from "@/models/PortfolioAnalytic";
import connectDB from "@/lib/database";
import { startOfMonth, endOfMonth } from "date-fns";
import { userRepository } from "./UserRepository";
import { portfolioRepository } from "./PortfolioRepository";
import { Types } from "mongoose";
type Interval = "daily" | "weekly" | "monthly" | "yearly";

interface PortfolioAnalyticsResult {
  totalViews: number;
  uniqueVisitors: number;
  viewsByInterval: ViewsByInterval[];
}

interface ViewsByInterval {
  _id: Record<string, number>; // e.g., { year: 2025, month: 9, day: 5 } or { year: 2025, week: 36 }
  views: number;
}

interface GetPortfolioAnalyticsParams {
  ownerUserId: string;
  portfolioIds?: string[];
  startDate?: Date;
  endDate?: Date;
  interval?: Interval;
}
export class PortfolioAnalyticRepositoryClass extends BaseRepository<PortfolioAnalyticDocument> {
  constructor() {
    super(PortfolioAnalytic);
  }

  /**
   * Get daily view stats for all portfolios of a user (defaults to current month)
   */
  async getUserPortfolioViewsByDay(clerkId: string) {
    // Step 1: Find user by clerkId
    const user = await userRepository.findByClerkId(clerkId);
    if (!user) return []; // no user, no views

    const ownerUserId = user._id.toString();

    // Step 2: Find all portfolios owned by this user
    const portfolios = await portfolioRepository.find(
      { userId: ownerUserId },
      { _id: 1 }
    );
    const portfolioIds = portfolios.map((p) => p._id);

    if (!portfolioIds.length) return []; // no portfolios, no views

    // Step 3: Aggregate views for these portfolios
    const startDate = startOfMonth(new Date());
    const endDate = endOfMonth(new Date());

    const results = await PortfolioAnalytic.aggregate([
      {
        $match: {
          portfolioId: { $in: portfolioIds },
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
            day: { $dayOfMonth: "$date" },
          },
          totalViews: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
    ]);

    return results.map((r) => ({
      date: new Date(r._id.year, r._id.month - 1, r._id.day),
      views: r.totalViews,
    }));
  }

  /**
   * Adds a view record for a portfolio by a user
   * Only adds if this user hasn't viewed this portfolio before
   * @param userId - the user who viewed the portfolio
   * @param portfolioId - the portfolio that was viewed
   * @returns the created PortfolioAnalytic document or null if already exists
   */
  async addView(
    userId: string,
    portfolioId: string
  ): Promise<PortfolioAnalyticDocument | null> {
    await connectDB();

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    try {
      //  Use findOneAndUpdate with upsert to prevent duplicates
      // const analytic = await PortfolioAnalytic.findOneAndUpdate(
      //   {
      //     userId,
      //     portfolioId,
      //     date: { $gte: startOfDay, $lte: endOfDay },
      //   },
      //   {
      //     $setOnInsert: {
      //       userId,
      //       portfolioId,
      //       date: new Date(),
      //     },
      //   },
      //   {
      //     upsert: false, // insert only if it doesn't exist
      //     new: true, // return the document
      //   }
      // );
      const analytic = new PortfolioAnalytic({
        userId,
        portfolioId,
        date: new Date(),
      });

      await analytic.save();

      return analytic;
    } catch (err: unknown) {
      if (err instanceof Error && err.message.includes("duplicate key")) {
        // Duplicate key error, means it already exists
        return null;
      }
      throw err; // rethrow other errors
    }
  }

  async getUserPortfolioAnalytics(clerkId: string) {
    // Step 1: Find user by clerkId
    const user = await userRepository.findByClerkId(clerkId);
    if (!user) return { totalViews: 0, uniqueVisitors: 0, viewsByDay: [] };

    const ownerUserId = user._id.toString();

    // Step 2: Find all portfolios owned by this user
    const portfolios = await portfolioRepository.find(
      { userId: ownerUserId },
      { _id: 1 }
    );
    const portfolioIds = portfolios.map((p) => p._id);

    if (!portfolioIds.length)
      return { totalViews: 0, uniqueVisitors: 0, viewsByDay: [] };

    // Step 3: Aggregate PortfolioAnalytic
    const viewsByDay = await PortfolioAnalytic.aggregate([
      { $match: { portfolioId: { $in: portfolioIds } } },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
            day: { $dayOfMonth: "$date" },
          },
          totalViews: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
    ]);

    const totalViews = await PortfolioAnalytic.countDocuments({
      portfolioId: { $in: portfolioIds },
    });

    const uniqueVisitorsResult = await PortfolioAnalytic.aggregate([
      { $match: { portfolioId: { $in: portfolioIds } } },
      { $group: { _id: { visitor: "$userId", portfolio: "$portfolioId" } } },
      { $group: { _id: null, uniqueVisitors: { $sum: 1 } } },
    ]);

    const uniqueVisitors =
      uniqueVisitorsResult.length > 0
        ? uniqueVisitorsResult[0].uniqueVisitors
        : 0;

    // Map viewsByDay to an array of { date, views }
    const mappedViewsByDay = viewsByDay.map((r) => ({
      date: new Date(r._id.year, r._id.month - 1, r._id.day),
      views: r.totalViews,
    }));

    return {
      totalViews,
      uniqueVisitors,
      viewsByDay: mappedViewsByDay,
    };
  }

  async getPortfolioAnalytics({
    ownerUserId,
    portfolioIds,
    startDate,
    endDate,
    interval = "daily",
  }: GetPortfolioAnalyticsParams): Promise<PortfolioAnalyticsResult> {
    // Step 1: Get all portfolios of this owner if portfolioIds not provided
    const portfolios =
      portfolioIds && portfolioIds.length
        ? await portfolioRepository.find(
            { _id: { $in: portfolioIds.map((id) => new Types.ObjectId(id)) } },
            { _id: 1 }
          )
        : await portfolioRepository.find({ userId: ownerUserId }, { _id: 1 });

    const ids = portfolios.map((p) => p._id);
    if (!ids.length)
      return { totalViews: 0, uniqueVisitors: 0, viewsByInterval: [] };

    // Step 2: Match analytics for these portfolios within date range
    const matchStage: Record<string, unknown> = { portfolioId: { $in: ids } };
    if (startDate || endDate) {
      matchStage.date = {};
      if (startDate) (matchStage.date as Record<string, Date>).$gte = startDate;
      if (endDate) (matchStage.date as Record<string, Date>).$lte = endDate;
    }

    // Step 3: Group by interval
    let groupId: Record<string, unknown>;
    switch (interval) {
      case "daily":
        groupId = {
          year: { $year: "$date" },
          month: { $month: "$date" },
          day: { $dayOfMonth: "$date" },
        };
        break;
      case "weekly":
        groupId = { year: { $year: "$date" }, week: { $week: "$date" } };
        break;
      case "monthly":
        groupId = { year: { $year: "$date" }, month: { $month: "$date" } };
        break;
      case "yearly":
        groupId = { year: { $year: "$date" } };
        break;
    }

    const results: ViewsByInterval[] = await PortfolioAnalytic.aggregate([
      { $match: matchStage },
      { $group: { _id: groupId, views: { $sum: 1 } } },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1, "_id.week": 1 } },
    ]);

    // Step 4: Total views
    const totalViews = await PortfolioAnalytic.countDocuments({
      portfolioId: { $in: ids },
    });

    // Step 5: Unique visitors across these portfolios
    const uniqueVisitorsAgg: { uniqueVisitors: number }[] =
      await PortfolioAnalytic.aggregate([
        { $match: { portfolioId: { $in: ids } } },
        { $group: { _id: "$userId" } },
        { $count: "uniqueVisitors" },
      ]);

    const uniqueVisitors = uniqueVisitorsAgg.length
      ? uniqueVisitorsAgg[0].uniqueVisitors
      : 0;

    return { totalViews, uniqueVisitors, viewsByInterval: results };
  }
}

export const portfolioAnalyticRepository =
  new PortfolioAnalyticRepositoryClass();

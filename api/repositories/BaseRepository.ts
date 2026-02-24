import type {
  Model,
  Document,
  FilterQuery,
  UpdateQuery,
  QueryOptions,
} from "mongoose";

/**
 * Generic base repository class to encapsulate common
 * database operations for Mongoose models.
 *
 * @template T - Mongoose Document type
 */
export abstract class BaseRepository<T extends Document> {
  protected model: Model<T>;

  /**
   * Creates a new BaseRepository instance for a given Mongoose model.
   * @param model - The Mongoose model to operate on.
   */
  constructor(model: Model<T>) {
    this.model = model;
  }

  /**
   * Creates and saves a new document in the database.
   * @param data - Partial document data to create.
   * @returns The created document.
   */
  async create(data: Partial<T>): Promise<T> {
    const document = new this.model(data);
    return await document.save();
  }

  /**
   * Finds a document by its MongoDB ObjectId.
   * @param id - Document ID.
   * @returns The found document or null if not found.
   */
  async findById(id: string): Promise<T | null> {
    return await this.model.findById(id).exec();
  }

  /**
   * Finds the first document matching the provided filter.
   * @param filter - MongoDB filter query.
   * @returns The found document or null.
   */
  async findOne(filter: FilterQuery<T>): Promise<T | null> {
    return await this.model.findOne(filter).exec();
  }

  /**
   * Finds all documents matching the filter with optional query options.
   * @param filter - MongoDB filter query (default: {} to find all).
   * @param options - Mongoose query options (optional).
   * @returns An array of matching documents.
   */
  async find(
    filter: FilterQuery<T> = {},
    options?: QueryOptions
  ): Promise<T[]> {
    return await this.model.find(filter, null, options).exec();
  }

  /**
   * Finds documents with pagination and sorting.
   * @param filter - MongoDB filter query (default: {}).
   * @param page - Page number (default: 1).
   * @param limit - Number of documents per page (default: 10).
   * @param sort - Sort order (default: descending by createdAt).
   * @returns An object containing data, total count, current page, and total pages.
   */
  async findWithPagination(
    filter: FilterQuery<T> = {},
    page = 1,
    limit = 10,
    sort: FilterQuery<{ createdAt: string }> = { createdAt: -1 }
  ): Promise<{ data: T[]; total: number; page: number; totalPages: number }> {
    const skip = (page - 1) * limit;

    // Run queries in parallel: fetch paginated data and count total documents
    const [data, total] = await Promise.all([
      this.model.find(filter).sort(sort).skip(skip).limit(limit).exec(),
      this.model.countDocuments(filter).exec(),
    ]);

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Updates a document by its ID.
   * @param id - Document ID.
   * @param data - Partial data to update.
   * @returns The updated document or null if not found.
   */
  async update(id: string, data: UpdateQuery<T>): Promise<T | null> {
    return await this.model.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  /**
   * Updates the first document matching the filter.
   * @param filter - MongoDB filter query.
   * @param data - Partial data to update.
   * @returns The updated document or null if not found.
   */
  async updateOne(
    filter: FilterQuery<T>,
    data: UpdateQuery<T>
  ): Promise<T | null> {
    return await this.model
      .findOneAndUpdate(filter, data, { new: true })
      .exec();
  }

  /**
   * Deletes a document by its ID.
   * @param id - Document ID.
   * @returns The deleted document or null if not found.
   */
  async delete(id: string): Promise<T | null> {
    return await this.model.findByIdAndDelete(id).exec();
  }

  /**
   * Deletes multiple documents matching the filter.
   * @param filter - MongoDB filter query.
   * @returns An object containing the number of documents deleted.
   */
  async deleteMany(filter: FilterQuery<T>): Promise<{ deletedCount: number }> {
    const result = await this.model.deleteMany(filter).exec();
    return { deletedCount: result.deletedCount || 0 };
  }

  /**
   * Counts the number of documents matching the filter.
   * @param filter - MongoDB filter query (default: {}).
   * @returns The number of matching documents.
   */
  async count(filter: FilterQuery<T> = {}): Promise<number> {
    return await this.model.countDocuments(filter).exec();
  }

  /**
   * Checks if a document exists matching the filter.
   * @param filter - MongoDB filter query.
   * @returns True if at least one document exists, false otherwise.
   */
  async exists(filter: FilterQuery<T>): Promise<boolean> {
    const doc = await this.model.findOne(filter).select("_id").exec();
    return !!doc;
  }
}

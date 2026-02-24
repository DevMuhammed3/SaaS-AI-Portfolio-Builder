import { BaseRepository } from "./BaseRepository";
import Contact, { ContactDocument } from "@/models/Contact";
import connectDB from "@/lib/database";

export class ContactRepositoryClass extends BaseRepository<ContactDocument> {
  constructor() {
    super(Contact);
  }

  /**
   * Checks if a contact message already exists for the given portfolio and email.
   */
  async existsForPortfolioEmail(
    portfolioId: string,
    email: string
  ): Promise<boolean> {
    await connectDB();
    const existing = await Contact.findOne({ portfolio: portfolioId, email });
    return !!existing;
  }

  /**
   * Saves a new contact message to the database
   */
  async saveContactMessage(data: {
    portfolio: string;
    name: string;
    email: string;
    subject: string;
    message: string;
  }): Promise<ContactDocument> {
    await connectDB();
    const contact = new Contact({
      portfolio: data.portfolio,
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
    });

    return await contact.save();
  }
}

export const contactRepository = new ContactRepositoryClass();

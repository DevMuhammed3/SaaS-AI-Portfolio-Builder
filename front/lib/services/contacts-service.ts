import { apiClient } from "@/lib/api-client";

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactResponse {
  message: string;
  contactId?: string;
  emailResult?: unknown;
}

export class ContactsService {
  static async sendContactMessage(
    slug: string,
    data: ContactFormData
  ): Promise<ContactResponse> {
    const response = await apiClient.post(
      `/api/public/portfolio/${slug}/sendmail`,
      data
    );
    return response.data;
  }

  static async sendContactCompany(
    data: ContactFormData
  ): Promise<ContactResponse> {
    const response = await apiClient.post(`/api/public/sendmail`, data);
    return response.data;
  }
}

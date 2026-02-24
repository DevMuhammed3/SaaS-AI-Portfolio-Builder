import { useState } from "react";
import {
  ContactsService,
  ContactFormData,
} from "@/lib/services/contacts-service";
import { toast } from "sonner";
import { handleApiError } from "@/lib/utils";

interface UseContactReturn {
  sendMessage: (slug: string, data: ContactFormData) => Promise<void>;
  contactCompany: (data: ContactFormData) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export function useContact(): UseContactReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (slug: string, data: ContactFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await ContactsService.sendContactMessage(slug, data);
      toast.success(response.message || "Message sent successfully!");
    } catch (err) {
      handleApiError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const contactCompany = async (data: ContactFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await ContactsService.sendContactCompany(data);
      toast.success(response.message || "Message sent successfully!");
    } catch (err) {
      handleApiError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendMessage,
    contactCompany,
    isLoading,
    error,
  };
}

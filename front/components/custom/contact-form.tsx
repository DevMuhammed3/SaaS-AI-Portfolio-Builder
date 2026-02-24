import { m } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactFormInput, contactFormSchema } from "@/lib/validations/contact";
import { useContact } from "@/hooks/useContacts";
import { handleApiError } from "@/lib/utils";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

export default function ContactForm() {
  const { contactCompany, isLoading } = useContact();

  const form = useForm<contactFormInput>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: contactFormInput) => {
    try {
      await contactCompany(data);
      form.reset();
    } catch (error) {
      // Error is handled in the hook
      handleApiError(error);
    }
  };

  return (
    <m.div
      className="rounded-2xl shadow-lg p-8 md:p-12"
      initial="initial"
      animate="animate"
      variants={fadeInUp}
      id="send"
    >
      <Card className="border-none shadow-white">
        <CardHeader>
          <div className="text-center mb-8">
            <h2 className="mb-4">
              Still Need Help?
            </h2>
            <p className="text-slate-600 dark:text-slate-200">
              Can&apos;t find what you&apos;re looking for? Send us a message
              and we&apos;ll get back to you within 24 hours.
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="portfolio-text-secondary">
                        Name
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Your full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="portfolio-text-secondary">
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="your@email.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="portfolio-text-secondary">
                      Subject
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="What can we help you with?"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="portfolio-text-secondary">
                      Message
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Please describe your issue or question in detail..."
                        rows={6}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                size="lg"
                className="w-full portfolio-bg-primary text-white dark:text-black dark:hover:text-white hover:portfolio-bg-secondary transition-colors"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </m.div>
  );
}

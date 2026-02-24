"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Twitter,
  Instagram,
} from "lucide-react";
import { m } from "framer-motion";
import { LocaleLink } from "@/components/custom/locale-link";
import type { Portfolio } from "@/lib/services/portfolios-service";
import { useContact } from "@/hooks/useContacts";
import { handleApiError } from "@/lib/utils";
import { contactFormInput, contactFormSchema } from "@/lib/validations/contact";

interface PortfolioContactProps {
  portfolio: Portfolio;
}

export function PortfolioContact({ portfolio }: PortfolioContactProps) {
  const { sendMessage, isLoading } = useContact();

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
      await sendMessage(portfolio.slug, data);
      form.reset();
    } catch (error) {
      // Error is handled in the hook
      handleApiError(error);
    }
  };

  const socialIcons = {
    github: Github,
    linkedin: Linkedin,
    twitter: Twitter,
    instagram: Instagram,
  };

  return (
    <section id="contact" className="py-20 bg-muted/20 rounded-lg">
      <div className="container mx-auto px-4">
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 portfolio-text-primary">
            Get In Touch
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have a project in mind or just want to chat? I&apos;d love to hear
            from you.
          </p>
        </m.div>

        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Information */}
          <m.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-bold mb-6 portfolio-text-secondary">
                Let&apos;s Connect
              </h3>
              <p className="text-muted-foreground mb-8">
                I&apos;m always open to discussing new opportunities, creative
                projects, or just having a friendly chat about technology and
                design.
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  icon: Mail,
                  label: "Email",
                  value: portfolio.profile.email,
                  href: `mailto:${portfolio.profile.email}`,
                },
                {
                  icon: Phone,
                  label: "Phone",
                  value: portfolio.profile.phone,
                  href: `tel:${portfolio.profile.phone}`,
                },
                {
                  icon: MapPin,
                  label: "Location",
                  value: portfolio.profile.location,
                },
              ].map(({ icon: Icon, label, value, href }, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="w-12 h-12 portfolio-bg-primary/20 rounded-lg flex items-center justify-center">
                    <Icon className="h-5 w-5 portfolio-text-primary" />
                  </div>
                  <div>
                    <div className="font-medium portfolio-text-primary">
                      {label}
                    </div>
                    {href ? (
                      <a
                        href={href}
                        className="text-muted-foreground hover:portfolio-text-primary transition-colors"
                      >
                        {value}
                      </a>
                    ) : (
                      <div className="text-muted-foreground">{value}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Social Links */}
            <div>
              <h4 className="font-medium mb-4 portfolio-text-primary">
                Follow Me
              </h4>
              <div className="flex gap-4">
                {portfolio.profile.socialMedia.map((social, index) => {
                  const Icon =
                    socialIcons[social.platform as keyof typeof socialIcons];
                  if (!Icon) return null;

                  return (
                    <Button
                      key={index}
                      variant="outline"
                      size="icon"
                      asChild
                      className="portfolio-border-primary border-2 bg-transparent"
                    >
                      <LocaleLink
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="portfolio-text-primary"
                      >
                        <Icon className="h-4 w-4" />
                      </LocaleLink>
                    </Button>
                  );
                })}
              </div>
            </div>
          </m.div>

          {/* Contact Form */}
          <m.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Card className="portfolio-border-primary border-2 rounded-lg">
              <CardHeader>
                <CardTitle className="portfolio-text-primary">
                  Send Me a Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="portfolio-text-secondary">
                              Name
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="Your name" {...field} />
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
                              placeholder="What's this about?"
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
                              placeholder="Tell me about your project or just say hello!"
                              rows={5}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full portfolio-bg-primary text-white hover:portfolio-bg-secondary transition-colors"
                      disabled={isLoading}
                    >
                      {isLoading ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </m.div>
        </div>
      </div>
    </section>
  );
}

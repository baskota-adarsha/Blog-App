import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import SendMessage from "@/components/SendMessage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
};

export default function ContactPage() {
  const faqs = [
    {
      question: "How quickly do you respond to inquiries?",
      answer:
        "We aim to respond to all inquiries within 24-48 hours during business days.",
    },
    {
      question: "Can I write for ModernBlog?",
      answer:
        "Yes! We're always looking for talented writers. Please use the contact form and select 'Guest Post Inquiry' as the subject.",
    },
    {
      question: "Do you offer advertising opportunities?",
      answer:
        "We offer various advertising and sponsorship opportunities. Please contact us with details about your company and goals.",
    },
    {
      question: "How can I report a technical issue with the website?",
      answer:
        "Please use the contact form and select 'Technical Issue' as the subject. Include as many details as possible about the problem you're experiencing.",
    },
    {
      question: "Do you offer consulting services?",
      answer:
        "Some of our team members are available for consulting work. Please contact us with details about your project for more information.",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      {/* Toaster component for notifications */}
      <Toaster position="top-right" />

      {/* Hero Section */}
      <section
        className="bg-white py-12 sm:py-16 lg:py-20 dark:bg-gray-950"
        id="top"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-4 text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
              Get in Touch
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-base text-gray-500 sm:text-lg md:text-xl lg:text-xl dark:text-gray-400">
              Have a question, suggestion, or just want to say hello? We'd love
              to hear from you!
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form and Info Section */}
      <section className="py-12 sm:py-16 lg:py-20" id="contact-form">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-8 lg:gap-12 xl:grid-cols-2">
            {/* Contact Form */}
            <div className="order-2 xl:order-1">
              <h2 className="mb-6 text-xl font-bold sm:text-2xl lg:text-3xl">
                Send Us a Message
              </h2>
              <SendMessage />
            </div>

            {/* Contact Information */}
            <div className="order-1 xl:order-2">
              <h2 className="mb-6 text-xl font-bold sm:text-2xl lg:text-3xl">
                Contact Information
              </h2>
              <div className="mb-8 space-y-4">
                <Card className="transition-shadow hover:shadow-md">
                  <CardContent className="flex items-start space-x-4 p-4 sm:p-6">
                    <Mail className="mt-1 h-5 w-5 flex-shrink-0 text-primary sm:h-6 sm:w-6" />
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-sm sm:text-base">
                        Email
                      </h3>
                      <p className="break-all text-xs text-gray-500 sm:text-sm dark:text-gray-400">
                        contact@modernblog.com
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="transition-shadow hover:shadow-md">
                  <CardContent className="flex items-start space-x-4 p-4 sm:p-6">
                    <Phone className="mt-1 h-5 w-5 flex-shrink-0 text-primary sm:h-6 sm:w-6" />
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-sm sm:text-base">
                        Phone
                      </h3>
                      <p className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">
                        +1 (555) 123-4567
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="transition-shadow hover:shadow-md">
                  <CardContent className="flex items-start space-x-4 p-4 sm:p-6">
                    <MapPin className="mt-1 h-5 w-5 flex-shrink-0 text-primary sm:h-6 sm:w-6" />
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-sm sm:text-base">
                        Office
                      </h3>
                      <p className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">
                        123 Tech Street, San Francisco, CA 94107
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <h2 className="mb-4 text-xl font-bold sm:text-2xl">
                Office Hours
              </h2>
              <div className="mb-6 text-sm text-gray-600 sm:text-base dark:text-gray-300">
                <p className="mb-1">Monday - Friday: 9:00 AM - 5:00 PM (PST)</p>
                <p>Saturday - Sunday: Closed</p>
              </div>

              <div className="mb-6 rounded-lg border p-4 sm:p-6">
                <h3 className="mb-2 font-medium text-sm sm:text-base">
                  Response Time
                </h3>
                <p className="text-xs text-gray-600 sm:text-sm dark:text-gray-300">
                  We aim to respond to all inquiries within 24-48 hours during
                  business days.
                </p>
              </div>

              {/* Social Media Links */}
              <div className="flex flex-wrap gap-3 sm:gap-4">
                <Link
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-transform hover:scale-105"
                >
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 sm:h-12 sm:w-12"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4 sm:h-5 sm:w-5"
                    >
                      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                    </svg>
                    <span className="sr-only">Twitter</span>
                  </Button>
                </Link>
                <Link
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-transform hover:scale-105"
                >
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 sm:h-12 sm:w-12"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4 sm:h-5 sm:w-5"
                    >
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                      <rect width="4" height="12" x="2" y="9"></rect>
                      <circle cx="4" cy="4" r="2"></circle>
                    </svg>
                    <span className="sr-only">LinkedIn</span>
                  </Button>
                </Link>
                <Link
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-transform hover:scale-105"
                >
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 sm:h-12 sm:w-12"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4 sm:h-5 sm:w-5"
                    >
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                    </svg>
                    <span className="sr-only">Facebook</span>
                  </Button>
                </Link>
                <Link
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-transform hover:scale-105"
                >
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 sm:h-12 sm:w-12"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4 sm:h-5 sm:w-5"
                    >
                      <rect
                        width="20"
                        height="20"
                        x="2"
                        y="2"
                        rx="5"
                        ry="5"
                      ></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                    </svg>
                    <span className="sr-only">Instagram</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gray-50 py-12 sm:py-16 lg:py-20 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-8 text-center text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
              Frequently Asked Questions
            </h2>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left text-sm sm:text-base">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm sm:text-base">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <div className="mt-8 text-center">
              <p className="mb-4 text-sm text-gray-600 sm:text-base dark:text-gray-300">
                Don't see your question here? Feel free to contact us directly.
              </p>
              <Button asChild className="w-full sm:w-auto">
                <a href="#contact-form">Ask a Question</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
    </div>
  );
}

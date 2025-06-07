import { Button } from "@/components/ui/button";

import { Home, Coffee } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: {
    absolute: "404  Not Found Page ",
  },
};
export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        {/* 404 Illustration */}
        <div className="relative">
          <div className="text-8xl md:text-9xl font-bold text-slate-200 select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Coffee className="h-16 w-16 text-slate-400 animate-bounce" />
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
            Oops! Page Not Found
          </h1>
          <p className="text-lg text-slate-600 max-w-md mx-auto">
            The page you're looking for seems to have wandered off. Don't worry,
            even the best explorers get lost sometimes!
          </p>
        </div>

        {/* Search Bar */}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        {/* Popular Articles */}

        {/* Footer Message */}
        <div className="text-sm text-slate-500">
          <p>
            Still can't find what you're looking for?{" "}
            <Link href="/contact" className="text-blue-600 hover:underline">
              Contact us
            </Link>{" "}
            and we'll help you out!
          </p>
        </div>
      </div>
    </div>
  );
}

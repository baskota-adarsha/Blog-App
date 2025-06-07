import { Button } from "@/components/ui/button";
import { Home, Coffee } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: {
    absolute: "404 Not Found Page",
  },
};

// Create a separate component for any client-side functionality
function NotFoundContent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="text-8xl md:text-9xl font-bold text-indigo-600 mb-4">
            404
          </div>
          <Coffee className="mx-auto w-16 h-16 text-indigo-400" />
        </div>

        {/* Main Content */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Oops! Page Not Found
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            The page you're looking for seems to have wandered off. Don't worry,
            even the best explorers get lost sometimes!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link href="/">
            <Button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700">
              <Home className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Footer Message */}
        <div className="text-sm text-gray-500">
          <p>
            Still can't find what you're looking for?{" "}
            <Link
              href="/contact"
              className="text-indigo-600 hover:text-indigo-700 underline"
            >
              Contact us
            </Link>{" "}
            and we'll help you out!
          </p>
        </div>
      </div>
    </div>
  );
}

export default function NotFound() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NotFoundContent />
    </Suspense>
  );
}

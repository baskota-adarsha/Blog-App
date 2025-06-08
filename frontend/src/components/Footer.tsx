import Link from "next/link";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="relative border-t bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800">
      {/* Subtle decorative elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50/30 via-transparent to-transparent dark:from-blue-950/20"></div>
      <div className="absolute top-0 left-1/4 w-px h-16 bg-gradient-to-b from-blue-200/50 to-transparent dark:from-blue-800/30"></div>
      <div className="absolute top-0 right-1/3 w-px h-12 bg-gradient-to-b from-purple-200/50 to-transparent dark:from-purple-800/30"></div>

      <div className="relative container px-4 py-16 md:px-6 md:py-20 lg:py-24">
        <div className="grid gap-12 sm:grid-cols-2 md:grid-cols-4">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="group">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
                ModernBlog
              </h3>
              <div className="h-1 w-0 group-hover:w-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-700 ease-out"></div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Discover stories that inspire and inform. Join our community of
              curious minds.
            </p>
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/50 dark:hover:text-blue-400 transition-all duration-300 hover:scale-110"
              >
                <Link
                  href="https://x.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                >
                  <Twitter className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="hover:bg-pink-50 hover:text-pink-600 dark:hover:bg-pink-950/50 dark:hover:text-pink-400 transition-all duration-300 hover:scale-110"
              >
                <Link
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                >
                  <Instagram className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-950/50 dark:hover:text-blue-300 transition-all duration-300 hover:scale-110"
              >
                <Link
                  href="https://www.facebook.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                >
                  <Facebook className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/50 dark:hover:text-red-400 transition-all duration-300 hover:scale-110"
              >
                <Link
                  href="https://www.youtube.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Youtube"
                >
                  <Youtube className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Categories Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white relative">
              Categories
              <div className="absolute -bottom-2 left-0 h-0.5 w-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
            </h3>
            <ul className="space-y-3">
              {[
                { name: "Technology", href: "/posts?category=Technology" },
                { name: "Design", href: "/posts?category=Design" },
                { name: "Development", href: "/posts?category=Development" },
                { name: "Business", href: "/posts?category=Business" },
                { name: "Lifestyle", href: "/posts?category=Lifestyle" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 hover:translate-x-1 inline-block group"
                  >
                    <span className="relative">
                      {item.name}
                      <div className="absolute -bottom-0.5 left-0 h-0.5 w-0 group-hover:w-full bg-blue-500 transition-all duration-300"></div>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white relative">
              Quick Links
              <div className="absolute -bottom-2 left-0 h-0.5 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
            </h3>
            <ul className="space-y-3">
              {[
                { name: "Home", href: "/" },
                { name: "Blog", href: "/posts" },
                { name: "About", href: "/about" },
                { name: "Contact", href: "/contact" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300 hover:translate-x-1 inline-block group"
                  >
                    <span className="relative">
                      {item.name}
                      <div className="absolute -bottom-0.5 left-0 h-0.5 w-0 group-hover:w-full bg-purple-500 transition-all duration-300"></div>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white relative">
              Stay Updated
              <div className="absolute -bottom-2 left-0 h-0.5 w-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-full"></div>
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Get the latest posts and updates delivered straight to your inbox.
            </p>
            <div className="p-4 bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-xl border border-gray-200/50 dark:border-gray-600/50">
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center font-medium">
                ✨ Coming Soon ✨
              </p>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-16 pt-8 border-t border-gray-200/60 dark:border-gray-700/60">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} ModernBlog. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

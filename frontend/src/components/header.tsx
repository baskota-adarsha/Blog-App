"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

import { useState } from "react";
import SearchComponent from "./SearchComp";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const pathname = usePathname() || "/";
  const isActiveLink = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  const handleMobileLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  const handleMobileSearchClose = () => {
    setIsMobileSearchOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/80 bg-white/95 backdrop-blur-lg supports-[backdrop-filter]:bg-white/80 shadow-sm">
      <div className="container flex h-14 sm:h-16 lg:h-20 items-center justify-between px-3 sm:px-4 md:px-6 max-w-7xl mx-auto">
        {/* Left Section - Logo and Mobile Menu */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-6">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden hover:bg-gray-100 rounded-xl transition-all duration-200 h-8 w-8 sm:h-9 sm:w-9"
              >
                <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-[260px] sm:w-[280px] md:w-[320px] bg-white border-r border-gray-200"
            >
              <VisuallyHidden>
                <SheetTitle>Navigation Menu</SheetTitle>
                <SheetDescription>
                  Main navigation menu for the website
                </SheetDescription>
              </VisuallyHidden>
              <nav className="flex flex-col gap-4 sm:gap-6 py-6 sm:py-8">
                <Link
                  href="/"
                  onClick={handleMobileLinkClick}
                  className={`text-base sm:text-lg font-semibold transition-colors duration-200 px-2 py-1 rounded-lg ${
                    isActiveLink("/")
                      ? "text-pink-600 bg-pink-50"
                      : "text-gray-900 hover:text-pink-600 hover:bg-pink-25"
                  }`}
                >
                  Home
                </Link>
                <Link
                  href="/posts"
                  onClick={handleMobileLinkClick}
                  className={`text-base sm:text-lg font-semibold transition-colors duration-200 px-2 py-1 rounded-lg ${
                    isActiveLink("/posts")
                      ? "text-pink-600 bg-pink-50"
                      : "text-gray-900 hover:text-pink-600 hover:bg-pink-25"
                  }`}
                >
                  Posts
                </Link>
                <Link
                  href="/about"
                  onClick={handleMobileLinkClick}
                  className={`text-base sm:text-lg font-semibold transition-colors duration-200 px-2 py-1 rounded-lg ${
                    isActiveLink("/about")
                      ? "text-pink-600 bg-pink-50"
                      : "text-gray-900 hover:text-pink-600 hover:bg-pink-25"
                  }`}
                >
                  About
                </Link>
                <Link
                  href="/contact"
                  onClick={handleMobileLinkClick}
                  className={`text-base sm:text-lg font-semibold transition-colors duration-200 px-2 py-1 rounded-lg ${
                    isActiveLink("/contact")
                      ? "text-pink-600 bg-pink-50"
                      : "text-gray-900 hover:text-pink-600 hover:bg-pink-25"
                  }`}
                >
                  Contact
                </Link>
              </nav>
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
            <div className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
              <span className="text-white font-bold text-xs sm:text-sm lg:text-base">
                MB
              </span>
            </div>
            <span className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent hidden xs:block">
              ModernBlog
            </span>
            {/* Shorter version for very small screens */}
            <span className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent block xs:hidden">
              Modern Blog
            </span>
          </Link>
        </div>

        {/* Center Section - Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors duration-200 relative group py-2 ${
              isActiveLink("/")
                ? "text-pink-600"
                : "text-gray-700 hover:text-pink-600"
            }`}
          >
            Home
            <span
              className={`absolute -bottom-1 left-0 h-0.5 bg-pink-600 transition-all duration-200 ${
                isActiveLink("/") ? "w-full" : "w-0 group-hover:w-full"
              }`}
            ></span>
          </Link>
          <Link
            href="/posts"
            className={`text-sm font-medium transition-colors duration-200 relative group py-2 ${
              isActiveLink("/posts")
                ? "text-pink-600"
                : "text-gray-700 hover:text-pink-600"
            }`}
          >
            Posts
            <span
              className={`absolute -bottom-1 left-0 h-0.5 bg-pink-600 transition-all duration-200 ${
                isActiveLink("/posts") ? "w-full" : "w-0 group-hover:w-full"
              }`}
            ></span>
          </Link>
          <Link
            href="/about"
            className={`text-sm font-medium transition-colors duration-200 relative group py-2 ${
              isActiveLink("/about")
                ? "text-pink-600"
                : "text-gray-700 hover:text-pink-600"
            }`}
          >
            About
            <span
              className={`absolute -bottom-1 left-0 h-0.5 bg-pink-600 transition-all duration-200 ${
                isActiveLink("/about") ? "w-full" : "w-0 group-hover:w-full"
              }`}
            ></span>
          </Link>
          <Link
            href="/contact"
            className={`text-sm font-medium transition-colors duration-200 relative group py-2 ${
              isActiveLink("/contact")
                ? "text-pink-600"
                : "text-gray-700 hover:text-pink-600"
            }`}
          >
            Contact
            <span
              className={`absolute -bottom-1 left-0 h-0.5 bg-pink-600 transition-all duration-200 ${
                isActiveLink("/contact") ? "w-full" : "w-0 group-hover:w-full"
              }`}
            ></span>
          </Link>
        </nav>

        {/* Right Section - Search */}
        <div className="flex items-center flex-shrink-0">
          {/* Desktop Search */}
          <div className="hidden sm:flex items-center relative">
            <div className="relative group">
              <SearchComponent />
            </div>
          </div>

          {/* Mobile Search Button */}
          <div className="flex sm:hidden">
            <Sheet
              open={isMobileSearchOpen}
              onOpenChange={setIsMobileSearchOpen}
            >
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-gray-100 rounded-lg transition-all duration-200 h-7 w-7 xs:h-8 xs:w-8 flex-shrink-0"
                >
                  <SearchIcon className="h-3.5 w-3.5 xs:h-4 xs:w-4" />
                  <span className="sr-only">Search</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="top"
                className="min-h-[280px] max-h-[90vh] w-full bg-white/95 backdrop-blur-lg supports-[backdrop-filter]:bg-white/90 border-b border-gray-200/50 shadow-xl"
              >
                <VisuallyHidden>
                  <SheetTitle>Search</SheetTitle>
                  <SheetDescription>
                    Search for articles and content on the website
                  </SheetDescription>
                </VisuallyHidden>

                {/* Enhanced Mobile Search Container */}
                <div className="flex flex-col h-full py-4 px-2 sm:px-4">
                  {/* Header with close button */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                        <SearchIcon className="h-4 w-4 text-white" />
                      </div>
                      <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                        Search
                      </h3>
                    </div>
                  </div>

                  {/* Search Input Area */}
                  <div className="flex-1 space-y-4">
                    <div className="relative">
                      <div className="bg-gray-50/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50 shadow-sm">
                        <SearchComponent onClose={handleMobileSearchClose} />
                      </div>
                    </div>

                    {/* Search Hints/Tips */}
                    <div className="px-2">
                      <p className="text-sm text-gray-500 leading-relaxed">
                        💡 Search for articles, topics, or keywords to find
                        relevant content
                      </p>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex flex-wrap gap-2 px-2 pt-2">
                      <span className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2 w-full">
                        Quick Links
                      </span>
                      <Link
                        href="/posts"
                        onClick={handleMobileSearchClose}
                        className="inline-flex items-center px-3 py-1.5 bg-pink-50 text-pink-700 text-sm font-medium rounded-full hover:bg-pink-100 transition-colors duration-200"
                      >
                        All Posts
                      </Link>
                      <Link
                        href="/about"
                        onClick={handleMobileSearchClose}
                        className="inline-flex items-center px-3 py-1.5 bg-purple-50 text-purple-700 text-sm font-medium rounded-full hover:bg-purple-100 transition-colors duration-200"
                      >
                        About
                      </Link>
                      <Link
                        href="/contact"
                        onClick={handleMobileSearchClose}
                        className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-medium rounded-full hover:bg-blue-100 transition-colors duration-200"
                      >
                        Contact
                      </Link>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}

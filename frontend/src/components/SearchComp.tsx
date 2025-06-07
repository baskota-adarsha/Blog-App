// SearchComponent.tsx
"use client";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";

interface SearchComponentProps {
  onClose?: () => void;
}

const SearchComponent = ({ onClose }: SearchComponentProps) => {
  const searchParams = useSearchParams();
  const currentQuery = searchParams.get("q") || "";
  const [searchQuery, setSearchQuery] = useState(currentQuery);
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();

  const handleSearch = () => {
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery !== "") {
      // Add timestamp to force navigation even for same query
      const timestamp = Date.now();
      router.push(
        `/search?q=${encodeURIComponent(trimmedQuery)}&t=${timestamp}`
      );

      // Close mobile search sheet if onClose is provided with a small delay
      if (onClose) {
        // Use setTimeout to ensure navigation happens first
        setTimeout(() => {
          onClose();
        }, 100);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="flex items-center gap-2 w-full max-w-full">
      <div
        className={`relative flex items-center transition-all duration-300 ${
          isFocused ? "scale-105" : "scale-100"
        }`}
      >
        {/* Search Input Container */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search
              className={`h-4 w-4 transition-colors duration-200 ${
                isFocused ? "text-pink-500" : "text-gray-400"
              }`}
            />
          </div>

          <Input
            value={searchQuery}
            type="search"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles, topics..."
            className={`
              w-full sm:w-[280px] md:w-[320px] lg:w-[360px] 
              pl-10 pr-12 py-2.5
              border-2 rounded-2xl
              bg-white/80 backdrop-blur-sm
              text-gray-900 placeholder:text-gray-500
              transition-all duration-300 ease-in-out
              focus:ring-0 focus:outline-none
              ${
                isFocused
                  ? "border-pink-500 shadow-lg shadow-pink-500/20 bg-white"
                  : "border-gray-200 hover:border-gray-300 shadow-sm"
              }
            `}
          />

          {/* Clear Button */}
        </div>

        {/* Search Button - Desktop */}
        <Button
          onClick={handleSearch}
          className={`
            ml-2 px-4 py-2.5 rounded-2xl
            bg-gradient-to-r from-pink-500 to-purple-600 
            text-white font-medium
            hover:from-pink-600 hover:to-purple-700
            focus:ring-2 focus:ring-pink-500 focus:ring-offset-2
            transform transition-all duration-200 ease-in-out
            hover:scale-105 hover:shadow-lg
            active:scale-95
            hidden sm:flex items-center gap-2
          `}
        >
          <Search className="h-4 w-4" />
          <span className="hidden md:inline">Search</span>
        </Button>

        {/* Search Button - Mobile */}
        <Button
          onClick={handleSearch}
          size="icon"
          className={`
            ml-2 w-10 h-10 rounded-2xl
            bg-gradient-to-r from-pink-500 to-purple-600 
            text-white
            hover:from-pink-600 hover:to-purple-700
            focus:ring-2 focus:ring-pink-500 focus:ring-offset-2
            transform transition-all duration-200 ease-in-out
            hover:scale-105 hover:shadow-lg
            active:scale-95
            sm:hidden
          `}
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default SearchComponent;

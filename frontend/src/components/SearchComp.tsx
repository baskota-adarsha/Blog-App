// Enhanced SearchComponent.tsx
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";

interface SearchComponentProps {
  initialQuery?: string;
  onClose?: () => void;
}

const SearchComponent = ({
  initialQuery = "",
  onClose,
}: SearchComponentProps) => {
  const [query, setQuery] = useState(initialQuery);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = (formData: FormData) => {
    const q = formData.get("q") as string;
    const trimmedQuery = q?.trim();

    if (trimmedQuery) {
      startTransition(() => {
        const timestamp = Date.now();
        router.push(
          `/search?q=${encodeURIComponent(trimmedQuery)}&t=${timestamp}`
        );
        onClose?.();
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose?.();
    }
  };

  return (
    <div className="flex items-center gap-2 w-full max-w-full">
      <form action={handleSearch} className="flex items-center gap-2 w-full">
        <div className="relative flex items-center transition-all duration-300">
          {/* Search Input Container */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>

            <Input
              ref={inputRef}
              name="q"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              type="search"
              placeholder="Search articles, topics..."
              autoComplete="off"
              autoFocus={!!onClose} // Auto-focus when used in mobile modal
              className="
                w-full sm:w-[280px] md:w-[320px] lg:w-[360px] 
                pl-10 pr-12 py-2.5
                border-2 rounded-2xl
                bg-white/80 backdrop-blur-sm
                text-gray-900 placeholder:text-gray-500
                transition-all duration-300 ease-in-out
                focus:ring-0 focus:outline-none
                border-gray-200 hover:border-gray-300 shadow-sm
                focus:border-pink-500 focus:shadow-lg focus:shadow-pink-500/20 focus:bg-white
              "
            />
          </div>

          {/* Search Button - Desktop */}
          <Button
            type="submit"
            disabled={isPending || !query.trim()}
            className="
              ml-2 px-4 py-2.5 rounded-2xl
              bg-gradient-to-r from-pink-500 to-purple-600 
              text-white font-medium
              hover:from-pink-600 hover:to-purple-700
              focus:ring-2 focus:ring-pink-500 focus:ring-offset-2
              transform transition-all duration-200 ease-in-out
              hover:scale-105 hover:shadow-lg
              active:scale-95
              disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
              hidden sm:flex items-center gap-2
            "
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            <span className="hidden md:inline">
              {isPending ? "Searching..." : "Search"}
            </span>
          </Button>

          {/* Search Button - Mobile */}
          <Button
            type="submit"
            size="icon"
            disabled={isPending || !query.trim()}
            className="
              ml-2 w-10 h-10 rounded-2xl
              bg-gradient-to-r from-pink-500 to-purple-600 
              text-white
              hover:from-pink-600 hover:to-purple-700
              focus:ring-2 focus:ring-pink-500 focus:ring-offset-2
              transform transition-all duration-200 ease-in-out
              hover:scale-105 hover:shadow-lg
              active:scale-95
              disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
              sm:hidden
            "
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SearchComponent;

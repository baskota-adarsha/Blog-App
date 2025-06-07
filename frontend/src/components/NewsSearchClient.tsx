// components/NewsSearchClient.tsx
"use client";
import { useState, useEffect } from "react";
import { IPost } from "@/interface/post";
import Link from "next/link";
import NewsSearchPageSkeleton from "./NewsSearchPageSkeleton";

// Helper functions (can be moved to utils if shared)
function formatDate(dateString: string) {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
}

function getDomain(url: string) {
  try {
    const domain = new URL(url).hostname.replace("www.", "");
    return domain.charAt(0).toUpperCase() + domain.slice(1);
  } catch {
    return "News Source";
  }
}

function getReadingTime(content: string) {
  const wordsPerMinute = 200;
  const wordCount = content.split(" ").length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min read`;
}

// Updated interface for API response
interface ApiResponse {
  posts: IPost[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    nextPage: number | null;
    prevPage: number | null;
  };
}

async function getNewsArticles(
  searchParam: string,
  page: number = 0,
  limit: number = 9
): Promise<ApiResponse> {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(
      `${API_URL}/api/getPosts?search=${searchParam}&page=${page}&limit=${limit}&t=${Date.now()}`,
      {
        cache: "no-store",
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch post");
    }

    return response.json();
  } catch (error) {
    return {
      posts: [],
      pagination: {
        currentPage: 0,
        totalPages: 0,
        totalCount: 0,
        limit: 9,
        hasNextPage: false,
        hasPrevPage: false,
        nextPage: null,
        prevPage: null,
      },
    };
  }
}

interface NewsSearchClientProps {
  query: string;
}

export default function NewsSearchClient({ query }: NewsSearchClientProps) {
  const [newsArticles, setNewsArticles] = useState<IPost[]>([]);
  const [pagination, setPagination] = useState<
    ApiResponse["pagination"] | null
  >(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const postsPerPage = 9;

  const fetchNews = async (page: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getNewsArticles(query, page, postsPerPage);
      setNewsArticles(response.posts);
      setPagination(response.pagination);
      setCurrentPage(page);
    } catch (err) {
      setError("Failed to fetch articles");
      setNewsArticles([]);
      setPagination(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNews(0); // Start with page 0
  }, [query]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && pagination && newPage < pagination.totalPages) {
      fetchNews(newPage);
      // Scroll to top when changing pages
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const generatePageNumbers = () => {
    if (!pagination || pagination.totalPages <= 1) return [];

    const pages = [];
    // For very small screens, show fewer page numbers
    const maxVisiblePages = window.innerWidth <= 314 ? 3 : 5;
    const currentPage = pagination.currentPage;
    const totalPages = pagination.totalPages;

    let startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);

    // Adjust start page if we're near the end
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(0, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  // Show skeleton while loading
  if (isLoading) {
    return <NewsSearchPageSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center p-4 xs:p-6 sm:p-8 mx-2">
          <h2 className="text-lg xs:text-xl sm:text-2xl font-bold text-red-600 mb-3 xs:mb-4">
            Error Loading Articles
          </h2>
          <p className="text-slate-600 text-sm xs:text-base mb-3 xs:mb-4">
            {error}
          </p>
          <button
            onClick={() => fetchNews(currentPage)}
            className="w-full xs:w-auto px-4 xs:px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors text-sm xs:text-base"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Show no results
  if (newsArticles.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Enhanced Search Header - Ultra Small Responsive */}
        <div className="bg-white/90 backdrop-blur-xl border-b border-slate-200/60 shadow-lg">
          <div className="max-w-7xl mx-auto px-2 xs:px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center py-6 xs:py-8 sm:py-10 lg:py-20">
              <div className="w-full max-w-4xl">
                <div className="text-center mb-6 xs:mb-8 sm:mb-10">
                  <h1 className="text-2xl xs:text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2 xs:mb-3 px-2">
                    Search Results
                  </h1>
                  <p className="text-slate-600 text-sm xs:text-base sm:text-lg px-2">
                    Discover the latest news and insights
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced No Results Content - Ultra Small Responsive */}
        <div className="max-w-4xl mx-auto px-2 xs:px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center min-h-[60vh] py-8 xs:py-12 sm:py-16 lg:py-20">
            {/* No Results Message */}
            <div className="text-center mb-8 xs:mb-12 sm:mb-16 w-full">
              <h2 className="text-lg xs:text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 mb-3 xs:mb-4 sm:mb-6 px-2 leading-tight">
                No articles found for{" "}
                <span className="text-indigo-600 font-black break-words">
                  '{query || "your search"}'
                </span>
              </h2>
              <p className="text-slate-600 text-base xs:text-lg sm:text-xl mb-6 xs:mb-8 sm:mb-12 max-w-md mx-auto leading-relaxed px-2">
                Let's help you find what you're looking for
              </p>

              {/* Enhanced Suggestions Card - Ultra Small Responsive */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl xs:rounded-3xl shadow-2xl p-4 xs:p-6 sm:p-8 lg:p-10 max-w-xl mx-auto border border-slate-200/50">
                <div className="flex items-center justify-center mb-4 xs:mb-6 sm:mb-8">
                  <div className="w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-indigo-500 via-blue-500 to-purple-600 rounded-xl xs:rounded-2xl flex items-center justify-center shadow-lg">
                    <svg
                      className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                  </div>
                </div>

                <h3 className="text-lg xs:text-xl sm:text-2xl font-bold text-slate-900 mb-4 xs:mb-6 sm:mb-8">
                  Search Tips
                </h3>

                <div className="space-y-3 xs:space-y-4 sm:space-y-5">
                  <div className="flex items-start gap-2 xs:gap-3 sm:gap-4 p-3 xs:p-4 rounded-xl xs:rounded-2xl bg-slate-50 hover:bg-slate-100 transition-all duration-300 hover:scale-[1.02]">
                    <div className="w-2 h-2 xs:w-3 xs:h-3 bg-indigo-500 rounded-full mt-1 xs:mt-2 flex-shrink-0"></div>
                    <span className="text-slate-700 font-semibold text-left text-sm xs:text-base leading-relaxed">
                      Check your spelling and try different keywords
                    </span>
                  </div>
                  <div className="flex items-start gap-2 xs:gap-3 sm:gap-4 p-3 xs:p-4 rounded-xl xs:rounded-2xl bg-slate-50 hover:bg-slate-100 transition-all duration-300 hover:scale-[1.02]">
                    <div className="w-2 h-2 xs:w-3 xs:h-3 bg-blue-500 rounded-full mt-1 xs:mt-2 flex-shrink-0"></div>
                    <span className="text-slate-700 font-semibold text-left text-sm xs:text-base leading-relaxed">
                      Use broader terms or search for trending topics
                    </span>
                  </div>
                  <div className="flex items-start gap-2 xs:gap-3 sm:gap-4 p-3 xs:p-4 rounded-xl xs:rounded-2xl bg-slate-50 hover:bg-slate-100 transition-all duration-300 hover:scale-[1.02]">
                    <div className="w-2 h-2 xs:w-3 xs:h-3 bg-purple-500 rounded-full mt-1 xs:mt-2 flex-shrink-0"></div>
                    <span className="text-slate-700 font-semibold text-left text-sm xs:text-base leading-relaxed">
                      Try searching by author or news source
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show results
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Enhanced Search Header with Results - Ultra Small Responsive */}
      <div className="bg-white/90 backdrop-blur-xl border-b border-slate-200/60 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-2 xs:px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center py-6 xs:py-8 sm:py-10 lg:py-14">
            <div className="w-full max-w-4xl">
              <div className="text-center mb-4 xs:mb-6 sm:mb-8">
                <h1 className="text-xl xs:text-2xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-1 xs:mb-2 px-2 leading-tight">
                  Search Results
                </h1>
                <p className="text-slate-600 text-sm xs:text-base px-2 leading-relaxed">
                  Found{" "}
                  <span className="font-bold text-indigo-600">
                    {pagination?.totalCount || 0} articles
                  </span>{" "}
                  {query && <span className="break-words">for "{query}"</span>}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Results Content - Ultra Small Responsive */}
      <div className="max-w-7xl mx-auto px-2 xs:px-4 sm:px-6 lg:px-8 py-6 xs:py-8 sm:py-12 lg:py-16">
        {/* Results Grid */}
        <div className="grid gap-4 xs:gap-6 sm:gap-8 lg:gap-10">
          {newsArticles.map((article: IPost) => (
            <article
              key={article._id}
              className="group bg-white/80 backdrop-blur-sm rounded-2xl xs:rounded-3xl shadow-lg hover:shadow-2xl border border-slate-200/50 hover:border-indigo-200 transition-all duration-500 hover:-translate-y-1 xs:hover:-translate-y-2 overflow-hidden"
            >
              <Link
                href={`/posts/${article._id}`}
                className="flex flex-col lg:flex-row h-full"
              >
                {/* Enhanced Image Section - Ultra Small Responsive */}
                <div className="flex-shrink-0 lg:w-80">
                  <div className="relative w-full h-40 xs:h-48 sm:h-56 md:h-64 lg:h-full overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
                    {article.urlToImage ? (
                      <img
                        src={article.urlToImage}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : null}

                    {/* Fallback when no image */}
                    <div
                      className={`${
                        article.urlToImage ? "hidden" : ""
                      } absolute inset-0 bg-gradient-to-br from-indigo-500 via-blue-500 to-purple-600 flex items-center justify-center`}
                    >
                      <div className="text-center p-3 xs:p-4 sm:p-6 lg:p-8">
                        <div className="text-lg xs:text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-black mb-1 xs:mb-2 sm:mb-3 text-white drop-shadow-xl leading-tight">
                          {getDomain(article.url)}
                        </div>
                        <div className="text-xs xs:text-sm font-bold uppercase tracking-wider text-white/90 leading-relaxed">
                          News Article
                        </div>
                      </div>
                    </div>

                    {/* Overlay with source badge */}
                    <div className="absolute top-2 xs:top-3 sm:top-4 left-2 xs:left-3 sm:left-4">
                      <div className="bg-white/95 backdrop-blur-sm px-2 xs:px-3 sm:px-4 py-1 xs:py-1.5 sm:py-2 rounded-full shadow-lg">
                        <span className="text-xs xs:text-sm font-bold text-slate-800 leading-none">
                          {getDomain(article.url)}
                        </span>
                      </div>
                    </div>

                    {/* Reading time badge */}
                    <div className="absolute top-2 xs:top-3 sm:top-4 right-2 xs:right-3 sm:right-4">
                      <div className="bg-indigo-500/90 backdrop-blur-sm px-2 xs:px-3 py-1 rounded-full shadow-lg">
                        <span className="text-xs font-semibold text-white leading-none">
                          {getReadingTime(article.content)}
                        </span>
                      </div>
                    </div>

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                  </div>
                </div>

                {/* Enhanced Content Section - Ultra Small Responsive */}
                <div className="flex-1 p-4 xs:p-5 sm:p-6 md:p-8 lg:p-10 flex flex-col">
                  <div className="flex-1">
                    <div className="mb-4 xs:mb-5 sm:mb-6">
                      <div className="flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-3 mb-3 xs:mb-4">
                        {article.author && (
                          <span className="inline-block px-3 xs:px-4 py-1 xs:py-2 text-xs xs:text-sm font-bold text-indigo-600 bg-indigo-100 rounded-full">
                            By {article.author}
                          </span>
                        )}
                        <span className="text-xs xs:text-sm text-slate-500 font-medium">
                          {formatDate(article.publishedAt)}
                        </span>
                      </div>

                      <h2 className="text-lg xs:text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors duration-300 mb-3 xs:mb-4 sm:mb-5 leading-tight line-clamp-3">
                        {article.title}
                      </h2>

                      <p className="text-slate-600 text-sm xs:text-base sm:text-lg leading-relaxed mb-4 xs:mb-5 sm:mb-6 line-clamp-3">
                        {article.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3 xs:gap-4 pt-4 xs:pt-5 sm:pt-6 border-t border-slate-200/60">
                    <div className="flex items-center gap-2 xs:gap-4 text-xs xs:text-sm text-slate-500">
                      <div className="flex items-center gap-1 xs:gap-2">
                        <svg
                          className="w-3 h-3 xs:w-4 xs:h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="font-medium">
                          {formatDate(article.publishedAt)}
                        </span>
                      </div>
                    </div>

                    <span className="group/btn flex items-center justify-center gap-2 xs:gap-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-4 xs:px-5 sm:px-6 py-2 xs:py-2.5 sm:py-3 rounded-xl xs:rounded-2xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg text-sm xs:text-base">
                      Read Article
                      <svg
                        className="w-3 h-3 xs:w-4 xs:h-4 group-hover/btn:translate-x-1 transition-transform duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>

        {/* Enhanced Pagination - Ultra Small Responsive */}
        {pagination && pagination.totalPages > 1 && (
          <>
            <div className="mt-8 xs:mt-12 sm:mt-16 lg:mt-20 flex flex-col items-center gap-4 xs:gap-6">
              {/* Page Info - Always Visible on Small Screens */}
              <div className="px-4 xs:px-6 sm:px-8 py-2 xs:py-3 sm:py-4 bg-white/80 backdrop-blur-sm rounded-xl xs:rounded-2xl shadow-lg border border-slate-200/50">
                <span className="text-xs xs:text-sm font-semibold text-slate-600">
                  Page {pagination.currentPage + 1} of {pagination.totalPages}
                </span>
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center justify-center gap-1 xs:gap-2 sm:gap-3 w-full max-w-sm">
                {/* Previous Button */}
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                  className={`w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 rounded-lg xs:rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-300 ${
                    pagination.hasPrevPage
                      ? "bg-white/80 text-slate-700 hover:bg-indigo-500 hover:text-white shadow-lg"
                      : "bg-slate-200 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  <svg
                    className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>

                {/* Page Numbers */}
                {generatePageNumbers().map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 rounded-lg xs:rounded-xl sm:rounded-2xl font-bold transition-all duration-300 text-xs xs:text-sm sm:text-base ${
                      pageNum === pagination.currentPage
                        ? "bg-indigo-500 text-white shadow-lg"
                        : "bg-white/80 text-slate-700 hover:bg-indigo-500 hover:text-white shadow-lg"
                    }`}
                  >
                    {pageNum + 1}
                  </button>
                ))}

                {/* Show ellipsis and last page if needed - Hide on very small screens */}
                {pagination &&
                  pagination.totalPages > 3 &&
                  pagination.currentPage < pagination.totalPages - 2 &&
                  window.innerWidth > 314 && (
                    <>
                      <span className="text-slate-400 px-1 xs:px-2 text-xs xs:text-sm">
                        ...
                      </span>
                      <button
                        onClick={() =>
                          handlePageChange(pagination.totalPages - 1)
                        }
                        className="w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 bg-white/80 text-slate-700 hover:bg-indigo-500 hover:text-white rounded-lg xs:rounded-xl sm:rounded-2xl font-bold transition-all duration-300 shadow-lg text-xs xs:text-sm sm:text-base"
                      >
                        {pagination.totalPages}
                      </button>
                    </>
                  )}

                {/* Next Button */}
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                  className={`w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 rounded-lg xs:rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-300 ${
                    pagination.hasNextPage
                      ? "bg-white/80 text-slate-700 hover:bg-indigo-500 hover:text-white shadow-lg"
                      : "bg-slate-200 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  <svg
                    className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>

              {/* Total Results Info */}
              <div className="px-4 xs:px-6 sm:px-8 py-2 xs:py-3 sm:py-4 bg-white/80 backdrop-blur-sm rounded-xl xs:rounded-2xl shadow-lg border border-slate-200/50">
                <span className="text-xs xs:text-sm font-semibold text-slate-600">
                  {pagination.totalCount} results
                </span>
              </div>
            </div>

            {/* Results Info - Detailed */}
            <div className="mt-4 xs:mt-6 sm:mt-10 text-center">
              <div className="inline-block px-4 xs:px-6 sm:px-8 py-2 xs:py-3 sm:py-4 bg-white/80 backdrop-blur-sm rounded-xl xs:rounded-2xl shadow-lg border border-slate-200/50">
                <span className="text-xs xs:text-sm text-slate-600 leading-relaxed">
                  Showing {pagination.currentPage * postsPerPage + 1} -{" "}
                  {Math.min(
                    (pagination.currentPage + 1) * postsPerPage,
                    pagination.totalCount
                  )}{" "}
                  of {pagination.totalCount} articles
                  {query && (
                    <span className="block xs:inline">
                      {" "}
                      for{" "}
                      <span className="font-semibold break-words">
                        "{query}"
                      </span>
                    </span>
                  )}
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

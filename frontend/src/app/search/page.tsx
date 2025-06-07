import { Suspense } from "react";
import type { Metadata } from "next";
import NewsSearchClient from "@/components/NewsSearchClient";
import NewsSearchPageSkeleton from "@/components/NewsSearchPageSkeleton";

// ✅ Fix: Make generateMetadata async and await searchParams
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}): Promise<Metadata> {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams.q || "";

  return {
    title: query ? `Search Results for "${query}"` : "Search Results",
    description: query
      ? `Search results for "${query}"`
      : "Search for news articles",
  };
}

interface PageProps {
  searchParams: Promise<{
    q?: string;
  }>;
}

// ✅ Fix: Make the page component async and await searchParams
export default async function NewsSearchPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams.q || "";

  return (
    <Suspense fallback={<NewsSearchPageSkeleton />}>
      <NewsSearchClient query={query} />
    </Suspense>
  );
}

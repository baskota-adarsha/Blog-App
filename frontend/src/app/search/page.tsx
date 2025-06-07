import { Suspense } from "react";
import type { Metadata } from "next";
import NewsSearchClient from "@/components/NewsSearchClient";
import NewsSearchPageSkeleton from "@/components/NewsSearchPageSkeleton";

// Fix: Make generateMetadata async and properly handle searchParams
export async function generateMetadata({
  searchParams,
}: {
  searchParams: { q?: string };
}): Promise<Metadata> {
  const query = searchParams.q || "";

  return {
    title: query ? `Search Results for "${query}"` : "Search Results",
    description: query
      ? `Search results for "${query}"`
      : "Search for news articles",
  };
}

interface PageProps {
  searchParams: { q?: string };
}

// Fix: Make the page component properly handle searchParams
export default function NewsSearchPage({ searchParams }: PageProps) {
  const query = searchParams.q || "";

  return (
    <Suspense fallback={<NewsSearchPageSkeleton />}>
      <NewsSearchClient query={query} />
    </Suspense>
  );
}

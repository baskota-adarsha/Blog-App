import { PostGrid } from "@/components/PostGrid";
import { BlogHeader } from "@/components/BlogHeader";
import { CategoryFilter } from "@/components/CategoryFilter";
import { Suspense } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Posts",
};

interface BlogPageProps {
  searchParams: Promise<{ category?: string }>;
}

// Move the skeleton to page level
function PostGridSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 9 }).map((_, index) => (
        <div key={index} className="h-full overflow-hidden border rounded-lg">
          <div className="aspect-video bg-gray-200 animate-pulse" />
          <div className="p-4">
            <div className="flex items-center mb-4">
              <div className="h-3 w-3 bg-gray-200 rounded mr-1 animate-pulse" />
              <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="mb-4">
              <div className="h-6 bg-gray-200 rounded animate-pulse mb-2" />
              <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="space-y-2 mb-4">
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-6 w-6 bg-gray-200 rounded-full animate-pulse" />
              <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const currentCategory = params.category || "All";

  return (
    <div className="flex min-h-screen flex-col">
      <BlogHeader />

      <div className="container mx-auto px-4 py-12 md:px-6">
        <div className="mb-8">
          <CategoryFilter currentCategory={currentCategory} />
        </div>

        <Suspense key={currentCategory} fallback={<PostGridSkeleton />}>
          <PostGrid category={currentCategory} />
        </Suspense>
      </div>
    </div>
  );
}

// page.tsx
import { Suspense } from "react";
import NewsSearchClient from "@/components/NewsSearchClient"; // This now handles everything
import NewsSearchPageSkeleton from "@/components/NewsSearchPageSkeleton";

export default function NewsSearchPage() {
  return <NewsSearchClient />; // No need to pass query as prop
}

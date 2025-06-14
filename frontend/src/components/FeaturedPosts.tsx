import Link from "next/link";
import { Calendar } from "lucide-react";
import { Suspense } from "react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import NoPosts from "./NoPosts";

interface IPost {
  _id: string;
  title: string;
  description: string;
  content: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  author: string;
}

// Skeleton component for loading state
function PostSkeleton() {
  return (
    <Card className="h-full overflow-hidden">
      <div className="aspect-video bg-gray-200 animate-pulse" />
      <CardHeader className="p-4">
        <div className="flex items-center justify-between">
          <div className="h-5 w-16 bg-gray-200 rounded animate-pulse" />
          <div className="flex items-center">
            <div className="h-3 w-3 bg-gray-200 rounded mr-1 animate-pulse" />
            <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="mb-2">
          <div className="h-6 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
      </CardFooter>
    </Card>
  );
}

// Skeleton grid component
function FeaturedPostsSkeleton() {
  return (
    <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <PostSkeleton key={index} />
      ))}
    </div>
  );
}

async function getPosts(): Promise<IPost[]> {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    const response = await fetch(` ${API_URL}/api/getPosts?featured=true`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data.posts || [];
  } catch (error) {
    return [];
  }
}

async function FeaturedPostsContent() {
  const posts = await getPosts();

  if (posts.length === 0) {
    return (
      <NoPosts names=" Featured Posts" links="/posts" message="Browse Posts" />
    );
  }

  return (
    <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <Link key={post._id} href={`/posts/${post._id}`} className="group">
          <Card className="h-full overflow-hidden transition-all duration-200 hover:shadow-md">
            <div className="aspect-video overflow-hidden">
              <img
                src={post.urlToImage}
                alt={post.title}
                className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
              />
            </div>
            <CardHeader className="p-4">
              <div className="flex items-center justify-between">
                <Badge variant="secondary">{post.author}</Badge>
                <div className="flex items-center text-xs text-gray-500">
                  <Calendar className="mr-1 h-3 w-3" />
                  {new Date(post.publishedAt).toLocaleDateString()}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <h3 className="mb-2 line-clamp-2 text-xl font-bold">
                {post.title}
              </h3>
              <p className="line-clamp-3 text-sm text-gray-500">
                {post.description}
              </p>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <span className="text-sm font-medium text-primary">
                Read more
              </span>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
}

// Main export component with Suspense
export function FeaturedPosts() {
  return (
    <Suspense fallback={<FeaturedPostsSkeleton />}>
      <FeaturedPostsContent />
    </Suspense>
  );
}

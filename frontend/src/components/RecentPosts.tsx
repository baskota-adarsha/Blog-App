import Link from "next/link";
import { Calendar } from "lucide-react";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { IPost } from "@/interface/post";
import { Suspense } from "react";
import NoPosts from "./NoPosts";
function RecentPostSkeleton() {
  return (
    <Card className="h-full overflow-hidden">
      <div className="aspect-video bg-gray-200 animate-pulse" />

      <CardContent className="p-4 pt-0">
        <div className="mb-2">
          <div className="h-5 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between p-4 pt-0">
        <div className="flex items-center space-x-2">
          <div className="h-6 w-6 bg-gray-200 rounded-full animate-pulse" />
          <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="flex items-center space-x-2">
          <div className="h-3 w-3 bg-gray-200 rounded animate-pulse" />
          <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
        </div>
      </CardFooter>
    </Card>
  );
}
function RecentPostsSkeleton() {
  return (
    <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <RecentPostSkeleton key={index} />
      ))}
    </div>
  );
}
async function getRecentPosts(): Promise<IPost[]> {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    const response = await fetch(`${API_URL}/api/getPosts?recent=true`, {
      next: { revalidate: 1 },
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
export async function RecentPostsContent() {
  const recentPosts = await getRecentPosts();

  // In a real app, you would fetch this data from an API
  if (recentPosts.length === 0) {
    return (
      <NoPosts names=" Recent Posts" links="/posts" message="Browse Posts" />
    );
  }
  return (
    <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {recentPosts.map((post) => (
        <Link key={post._id} href={`/posts/${post._id}`} className="group">
          <Card className="h-full overflow-hidden transition-all duration-200 hover:shadow-md">
            <div className="aspect-video overflow-hidden">
              <img
                src={post.urlToImage}
                alt={post.title}
                className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
              />
            </div>

            <CardContent className="p-4 pt-0">
              <h3 className="mb-2 line-clamp-2 text-lg font-bold">
                {post.title}
              </h3>
              <p className="line-clamp-2 text-sm text-gray-500">
                {post.description}
              </p>
            </CardContent>
            <CardFooter className="flex items-center justify-between p-4 pt-0">
              <div className="flex items-center space-x-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-xs">{post.author}</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <div className="flex items-center">
                  <Calendar className="mr-1 h-3 w-3" />
                  {new Date(post.publishedAt).toLocaleDateString()}
                </div>
              </div>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
}

export default function RecentPosts() {
  return (
    <Suspense fallback={<RecentPostsSkeleton />}>
      <RecentPostsContent />
    </Suspense>
  );
}

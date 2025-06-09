import Link from "next/link";
import { Calendar } from "lucide-react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { IPost } from "@/interface/post";
import NoPosts from "./NoPosts";

interface PostGridProps {
  category?: string;
}

// Skeleton component for individual posts

async function getPosts(category?: string): Promise<IPost[]> {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(
      category === "All"
        ? `${API_URL}/api/getPosts?limit=30`
        : `${API_URL}/api/getPosts?search=${category}`,
      {
        next: { revalidate: 43200 },
      }
    );
    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data.posts || [];
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

export async function PostGrid({ category }: PostGridProps) {
  const posts = await getPosts(category);

  if (posts.length === 0) {
    return <NoPosts names="Posts" links="/" message="Go to Home" />;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <Link key={post._id} href={`/posts/${post._id}`} className="group">
          <Card className="h-full overflow-hidden transition-all duration-200 hover:shadow-md">
            <div className="aspect-video overflow-hidden">
              <img
                src={post.urlToImage || "/placeholder.svg"}
                alt={post.title}
                className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
              />
            </div>
            <CardHeader className="p-4">
              <div className="flex items-center justify-between">
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
            <CardFooter className="flex items-center justify-between p-4 pt-0">
              <div className="flex items-center space-x-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-xs">{post.author}</span>
              </div>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
}

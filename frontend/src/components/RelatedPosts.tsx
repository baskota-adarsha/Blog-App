import Link from "next/link";

import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface RelatedPostsProps {
  currentPostId: string;
}
import { IPost } from "@/interface/post";
async function getRelatedPosts(currentPostId: string): Promise<IPost[]> {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(
      `${API_URL}/api/getPosts?related=${currentPostId}`,
      {
        next: { revalidate: 3600 },
      }
    );
    if (!response.ok) {
      return [];
    }
    const data = await response.json();
    return data.posts || [];
  } catch (error) {
    console.error("Error fetching post:", error);
    return [];
  }
}
export async function RelatedPosts({ currentPostId }: RelatedPostsProps) {
  const relatedPosts = await getRelatedPosts(currentPostId);
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {relatedPosts.map((post) => (
        <Link key={post._id} href={`/posts/${post._id}`} className="group">
          <Card className="h-full overflow-hidden transition-all duration-200 hover:shadow-md">
            <div className="aspect-video overflow-hidden">
              <img
                src={post.urlToImage}
                alt={post.title}
                className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
              />
            </div>
            <CardContent className="p-4">
              <h3 className="mb-2 line-clamp-2 text-lg font-bold">
                {post.title}
              </h3>
              <p className="line-clamp-2 text-sm text-gray-500">
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

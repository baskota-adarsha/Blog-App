import Link from "next/link";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { Suspense } from "react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

import { SocialShare } from "@/components/SocialShare";
import { RelatedPosts } from "@/components/RelatedPosts";
import "./styles.css";
import type { Metadata } from "next";

// Skeleton component for blog post loading
function BlogPostSkeleton() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="container mx-auto px-4 py-6 md:px-6 md:py-12">
        <div className="mb-8">
          <div className="h-9 w-32 bg-gray-200 rounded animate-pulse" />
        </div>

        <div className="mx-auto max-w-3xl">
          <div className="mb-8 space-y-4">
            {/* Title skeleton */}
            <div className="space-y-3">
              <div className="h-8 bg-gray-200 rounded animate-pulse" />
              <div className="h-8 w-3/4 bg-gray-200 rounded animate-pulse" />
              <div className="h-8 w-1/2 bg-gray-200 rounded animate-pulse" />
            </div>

            {/* Author info skeleton */}
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse" />
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Cover image skeleton */}
          <div className="mb-8 overflow-hidden rounded-xl">
            <div className="aspect-video w-full bg-gray-200 animate-pulse" />
          </div>

          {/* Article content skeleton */}
          <article className="article-content">
            <div className="space-y-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="space-y-3">
                  <div className="h-5 bg-gray-200 rounded animate-pulse" />
                  <div className="h-5 bg-gray-200 rounded animate-pulse" />
                  <div className="h-5 w-4/5 bg-gray-200 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </article>

          <div className="my-8">
            <div className="h-px bg-gray-200 animate-pulse" />
          </div>

          {/* Share section skeleton */}
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="flex space-x-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-10 w-10 bg-gray-200 rounded animate-pulse"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Related posts skeleton */}
        <div className="mx-auto mt-16 max-w-5xl">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-8" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="space-y-3">
                <div className="aspect-video bg-gray-200 rounded animate-pulse" />
                <div className="h-5 bg-gray-200 rounded animate-pulse" />
                <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

async function getPost(slug: string) {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${API_URL}/api/getPosts?_id=${slug}`);
    if (!response.ok) {
      return [];
    }
    const data = await response.json();

    return data.posts;
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

// ✅ Fix: Dynamic metadata generation - await params
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const post = await getPost(resolvedParams.slug);

  if (!post || !post[0]) {
    return {
      title: "Post Not Found",
      description: "The requested blog post could not be found.",
    };
  }

  return {
    title: post[0].title,
    description: post[0].description || "Read this blog post",
  };
}

// ✅ Fix: BlogPostContent component - await params
async function BlogPostContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const getPosts = await getPost(resolvedParams.slug);
  const post = await getPosts;

  if (!post || !post[0]) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Post Not Found</h1>
          <p className="text-gray-600">
            The requested blog post could not be found.
          </p>
          <Link href="/posts">
            <Button variant="ghost" size="sm" className="gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="container mx-auto px-4 py-6 md:px-6 md:py-12">
        <div className="mb-8">
          <Link href="/posts">
            <Button variant="ghost" size="sm" className="gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Button>
          </Link>
        </div>

        <div className="mx-auto max-w-3xl">
          <div className="mb-8 space-y-4">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl leading-tight">
              {post[0].title}
            </h1>

            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarFallback>{post[0].author.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <div className="flex items-center space-x-2 text-sm">
                  <User className="h-4 w-4 text-gray-500" />
                  <span>{post[0].author}</span>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(post[0].publishedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8 overflow-hidden rounded-xl">
            <img
              alt="Cover Image"
              className="aspect-video w-full object-cover"
              height="600"
              src={post[0].urlToImage || "/placeholder.svg"}
              width="1200"
            />
          </div>

          {/* Enhanced article content styling */}
          <article className="article-content">
            {post[0].content && (
              <>
                {/* If content contains HTML tags */}
                {/<[^>]*>/g.test(post[0].content) ? (
                  <div
                    className="prose prose-xl max-w-none dark:prose-invert prose-headings:font-bold prose-headings:tracking-tight prose-p:text-lg prose-p:leading-relaxed prose-p:mb-6 prose-li:text-lg prose-li:leading-relaxed prose-blockquote:text-xl prose-blockquote:italic prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-6 prose-img:rounded-lg prose-img:shadow-lg"
                    dangerouslySetInnerHTML={{ __html: post[0].content }}
                  />
                ) : (
                  /* If content is plain text - split by sentences */
                  <div className="space-y-6">
                    {post[0].content
                      .split(/(?<=[.!?])\s+/) // Split by sentence-ending punctuation followed by whitespace
                      .filter((sentence: string) => sentence.trim() !== "")
                      .map((sentence: string, index: number) => (
                        <p
                          key={index}
                          className="text-lg leading-relaxed text-gray-800 dark:text-gray-200 font-serif"
                        >
                          {sentence.trim()}
                        </p>
                      ))}
                  </div>
                )}
              </>
            )}
          </article>

          <Separator className="my-8" />

          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div className="text-sm font-medium">Share this article</div>
            <SocialShare
              url={`/blog/${resolvedParams.slug}`}
              title={post[0].title}
            />
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-5xl">
          <h2 className="mb-8 text-2xl font-bold">Related Articles</h2>
          <RelatedPosts currentPostId={resolvedParams.slug} />
        </div>
      </div>
    </div>
  );
}

// ✅ Fix: Main component - update params type
export default function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense fallback={<BlogPostSkeleton />}>
      <BlogPostContent params={params} />
    </Suspense>
  );
}

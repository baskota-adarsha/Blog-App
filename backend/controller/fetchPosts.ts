import axios from "axios";
import dotenv from "dotenv";
import { PostModel } from "../model/Blog.model";
import { IPost } from "../model/Blog.model";
import * as cheerio from "cheerio";
import { Request, Response } from "express";
import cron from "node-cron";
dotenv.config();

// Function to scrape full content from article URL with focus on The Verge
async function scrapeFullContent(url: string): Promise<string> {
  try {
    // Set custom headers to mimic a real browser and avoid being blocked
    const headers = {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.5",
      Referer: "https://www.google.com/",
      "Cache-Control": "max-age=0",
    };

    const response = await axios.get(url, { headers, timeout: 10000 });

    const $ = cheerio.load(response.data);

    let content = "";

    // Special handling for The Verge
    if (url.includes("theverge.com")) {
      content = extractVergeContent($);
    } else {
      // Generic extraction for other sites
      content = extractGenericContent($);
    }

    // If content is still empty or too short, try fallback methods
    if (!content || content.length < 200) {
      content = extractFallbackContent($);
    }

    // Clean up the content
    content = cleanContent(content);

    return content || "Could not extract full content from the URL";
  } catch (error: any) {
    console.error(`Error scraping content from ${url}:`, error);
    return `Error fetching full content: ${error.message}`;
  }
}

// Specific extractor for The Verge
function extractVergeContent($: cheerio.CheerioAPI): string {
  // The Verge uses several different article layouts, so we need to check multiple selectors

  // First try the main content container for newer articles
  let content = "";

  // Primary content selectors for The Verge
  const primarySelectors = [
    // Newer article format selectors
    ".duet--article--article-body-component",
    ".duet--article--lede-body",
    ".c-entry-content",
    ".l-col__main",

    // Older article format selectors
    ".article-content",
    ".entry-content",
    ".c-entry-content .e-content",
    "#content .c-entry-content",
  ];

  // Try each selector
  for (const selector of primarySelectors) {
    const element = $(selector);
    if (element.length) {
      // Process the content to remove non-article elements
      element
        .find(
          "aside, .c-related-list, .c-share-social, script, style, .ad, .advertisement, .c-message-callout, .c-newsletter-signup"
        )
        .remove();

      // Get paragraphs and headings
      const paragraphs: string[] = [];
      element.find("p, h2, h3, h4, blockquote, ul li, ol li").each((_, el) => {
        const text = $(el).text().trim();
        if (text) paragraphs.push(text);
      });

      content = paragraphs.join("\n\n");
      if (content.length > 0) break;
    }
  }

  return content;
}

// Generic content extractor for other sites
function extractGenericContent($: cheerio.CheerioAPI): string {
  let content = "";

  // Common article content selectors
  const selectors = [
    "article",
    "main article",
    ".article-content",
    ".post-content",
    ".entry-content",
    ".content",
    ".story-body",
    "#article-body",
    ".article__content",
  ];

  for (const selector of selectors) {
    const element = $(selector);
    if (element.length) {
      // Remove non-content elements
      element
        .find(
          "script, style, meta, noscript, iframe, .ads, .related-articles, .social-share, .newsletter"
        )
        .remove();

      // Extract paragraphs
      const paragraphs: string[] = [];
      element.find("p, h2, h3, h4, blockquote, ul li, ol li").each((_, el) => {
        const text = $(el).text().trim();
        if (text) paragraphs.push(text);
      });

      content = paragraphs.join("\n\n");
      if (content.length > 0) break;
    }
  }

  return content;
}

// Fallback method when other methods fail
function extractFallbackContent($: cheerio.CheerioAPI): string {
  $(
    "header, footer, nav, aside, .sidebar, .ads, .comments, .related, script, style"
  ).remove();

  // Try to find the main content area by looking for the largest text block
  const bodyText = $("body").text();

  // Another approach: find all paragraphs and concatenate them
  const paragraphs: string[] = [];
  $("p").each((_, el) => {
    const text = $(el).text().trim();
    if (text && text.length > 50) {
      // Only consider substantial paragraphs
      paragraphs.push(text);
    }
  });

  return paragraphs.length > 0 ? paragraphs.join("\n\n") : bodyText;
}

// Clean up the extracted content
function cleanContent(content: string): string {
  if (!content) return "";

  // Remove excessive whitespace
  content = content.replace(/\s+/g, " ").trim();

  // Remove common filler phrases that might appear in scraped content
  const fillersToRemove = [
    "Please enable JavaScript to view this site.",
    "Advertisement",
    "Please turn JavaScript on and reload the page.",
    "Sign up for our newsletter",
    "Subscribe to our newsletter",
  ];

  for (const filler of fillersToRemove) {
    content = content.replace(new RegExp(filler, "gi"), "");
  }

  return content.trim();
}

// Extract description from content if none is provided
function extractDescription(content: string): string {
  if (!content) return "No description available";

  // Take the first ~150 characters as description, ending at a complete sentence
  const maxLength = 150;
  let description = content.substring(0, maxLength);

  // Try to end at a sentence boundary
  const lastPeriod = description.lastIndexOf(".");
  if (lastPeriod > maxLength * 0.5) {
    // Only truncate if we have a substantial sentence
    description = description.substring(0, lastPeriod + 1);
  } else if (description.length === maxLength) {
    // If we cut in the middle of text, add ellipsis
    description += "...";
  }

  return description;
}

export const fetchPostsAndSave = async (
  req?: Request,
  res?: Response
): Promise<any> => {
  try {
    console.log("🔄 Starting scheduled post fetch and cleanup...");

    if (!process.env.news_api) {
      const error = "News API URL not defined in environment variables";
      console.error("❌", error);
      if (res) return res.status(400).json(error);
      throw new Error(error);
    }

    // Step 1: Clear all existing posts from the database
    try {
      const deletedCount = await PostModel.deleteMany({});
      console.log(
        `🗑️ Removed ${deletedCount.deletedCount} old posts from database`
      );
    } catch (deleteError: any) {
      console.error("❌ Error clearing old posts:", deleteError.message);
      // Continue with fetching new posts even if deletion fails
    }

    // Step 2: Fetch new posts from API
    console.log("📡 Fetching new posts from API...");
    const response = await axios.get(process.env.news_api);
    const posts = response.data.articles;

    if (!posts || posts.length === 0) {
      const message = "No posts found from API";
      console.log("⚠️", message);
      if (res) return res.status(200).json(message);
      return { success: false, message };
    }

    console.log(`📰 Found ${posts.length} posts to process`);
    const savedPosts: IPost[] = [];
    let processedCount = 0;

    // Step 3: Process and save new posts
    for (const post of posts) {
      processedCount++;
      console.log(
        `📝 Processing post ${processedCount}/${
          posts.length
        }: ${post.title?.substring(0, 50)}...`
      );

      // Check if content needs to be scraped
      let fullContent = post.content || "";
      const needsScraping =
        post.url &&
        (!fullContent ||
          fullContent.includes("[+") ||
          fullContent.includes("... [") ||
          fullContent.includes("...") ||
          fullContent.length < 1000);

      if (needsScraping) {
        try {
          console.log(`🔍 Scraping full content for: ${post.url}`);
          // Add a small delay to avoid overloading the target site
          await new Promise((resolve) => setTimeout(resolve, 1000));
          fullContent = await scrapeFullContent(post.url);
        } catch (scrapeError: any) {
          console.error(
            `❌ Failed to scrape content for ${post.url}:`,
            scrapeError.message
          );
          // Keep the original content if scraping fails
          fullContent = fullContent || "Content unavailable";
        }
      }

      // Ensure description exists, generate one from content if needed
      let description = post.description;
      if (!description || description.trim() === "") {
        description = extractDescription(fullContent);
      }

      const newPost = new PostModel({
        title: post.title || "Untitled Article",
        description: description,
        content: fullContent || "No content available",
        url: post.url,
        urlToImage: post.urlToImage,
        publishedAt: post.publishedAt || new Date(),
        author: post.author || "Unknown Author",
        source: post.source || { id: null, name: "Unknown Source" },
      });

      try {
        await newPost.save();
        savedPosts.push(newPost);
        console.log(`✅ Saved: ${post.title?.substring(0, 50)}...`);
      } catch (saveError: any) {
        console.error(
          `❌ Error saving post "${post.title}":`,
          saveError.message
        );
        // Continue with the next post instead of failing the entire process
      }
    }

    const successMessage = `Successfully processed ${savedPosts.length} articles`;
    console.log(`🎉 ${successMessage}`);

    const result = {
      success: true,
      message: successMessage,
      count: savedPosts.length,
      posts: savedPosts,
    };

    if (res) {
      return res.status(200).json(result);
    }

    return result;
  } catch (error: any) {
    const errorMessage = `Error in fetchPostsAndSave: ${error.message}`;
    console.error("❌", errorMessage);

    if (res) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong",
        error: error.message,
      });
    }

    throw error;
  }
};

// Store the cron task reference for status tracking
let scheduledTask: any = null;

// Scheduled task to run every 12 hours
export const startPostScheduler = () => {
  // Run every 12 hours (at 00:00 and 12:00)
  scheduledTask = cron.schedule(
    "0 0,12 * * *",
    async () => {
      console.log(
        "⏰ Scheduled post fetch triggered at:",
        new Date().toISOString()
      );

      try {
        await fetchPostsAndSave();
        console.log("✅ Scheduled post fetch completed successfully");
      } catch (error: any) {
        console.error("❌ Scheduled post fetch failed:", error.message);
      }
    },
    {
      timezone: "UTC", // Adjust timezone as needed
    }
  );

  // Start the task
  scheduledTask.start();

  console.log("🚀 Post scheduler started - will run every 12 hours");

  // Optional: Run immediately on startup
  // Uncomment the next line if you want to fetch posts immediately when the server starts
  // fetchPostsAndSave().catch(console.error);
};

// Manual trigger endpoint (useful for testing or manual refresh)
export const manualPostRefresh = async (req: Request, res: Response) => {
  try {
    console.log("🔄 Manual post refresh triggered");
    await fetchPostsAndSave(req, res);
  } catch (error: any) {
    console.error("❌ Manual post refresh failed:", error.message);
    res.status(500).json({
      success: false,
      message: "Manual refresh failed",
      error: error.message,
    });
  }
};

// Get scheduler status
export const getSchedulerStatus = (req: Request, res: Response) => {
  const isActive = scheduledTask !== null;

  res.json({
    schedulerActive: isActive,
    taskStatus: scheduledTask ? "running" : "stopped",
    nextRun: "Every 12 hours at 00:00 and 12:00 UTC",
    lastCheck: new Date().toISOString(),
  });
};

// Optional: Stop the scheduler (useful for cleanup)
export const stopPostScheduler = () => {
  if (scheduledTask) {
    scheduledTask.stop();
    scheduledTask = null;
    console.log("🛑 Post scheduler stopped");
  }
};
export const getPosts = async (req: Request, res: Response) => {
  try {
    const isFeatured = req.query.featured === "true";
    const isRecent = req.query.recent === "true";
    const particularPost = req.query._id;
    const relatedPost = req.query.related;
    const searchPosts =
      typeof req.query.search === "string" ? req.query.search : "";

    // Pagination parameters
    const page = parseInt(req.query.page as string) || 0; // Default to page 0
    const limit = parseInt(req.query.limit as string) || 9; // Default to 9 posts per page
    const skip = page * limit;

    let posts: IPost[];
    let totalCount = 0;

    if (isFeatured) {
      // Return 3 featured posts (no pagination needed for featured)
      posts = await PostModel.find({}).sort({ publishedAt: 1 }).limit(3);
      totalCount = 3;
    } else if (isRecent) {
      // Return recent posts, sorted by createdAt descending (no pagination needed for recent)
      posts = await PostModel.find({}).sort({ publishedAt: -1 }).limit(4);
      totalCount = 4;
    } else if (particularPost) {
      posts = await PostModel.find({ _id: particularPost });
      totalCount = posts.length;
    } else if (relatedPost) {
      posts = await PostModel.find({ _id: { $ne: relatedPost } }).limit(3);
      totalCount = 3;
    } else if (searchPosts) {
      // Search with pagination
      const searchQuery = { $text: { $search: searchPosts } };

      // Get total count for pagination info
      totalCount = await PostModel.countDocuments(searchQuery);

      // Get paginated results
      posts = await PostModel.find(searchQuery)
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(limit);
    } else {
      // Return all posts with pagination
      totalCount = await PostModel.countDocuments({});
      posts = await PostModel.find({})
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(limit);
    }

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages - 1;
    const hasPrevPage = page > 0;

    // Return posts with pagination metadata
    res.status(200).json({
      posts,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
        hasNextPage,
        hasPrevPage,
        nextPage: hasNextPage ? page + 1 : null,
        prevPage: hasPrevPage ? page - 1 : null,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch posts" });
  }
};

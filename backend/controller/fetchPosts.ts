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

// Enhanced fetchPostsAndSave with better logging and error handling
export const fetchPostsAndSave = async (
  req?: Request,
  res?: Response
): Promise<any> => {
  const startTime = new Date();
  try {
    console.log(
      `🔄 Starting scheduled post fetch and cleanup at ${startTime.toISOString()}`
    );

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
    const response = await axios.get(process.env.news_api, {
      timeout: 30000, // 30 second timeout
      headers: {
        "User-Agent": "NewsApp/1.0",
      },
    });
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

    const endTime = new Date();
    const duration = endTime.getTime() - startTime.getTime();
    const successMessage = `Successfully processed ${savedPosts.length} articles in ${duration}ms`;
    console.log(`🎉 ${successMessage}`);

    const result = {
      success: true,
      message: successMessage,
      count: savedPosts.length,
      posts: savedPosts,
      executionTime: duration,
      timestamp: endTime.toISOString(),
    };

    if (res) {
      return res.status(200).json(result);
    }

    return result;
  } catch (error: any) {
    const endTime = new Date();
    const duration = endTime.getTime() - startTime.getTime();
    const errorMessage = `Error in fetchPostsAndSave after ${duration}ms: ${error.message}`;
    console.error("❌", errorMessage);
    console.error("Stack trace:", error.stack);

    if (res) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong",
        error: error.message,
        executionTime: duration,
        timestamp: endTime.toISOString(),
      });
    }

    throw error;
  }
};

// Store the cron task reference and execution history
let scheduledTask: any = null;
let lastExecution: Date | null = null;
let executionHistory: Array<{
  timestamp: Date;
  success: boolean;
  message: string;
}> = [];

// Add execution to history (keep last 10 executions)
const addToHistory = (success: boolean, message: string) => {
  executionHistory.unshift({
    timestamp: new Date(),
    success,
    message,
  });

  // Keep only last 10 executions
  if (executionHistory.length > 10) {
    executionHistory = executionHistory.slice(0, 10);
  }
};

// Enhanced scheduler with better error handling and logging
export const startPostScheduler = () => {
  console.log("🔧 Initializing post scheduler...");

  // Validate cron pattern
  const cronPattern = "0 0,12 * * *";
  if (!cron.validate(cronPattern)) {
    console.error("❌ Invalid cron pattern:", cronPattern);
    return;
  }

  // Create scheduled task
  scheduledTask = cron.schedule(
    cronPattern,
    async () => {
      const executionStart = new Date();
      console.log(
        `⏰ Scheduled post fetch triggered at: ${executionStart.toISOString()}`
      );
      console.log(`📊 System time: ${new Date().toString()}`);
      console.log(`🌍 UTC time: ${new Date().toUTCString()}`);

      try {
        const result = await fetchPostsAndSave();
        lastExecution = executionStart;
        const successMessage = `Scheduled post fetch completed successfully - ${result.count} posts processed`;
        console.log(`✅ ${successMessage}`);
        addToHistory(true, successMessage);
      } catch (error: any) {
        lastExecution = executionStart;
        const errorMessage = `Scheduled post fetch failed: ${error.message}`;
        console.error(`❌ ${errorMessage}`);
        console.error("Full error:", error);
        addToHistory(false, errorMessage);
      }
    },
    {
      timezone: "UTC",
    }
  );

  // Start the task (it starts automatically when created)
  try {
    console.log("🚀 Post scheduler created and started successfully");
    console.log(`⏰ Next execution times (UTC): 00:00 and 12:00 daily`);
    console.log(`🕐 Current UTC time: ${new Date().toUTCString()}`);

    // Log when the next execution will be
    const now = new Date();
    const nextHour = now.getUTCHours() < 12 ? 12 : 24;
    const nextExecution = new Date(now);
    nextExecution.setUTCHours(nextHour === 24 ? 0 : nextHour, 0, 0, 0);
    if (nextHour === 24) {
      nextExecution.setUTCDate(nextExecution.getUTCDate() + 1);
    }
    console.log(`⏭️ Next scheduled execution: ${nextExecution.toISOString()}`);
  } catch (error: any) {
    console.error("❌ Failed to start scheduler:", error.message);
  }
};

// Manual trigger endpoint with enhanced logging
export const manualPostRefresh = async (req: Request, res: Response) => {
  try {
    console.log(
      `🔄 Manual post refresh triggered at ${new Date().toISOString()}`
    );
    const result = await fetchPostsAndSave(req, res);
    addToHistory(
      true,
      `Manual refresh completed - ${result.count} posts processed`
    );
  } catch (error: any) {
    console.error("❌ Manual post refresh failed:", error.message);
    addToHistory(false, `Manual refresh failed: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Manual refresh failed",
      error: error.message,
    });
  }
};

// Enhanced scheduler status with execution history
export const getSchedulerStatus = (req: Request, res: Response) => {
  const isActive = scheduledTask !== null;
  const now = new Date();

  // Calculate next execution time
  const currentHour = now.getUTCHours();
  const nextHour = currentHour < 12 ? 12 : 24;
  const nextExecution = new Date(now);
  nextExecution.setUTCHours(nextHour === 24 ? 0 : nextHour, 0, 0, 0);
  if (nextHour === 24) {
    nextExecution.setUTCDate(nextExecution.getUTCDate() + 1);
  }

  res.json({
    schedulerActive: isActive,
    taskStatus: scheduledTask ? "running" : "stopped",
    cronPattern: "0 0,12 * * *",
    timezone: "UTC",
    currentTime: now.toISOString(),
    currentUTCTime: now.toUTCString(),
    nextScheduledRun: nextExecution.toISOString(),
    lastExecution: lastExecution?.toISOString() || "Never",
    executionHistory: executionHistory,
    serverUptime: process.uptime(),
    nodeVersion: process.version,
    platform: process.platform,
  });
};

// Health check endpoint for the scheduler
export const schedulerHealthCheck = (req: Request, res: Response) => {
  const isHealthy = scheduledTask !== null;
  const recentFailures = executionHistory
    .filter((exec) => !exec.success)
    .filter(
      (exec) => Date.now() - exec.timestamp.getTime() < 24 * 60 * 60 * 1000
    ); // Last 24 hours

  res.status(isHealthy ? 200 : 503).json({
    healthy: isHealthy,
    schedulerRunning: scheduledTask !== null,
    recentFailures: recentFailures.length,
    lastExecution: lastExecution?.toISOString() || "Never",
    uptime: process.uptime(),
  });
};

// Test cron execution (for debugging)
export const testCronExecution = async (req: Request, res: Response) => {
  try {
    console.log("🧪 Testing cron execution manually...");
    const result = await fetchPostsAndSave();
    res.json({
      success: true,
      message: "Test execution completed",
      result: result,
    });
  } catch (error: any) {
    console.error("❌ Test execution failed:", error.message);
    res.status(500).json({
      success: false,
      message: "Test execution failed",
      error: error.message,
    });
  }
};

// Stop scheduler with cleanup
export const stopPostScheduler = () => {
  if (scheduledTask) {
    try {
      scheduledTask.stop();
      scheduledTask.destroy();
      scheduledTask = null;
      console.log("🛑 Post scheduler stopped successfully");
    } catch (error: any) {
      console.error("❌ Error stopping scheduler:", error.message);
    }
  } else {
    console.log("⚠️ No active scheduler to stop");
  }
};

// Restart scheduler
export const restartPostScheduler = (req: Request, res: Response) => {
  try {
    console.log("🔄 Restarting post scheduler...");
    stopPostScheduler();
    startPostScheduler();
    res.json({
      success: true,
      message: "Scheduler restarted successfully",
    });
  } catch (error: any) {
    console.error("❌ Failed to restart scheduler:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to restart scheduler",
      error: error.message,
    });
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

import axios from "axios";
import dotenv from "dotenv";
import { PostModel } from "../model/Blog.model";
import { IPost } from "../model/Blog.model";
import * as cheerio from "cheerio";
import { Request, Response } from "express";
import cron from "node-cron";
import mongoose from "mongoose";
dotenv.config();

// Check if MongoDB is connected
function isMongoConnected(): boolean {
  return mongoose.connection.readyState === 1;
}

// Wait for MongoDB connection with timeout
async function waitForMongoConnection(timeoutMs: number = 30000): Promise<boolean> {
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeoutMs) {
    if (isMongoConnected()) {
      console.log("✅ MongoDB connection verified");
      return true;
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.error("❌ MongoDB connection timeout");
  return false;
}

// Function to scrape full content from article URL with focus on The Verge
async function scrapeFullContent(url: string): Promise<string> {
  try {
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

    if (url.includes("theverge.com")) {
      content = extractVergeContent($);
    } else {
      content = extractGenericContent($);
    }

    if (!content || content.length < 200) {
      content = extractFallbackContent($);
    }

    content = cleanContent(content);
    return content || "Could not extract full content from the URL";
  } catch (error: any) {
    console.error(`Error scraping content from ${url}:`, error.message);
    return `Error fetching full content: ${error.message}`;
  }
}

function extractVergeContent($: cheerio.CheerioAPI): string {
  let content = "";
  const primarySelectors = [
    ".duet--article--article-body-component",
    ".duet--article--lede-body",
    ".c-entry-content",
    ".l-col__main",
    ".article-content",
    ".entry-content",
    ".c-entry-content .e-content",
    "#content .c-entry-content",
  ];

  for (const selector of primarySelectors) {
    const element = $(selector);
    if (element.length) {
      element
        .find(
          "aside, .c-related-list, .c-share-social, script, style, .ad, .advertisement, .c-message-callout, .c-newsletter-signup"
        )
        .remove();

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

function extractGenericContent($: cheerio.CheerioAPI): string {
  let content = "";
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
      element
        .find(
          "script, style, meta, noscript, iframe, .ads, .related-articles, .social-share, .newsletter"
        )
        .remove();

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

function extractFallbackContent($: cheerio.CheerioAPI): string {
  $(
    "header, footer, nav, aside, .sidebar, .ads, .comments, .related, script, style"
  ).remove();

  const paragraphs: string[] = [];
  $("p").each((_, el) => {
    const text = $(el).text().trim();
    if (text && text.length > 50) {
      paragraphs.push(text);
    }
  });

  return paragraphs.length > 0 ? paragraphs.join("\n\n") : $("body").text();
}

function cleanContent(content: string): string {
  if (!content) return "";

  content = content.replace(/\s+/g, " ").trim();

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

function extractDescription(content: string): string {
  if (!content) return "No description available";

  const maxLength = 150;
  let description = content.substring(0, maxLength);

  const lastPeriod = description.lastIndexOf(".");
  if (lastPeriod > maxLength * 0.5) {
    description = description.substring(0, lastPeriod + 1);
  } else if (description.length === maxLength) {
    description += "...";
  }

  return description;
}

interface FetchResult {
  success: boolean;
  message: string;
  count: number;
  totalAttempted: number;
  failed: number;
  failedPosts: any[];
  posts: IPost[];
  executionTime: number;
  timestamp: string;
}

export const fetchPostsAndSave = async (
  req?: Request,
  res?: Response
): Promise<FetchResult | void> => {
  const startTime = new Date();
  
  try {
    console.log(
      `🔄 Starting scheduled post fetch and cleanup at ${startTime.toISOString()}`
    );

    // Check MongoDB connection first
    if (!isMongoConnected()) {
      const error = "MongoDB is not connected. Waiting for connection...";
      console.error("❌", error);
      
      // Wait for connection (max 30 seconds)
      const connected = await waitForMongoConnection(30000);
      
      if (!connected) {
        const errorMsg = "MongoDB connection failed after 30 seconds";
        console.error("❌", errorMsg);
        if (res) {
          res.status(503).json({ 
            success: false, 
            message: errorMsg 
          });
          return;
        }
        throw new Error(errorMsg);
      }
    }

    if (!process.env.news_api) {
      const error = "News API URL not defined in environment variables";
      console.error("❌", error);
      if (res) {
        res.status(400).json({ success: false, message: error });
        return;
      }
      throw new Error(error);
    }

    // Step 1: Clear all existing posts with retry logic
    let deletedCount = 0;
    let deleteAttempts = 0;
    const maxDeleteAttempts = 3;
    
    while (deleteAttempts < maxDeleteAttempts) {
      try {
        deleteAttempts++;
        console.log(`🗑️ Attempting to clear old posts (attempt ${deleteAttempts}/${maxDeleteAttempts})...`);
        
        const result = await PostModel.deleteMany({});
        deletedCount = result.deletedCount || 0;
        console.log(`🗑️ Removed ${deletedCount} old posts from database`);
        break;
      } catch (deleteError: any) {
        console.error(`❌ Delete attempt ${deleteAttempts} failed:`, deleteError.message);
        
        if (deleteAttempts >= maxDeleteAttempts) {
          console.error("❌ Max delete attempts reached, continuing anyway...");
          break;
        }
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    // Step 2: Fetch new posts from API
    console.log("📡 Fetching new posts from API...");
    const response = await axios.get(process.env.news_api, {
      timeout: 30000,
      headers: {
        "User-Agent": "NewsApp/1.0",
      },
    });
    const posts = response.data.articles;

    if (!posts || posts.length === 0) {
      const message = "No posts found from API";
      console.log("⚠️", message);
      const emptyResult: FetchResult = {
        success: true,
        message,
        count: 0,
        totalAttempted: 0,
        failed: 0,
        failedPosts: [],
        posts: [],
        executionTime: Date.now() - startTime.getTime(),
        timestamp: new Date().toISOString(),
      };
      if (res) {
        res.status(200).json(emptyResult);
        return;
      }
      return emptyResult;
    }

    console.log(`📰 Found ${posts.length} posts to process`);
    const savedPosts: IPost[] = [];
    const failedPosts: any[] = [];
    let processedCount = 0;

    // Step 3: Process and save new posts
    for (const post of posts) {
      processedCount++;
      console.log(
        `📝 Processing post ${processedCount}/${posts.length}: ${post.title?.substring(0, 50)}...`
      );

      // Check connection before each save
      if (!isMongoConnected()) {
        console.error("❌ MongoDB disconnected during processing");
        failedPosts.push({ title: post.title, error: "Database disconnected" });
        continue;
      }

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
          await new Promise((resolve) => setTimeout(resolve, 1000));
          fullContent = await scrapeFullContent(post.url);
        } catch (scrapeError: any) {
          console.error(
            `❌ Failed to scrape content for ${post.url}:`,
            scrapeError.message
          );
          fullContent = fullContent || "Content unavailable";
        }
      }

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

      // Retry logic for saving with timeout
      let saveAttempts = 0;
      const maxSaveAttempts = 3;
      let saved = false;
      
      while (saveAttempts < maxSaveAttempts && !saved) {
        try {
          saveAttempts++;
          
          // Save with timeout using Promise.race
          await Promise.race([
            newPost.save(),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error("Save timeout after 15s")), 15000)
            )
          ]);
          
          savedPosts.push(newPost);
          console.log(`✅ Saved: ${post.title?.substring(0, 50)}...`);
          saved = true;
        } catch (saveError: any) {
          console.error(
            `❌ Save attempt ${saveAttempts} failed for "${post.title}":`,
            saveError.message
          );
          
          if (saveAttempts >= maxSaveAttempts) {
            failedPosts.push({ title: post.title, error: saveError.message });
            break;
          }
          
          // Wait before retry
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }

    const endTime = new Date();
    const duration = endTime.getTime() - startTime.getTime();
    const successMessage = `Successfully processed ${savedPosts.length}/${posts.length} articles in ${duration}ms`;
    console.log(`🎉 ${successMessage}`);
    
    if (failedPosts.length > 0) {
      console.log(`⚠️ ${failedPosts.length} posts failed to save:`, 
        failedPosts.map(p => p.title));
    }

    const result: FetchResult = {
      success: true,
      message: successMessage,
      count: savedPosts.length,
      totalAttempted: posts.length,
      failed: failedPosts.length,
      failedPosts: failedPosts,
      posts: savedPosts,
      executionTime: duration,
      timestamp: endTime.toISOString(),
    };

    if (res) {
      res.status(200).json(result);
      return;
    }

    return result;
  } catch (error: any) {
    const endTime = new Date();
    const duration = endTime.getTime() - startTime.getTime();
    const errorMessage = `Error in fetchPostsAndSave after ${duration}ms: ${error.message}`;
    console.error("❌", errorMessage);
    console.error("Stack trace:", error.stack);

    if (res) {
      res.status(500).json({
        success: false,
        message: "Something went wrong",
        error: error.message,
        executionTime: duration,
        timestamp: endTime.toISOString(),
      });
      return;
    }

    throw error;
  }
};

let scheduledTask: any = null;
let lastExecution: Date | null = null;
let executionHistory: Array<{
  timestamp: Date;
  success: boolean;
  message: string;
}> = [];

const addToHistory = (success: boolean, message: string) => {
  executionHistory.unshift({
    timestamp: new Date(),
    success,
    message,
  });

  if (executionHistory.length > 10) {
    executionHistory = executionHistory.slice(0, 10);
  }
};

export const startPostScheduler = async () => {
  console.log("🔧 Initializing post scheduler...");

  // Wait for MongoDB connection before starting scheduler
  console.log("⏳ Waiting for MongoDB connection...");
  const connected = await waitForMongoConnection(60000); // 60 second timeout
  
  if (!connected) {
    console.error("❌ Cannot start scheduler: MongoDB not connected");
    console.error("💡 Scheduler will retry when database connection is established");
    return;
  }

  const cronPattern = "0 0,12 * * *";
  if (!cron.validate(cronPattern)) {
    console.error("❌ Invalid cron pattern:", cronPattern);
    return;
  }

  scheduledTask = cron.schedule(
    cronPattern,
    async () => {
      const executionStart = new Date();
      console.log(
        `⏰ Scheduled post fetch triggered at: ${executionStart.toISOString()}`
      );
      console.log(`📊 System time: ${new Date().toString()}`);
      console.log(`🌍 UTC time: ${new Date().toUTCString()}`);

      // Check connection before executing
      if (!isMongoConnected()) {
        const errorMsg = "Scheduled execution skipped: MongoDB not connected";
        console.error(`❌ ${errorMsg}`);
        addToHistory(false, errorMsg);
        return;
      }

      try {
        const result = await fetchPostsAndSave();
        lastExecution = executionStart;
        if (result) {
          const successMessage = `Scheduled post fetch completed - ${result.count}/${result.totalAttempted} posts saved`;
          console.log(`✅ ${successMessage}`);
          addToHistory(true, successMessage);
        }
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

  try {
    console.log("🚀 Post scheduler created and started successfully");
    console.log(`⏰ Schedule: 00:00 and 12:00 UTC daily`);
    console.log(`🕐 Current UTC time: ${new Date().toUTCString()}`);

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

export const manualPostRefresh = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log(
      `🔄 Manual post refresh triggered at ${new Date().toISOString()}`
    );
    
    if (!isMongoConnected()) {
      res.status(503).json({
        success: false,
        message: "MongoDB is not connected",
      });
      return;
    }
    
    const result = await fetchPostsAndSave(req, res);
    if (result) {
      addToHistory(
        true,
        `Manual refresh completed - ${result.count} posts processed`
      );
    }
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

export const getSchedulerStatus = (req: Request, res: Response): void => {
  const isActive = scheduledTask !== null;
  const now = new Date();

  const currentHour = now.getUTCHours();
  const nextHour = currentHour < 12 ? 12 : 24;
  const nextExecution = new Date(now);
  nextExecution.setUTCHours(nextHour === 24 ? 0 : nextHour, 0, 0, 0);
  if (nextHour === 24) {
    nextExecution.setUTCDate(nextExecution.getUTCDate() + 1);
  }

  res.json({
    schedulerActive: isActive,
    mongoConnected: isMongoConnected(),
    mongoState: mongoose.connection.readyState,
    mongoStateDescription: ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState] || 'unknown',
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

export const schedulerHealthCheck = (req: Request, res: Response): void => {
  const isHealthy = scheduledTask !== null && isMongoConnected();
  const recentFailures = executionHistory
    .filter((exec) => !exec.success)
    .filter(
      (exec) => Date.now() - exec.timestamp.getTime() < 24 * 60 * 60 * 1000
    );

  res.status(isHealthy ? 200 : 503).json({
    healthy: isHealthy,
    schedulerRunning: scheduledTask !== null,
    mongoConnected: isMongoConnected(),
    mongoState: mongoose.connection.readyState,
    recentFailures: recentFailures.length,
    lastExecution: lastExecution?.toISOString() || "Never",
    uptime: process.uptime(),
  });
};

export const testCronExecution = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("🧪 Testing cron execution manually...");
    
    if (!isMongoConnected()) {
      res.status(503).json({
        success: false,
        message: "MongoDB is not connected",
      });
      return;
    }
    
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

export const stopPostScheduler = (): void => {
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

export const restartPostScheduler = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("🔄 Restarting post scheduler...");
    stopPostScheduler();
    await startPostScheduler();
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

export const getPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check MongoDB connection
    if (!isMongoConnected()) {
      res.status(503).json({ 
        message: "Database not available",
        mongoConnected: false 
      });
      return;
    }

    const isFeatured = req.query.featured === "true";
    const isRecent = req.query.recent === "true";
    const particularPost = req.query._id;
    const relatedPost = req.query.related;
    const searchPosts =
      typeof req.query.search === "string" ? req.query.search : "";

    const page = parseInt(req.query.page as string) || 0;
    const limit = parseInt(req.query.limit as string) || 9;
    const skip = page * limit;

    let posts: IPost[];
    let totalCount = 0;

    if (isFeatured) {
      posts = await PostModel.find({}).sort({ publishedAt: 1 }).limit(3);
      totalCount = 3;
    } else if (isRecent) {
      posts = await PostModel.find({}).sort({ publishedAt: -1 }).limit(4);
      totalCount = 4;
    } else if (particularPost) {
      posts = await PostModel.find({ _id: particularPost });
      totalCount = posts.length;
    } else if (relatedPost) {
      posts = await PostModel.find({ _id: { $ne: relatedPost } }).limit(3);
      totalCount = 3;
    } else if (searchPosts) {
      const searchQuery = { $text: { $search: searchPosts } };
      totalCount = await PostModel.countDocuments(searchQuery);
      posts = await PostModel.find(searchQuery)
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(limit);
    } else {
      totalCount = await PostModel.countDocuments({});
      posts = await PostModel.find({})
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(limit);
    }

    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages - 1;
    const hasPrevPage = page > 0;

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

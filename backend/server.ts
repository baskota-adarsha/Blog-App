import express, { Express } from "express";
import cors from "cors";
import dotenv from "dotenv";

import { connectDB } from "./connectDB/connectDB";
import postRoutes from "./routes/post.route";
import messageRoutes from "./routes/message.route";
import { startPostScheduler, stopPostScheduler } from "./controller/fetchPosts";

dotenv.config();

const app: Express = express();
const PORT: number = 5000;

app.use(cors());
app.use(express.json());
app.use("/api", postRoutes, messageRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);

  // Initialize the post scheduler when server starts
  console.log("🔧 Initializing post scheduler...");
  startPostScheduler();
});

// Connect to database
connectDB();

// Graceful shutdown handlers
process.on("SIGTERM", () => {
  console.log("🛑 SIGTERM received, shutting down gracefully...");
  stopPostScheduler();
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("🛑 SIGINT received, shutting down gracefully...");
  stopPostScheduler();
  process.exit(0);
});

export default app;

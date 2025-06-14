// post.route.ts
import express from "express";
import {
  fetchPostsAndSave,
  getPosts,
  startPostScheduler,
  manualPostRefresh,
  getSchedulerStatus,
  stopPostScheduler,
  schedulerHealthCheck,
  testCronExecution,
  restartPostScheduler,
} from "../controller/fetchPosts";

const router = express.Router();

// Existing routes
router.post("/fetchAndSave", fetchPostsAndSave);
router.get("/getPosts", getPosts);

// New scheduler routes
router.get("/refresh", manualPostRefresh);

router.get("/scheduler/health", schedulerHealthCheck);
router.get("/scheduler-status", getSchedulerStatus);
router.post("/scheduler/test", testCronExecution);

// Restart scheduler
router.post("/scheduler/restart", restartPostScheduler);

router.post("/stop-scheduler", (req, res) => {
  stopPostScheduler();
  res.json({ message: "Scheduler stopped" });
});
router.post("/start-scheduler", (req, res) => {
  try {
    startPostScheduler();
    res.json({ message: "Scheduler started" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

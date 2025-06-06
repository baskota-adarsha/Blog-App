"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// post.route.ts
const express_1 = __importDefault(require("express"));
const fetchPosts_1 = require("../controller/fetchPosts");
const router = express_1.default.Router();
// Existing routes
router.post("/fetchAndSave", fetchPosts_1.fetchPostsAndSave);
router.get("/getPosts", fetchPosts_1.getPosts);
// New scheduler routes
router.get("/refresh", fetchPosts_1.manualPostRefresh);
router.get("/scheduler-status", fetchPosts_1.getSchedulerStatus);
router.post("/stop-scheduler", (req, res) => {
    (0, fetchPosts_1.stopPostScheduler)();
    res.json({ message: "Scheduler stopped" });
});
router.post("/start-scheduler", (req, res) => {
    try {
        (0, fetchPosts_1.startPostScheduler)();
        res.json({ message: "Scheduler started" });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;

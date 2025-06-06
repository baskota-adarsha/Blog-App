"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const connectDB_1 = require("./connectDB/connectDB");
const post_route_1 = __importDefault(require("./routes/post.route"));
const message_route_1 = __importDefault(require("./routes/message.route"));
const fetchPosts_1 = require("./controller/fetchPosts");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = 5000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api", post_route_1.default, message_route_1.default);
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    // Initialize the post scheduler when server starts
    console.log("🔧 Initializing post scheduler...");
    (0, fetchPosts_1.startPostScheduler)();
});
// Connect to database
(0, connectDB_1.connectDB)();
// Graceful shutdown handlers
process.on("SIGTERM", () => {
    console.log("🛑 SIGTERM received, shutting down gracefully...");
    (0, fetchPosts_1.stopPostScheduler)();
    process.exit(0);
});
process.on("SIGINT", () => {
    console.log("🛑 SIGINT received, shutting down gracefully...");
    (0, fetchPosts_1.stopPostScheduler)();
    process.exit(0);
});
exports.default = app;

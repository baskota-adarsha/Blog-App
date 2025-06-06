"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const sendMessage_1 = require("../controller/sendMessage");
const router = express_1.default.Router();
router.post("/sendMessage", sendMessage_1.sendMessage);
exports.default = router;

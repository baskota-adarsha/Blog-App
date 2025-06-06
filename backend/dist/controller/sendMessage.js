"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = sendMessage;
const Message_model_1 = require("../model/Message.model");
function sendMessage(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { name, email, subject, message } = req.body;
            if (!name || !email || !subject || !message) {
                return res.status(400).json({ error: "Missing required fields" });
            }
            yield Message_model_1.MessageModel.create({ name, email, subject, message });
            return res.status(200).json({ message: "Message sent successfully!" });
        }
        catch (error) {
            return res.status(500).json({ error: "Failed to send message" });
        }
    });
}

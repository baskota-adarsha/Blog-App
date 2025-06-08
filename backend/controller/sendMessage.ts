import { Request, Response } from "express";
import axios from "axios";
import { MessageModel } from "../model/Message.model";
export async function sendMessage(req: Request, res: Response): Promise<any> {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    await MessageModel.create({ name, email, subject, message });
    return res.status(200).json({ message: "Message sent successfully!" });
  } catch (error) {
    return res.status(500).json({ error: "Failed to send message" });
  }
}

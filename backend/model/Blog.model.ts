import mongoose, { Schema, Document } from "mongoose";

export interface IPost extends Document {
  title: string;
  description: string;
  content: string;
  url: string;
  urlToImage: string;
  publishedAt: string;

  author: string;
}

const PostSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  content: {
    type: String,
  },
  url: {
    type: String,
    required: true,
    unique: true, // Prevent duplicate articles
  },
  urlToImage: {
    type: String,
  },
  publishedAt: {
    type: Date,
    required: true,
  },

  author: {
    type: String,
    required: true,
  },
});
PostSchema.index(
  { title: "text", content: "text", description: "text" },
  { weights: { title: 5, description: 3, content: 1 } }
);
export const PostModel = mongoose.model<IPost>("Post", PostSchema);

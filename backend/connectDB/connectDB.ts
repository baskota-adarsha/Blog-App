import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
  try {
    if (process.env.MONGO_URI === undefined) {
      return;
    }
    const conn = await mongoose.connect(process.env.MONGO_URI,{
  serverSelectionTimeoutMS: 30000, // Increase timeout
  socketTimeoutMS: 45000,
});
    console.log(`MongoDB connected successfully`);
  } catch (error) {
    console.log(error);
  }
};

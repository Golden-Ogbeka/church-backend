import { ConnectOptions } from 'mongodb';
import mongoose from 'mongoose';


mongoose.set("strictQuery", false);

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log('MongoDB Connected');
  } catch (error) {
    console.log(error)
    console.log("Couldn't connect to DB");

  }
}
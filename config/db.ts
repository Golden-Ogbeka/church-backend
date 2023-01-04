import { ConnectOptions } from 'mongodb';
import mongoose from 'mongoose';


mongoose.set("strictQuery", false);

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log('MongoDb Connected');
  } catch (error) {
    console.log("Couldn't connect to DB");

  }
}
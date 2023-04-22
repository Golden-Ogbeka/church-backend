import mongoose from 'mongoose';
import { Sequelize } from 'sequelize';

// Mongo DB
mongoose.set('strictQuery', false);

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log('MongoDB Connected');
  } catch (error) {
    console.log(error);
    console.log("Couldn't connect to Mongo DB");
  }
};

// MySQL
const sequelize = new Sequelize(process.env.MYSQL_URI!);

export const connectMySqlDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to MySQL database!');
  } catch (error) {
    console.log(error);
    console.log("Couldn't connect to MySQL DB");
  }
};

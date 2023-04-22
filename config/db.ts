import mongoose from 'mongoose';
import mysql from 'mysql';

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

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'tfhwebma_shine',
});

export const connectMySqlDB = async () => {
  try {
    connection.connect((error) => {
      if (error) throw error;
      console.log('Connected to MySQL database!');
    });
  } catch (error) {
    console.log(error);
    console.log("Couldn't connect to MySQL DB");
  }
};

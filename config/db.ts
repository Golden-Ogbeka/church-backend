import mongoose from 'mongoose';
import { Sequelize } from 'sequelize';


// Mongo DB
mongoose.set('strictQuery', false);

export const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log('MongoDB Connected');
  } catch (error) {
    console.log(error);
    console.log("Couldn't connect to Mongo DB");
  }
};

// MySQL
export const sequelizeInstance = new Sequelize(process.env.MYSQL_URI!, {
  dialect: 'mysql',
});
// export const sequelizeInstance = new Sequelize(
//   process.env.MYSQL_DB!,
//   process.env.MYSQL_USER!,
//   process.env.MYSQL_PASSWORD!,
//   {
//     dialect: 'mysql',
//     sync: { alter: true },
//     host: process.env.MYSQL_HOST!,
//   }
// );
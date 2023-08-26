const mongoose = require('mongoose');
const { Sequelize } = require('sequelize');

// Mongo DB
mongoose.set('strictQuery', false);

const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.log(error);
    console.log("Couldn't connect to Mongo DB");
  }
};

// MySQL
const sequelizeInstance = new Sequelize(
  process.env.MYSQL_DB,
  process.env.MYSQL_USER,
  process.env.MYSQL_PASSWORD,
  {
    host: process.env.MYSQL_HOST,
    dialect:
      'mysql' /* one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */,
  }
);
//  const sequelizeInstance = new Sequelize(process.env.MYSQL_URI || '', {
//   dialect: 'mysql',
// });
//  const sequelizeInstance = new Sequelize(
//   process.env.MYSQL_DB,
//   process.env.MYSQL_USER,
//   process.env.MYSQL_PASSWORD,
//   {
//     dialect: 'mysql',
//     sync: { alter: true },
//     host: process.env.MYSQL_HOST,
//   }
// );

module.exports = {
  connectMongoDB,
  sequelizeInstance,
};

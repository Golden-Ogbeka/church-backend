import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import { connectMongoDB } from './config/db';
import ApiVersions from './api';
import sequelizeDB from './api/v2/models';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: [
      'https://tfh-admin.netlify.app', //website
      'http://127.0.0.1:5173', // localhost
    ],
  })
);

//connect to mongo db
connectMongoDB();

// Add middlewares for parsing JSON and urlencoded data and populating `req.body`
app.use(express.urlencoded({ extended: false }));

// parse requests of content-type - application/json
app.use(express.json());

// base route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to TFH Admin.' });
});

// API Routes
app.use('/api', ApiVersions);

// Not found route
app.use((req, res) => {
  res.status(404).json({ message: 'API route not found.' });
});

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);

  // Connect to SQL DB
  try {
    await sequelizeDB.sequelize.sync({ alter: true });
    console.log('MySQL Database connected');
  } catch (error) {
    console.log(error);
    console.log("Couldn't connect to MySQL DB");
  }
});

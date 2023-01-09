import * as dotenv from 'dotenv'
dotenv.config()
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db";
import ApiVersions from './api';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());


//connect to db
connectDB()

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
  res.status(404).json({ message: 'API not found.' });
});

app.listen(
  PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  }
)

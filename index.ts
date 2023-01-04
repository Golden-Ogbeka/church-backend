require('dotenv').config({ path: './config.env' });

import express from "express";
import cors from "cors";
import { connectDB } from "./config/db";
import ApiVersions from './api';

const app = express();
const PORT = process.env.PORT || 5000;
// const errorHandler = require('./middleware/error')

app.use(cors());


//connect to db
connectDB()

// Add middlewares for parsing JSON and urlencoded data and populating `req.body`
app.use(express.urlencoded({ extended: false }));

// parse requests of content-type - application/json
app.use(express.json());



// simple route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to TFH Admin.' });
});

app.use('/api', ApiVersions);

app.use((req, res) => {
  res.status(404).json({ message: 'Api not found.' });
});


//ErrorHandler (Should be last piece of middleware)
// app.use(errorHandler);

const server = app.listen(
  PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  }
)
process.on("unhandledRejection", (error, promise) => {
  console.log(`Logged Error: ${error}`);
  server.close(() => process.exit(1))

})
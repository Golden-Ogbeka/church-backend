const dotenv = require('dotenv');
// const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { v2: cloudinary } = require('cloudinary');

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const cloudStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    // @ts-ignore
    allowed_formats: ['jpg', 'png', 'jpeg', 'jfif', 'pjpeg', 'pjp'],
    format: 'jpg',
    folder: 'TFH',
  },
});
const parser = multer({ storage: cloudStorage });

module.exports = { parser };

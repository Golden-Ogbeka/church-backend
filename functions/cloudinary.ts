import * as dotenv from 'dotenv';
const cloudinary = require('cloudinary').v2;
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const cloudStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        // @ts-ignore
        allowed_formats: ['jpg', 'png', 'jpeg', 'jfif', 'pjpeg', 'pjp'],
        format: 'jpg',
        folder: 'demo'
    }
});
const parser = multer({ storage: cloudStorage });
export {
    parser
}


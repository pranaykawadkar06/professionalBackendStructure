import { v2 as cloudinary } from "cloudinary";

// console.log("Cloud Name:", Boolean(process.env.CLOUDINARY_CLOUD_NAME));
// console.log("API Key:", Boolean(process.env.CLOUDINARY_API_KEY));
// console.log("API Secret:", Boolean(process.env.CLOUDINARY_API_SECRET));

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export default cloudinary;
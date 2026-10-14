import cloudinary from "../config/cloudinary.js"
import fs from "fs/promises"
import User from "../models/user.js";
import AppError from "../utils/AppError.js";
import { fileTypeFromFile } from "file-type"


const uploadImage = async (req, res, next) => {
    try {
        if (!req.file) {
            return next(new AppError("Please upload an image", 400));
        }

        const fileType = await fileTypeFromFile(req.file.path); 

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        if(!fileType || !allowedTypes.includes(fileType.mime)){
            return next(
                new AppError("Invalid Image File", 400)
            );
        }

        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "professionalBackendStructure"
        });

        // await fs.unlink(req.file.path);

        const user = await User.findById(req.user.userId);

        if(!user){
            try {
                await cloudinary.uploader.destroy(result.public_id);
            } catch (cleanupError) {
                console.error("failed to cleanup new cloudinary image", cleanupError);
                
            }
            return next(
                new AppError("user not found", 404)
            );
        }

        const publicId =  user.avatar.publicId;


        try {
            user.avatar.url = result.secure_url
            user.avatar.publicId = result.public_id
            await user.save();
        } catch (error) {
            try {
                await cloudinary.uploader.destroy(result.public_id);
            } catch (cleanupError) {
                console.error("Failed to clean up new Cloudinary image:", cleanupError);
            }
            throw error;
        }

        // console.log("Avatar before update:", user.avatar);
        

        if (publicId) {
            try {
                const deletionResult = await cloudinary.uploader.destroy(publicId);
                console.log("Old image deletion result:", deletionResult);
            } catch (error) {
                console.log("Failed to delete old image:", error);
            }
        }

        res.status(200).json({
            status: "success",
            message: "Image uploaded to cloudinary",
            image: {
                url: result.secure_url,
                publicId: result.public_id
            }
        });

    } catch (error) {
        next(error);
    }   finally {
        if (req.file) {
            try {
                await fs.unlink(req.file.path);
            } catch (error) {
                console.log("Failed to delete temporary file:", error.message);
            }
        }
    }
}


export {uploadImage};
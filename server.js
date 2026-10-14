import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import connectDB  from "./config/db.js";
import helmet from "helmet"
import apiLimiter from "./middleware/apiLimiter.js";
import multer from "multer";
import AppError from "./utils/AppError.js";


console.log("PORT:", process.env.PORT);

const app = express();

app.use(helmet());

app.use(cookieParser());

app.use(express.json());

app.use("/", authRouter);

app.use("/api/users", apiLimiter, userRouter);

app.use((err, req, res, next) => {
    if(err instanceof multer.MulterError){
        if(err.code === "LIMIT_FILE_SIZE"){
            return next(new AppError("File size cannot exceed 2 MB", 400))
        }
    }
    
    if (err.message === "only JPEG, PNG and WebP images are allowed") {
        return next(new AppError(err.message, 400));
    }

    next(err);

})

app.use((err, req, res, next) => {
    if(err.code === 11000){
        return res.status(409).json({
            status : "fail",
            message : "Email already exists"
        })
    }

    res.status(err.statusCode || 500).json({
        status : err.status || "error",
        message : err.message
    });
})

connectDB().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`server is running on port ${process.env.PORT}`);
    })
}).catch((error) => {
    console.log("MongoDB connection failed: ", error);
})  




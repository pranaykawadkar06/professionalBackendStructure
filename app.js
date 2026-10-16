import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import helmet from "helmet";
import apiLimiter from "./middleware/apiLimiter.js";
import multer from "multer";
import AppError from "./utils/AppError.js";

const app = express();

app.use(helmet());
app.use(cookieParser());
app.use(express.json());

app.use("/", authRouter);
app.use("/api/users", apiLimiter, userRouter);

// Handle Multer and upload errors
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
            return next(
                new AppError("File size cannot exceed 2 MB", 400)
            );
        }
    }

    if (err.message === "only JPEG, PNG and WebP images are allowed") {
        return next(new AppError(err.message, 400));
    }

    next(err);
});

// Central error handler
app.use((err, req, res, next) => {
    if (err.code === 11000) {
        return res.status(409).json({
            status: "fail",
            message: "Email already exists"
        });
    }

    res.status(err.statusCode || 500).json({
        status: err.status || "error",
        message: err.message
    });
});

export default app;
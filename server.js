import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import connectDB  from "./config/db.js";
import helmet from "helmet"
import apiLimiter from "./middleware/apiLimiter.js";

dotenv.config();

console.log("PORT:", process.env.PORT);

const app = express();

app.use(helmet());

app.use(cookieParser());

app.use(express.json());

app.use("/", authRouter);

app.use("/api/users", apiLimiter, userRouter);

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




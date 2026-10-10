import jwt from "jsonwebtoken";
import AppError from "../utils/AppError.js";
import User from "../models/user.js";

const authMiddleware = async(req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return next(
                new AppError("Authorization header is missing", 401)
            );
        }

        const parts = authHeader.split(" ");

        if (parts.length !== 2 || parts[0] !== "Bearer") {
            return next(
                new AppError("Invalid Authorization Format", 401)
            );
        }

        const token = parts[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const user = await User.findById(decoded.userId)

        if(!user){
            return next(
                new AppError("user not found", 401)
            );
        }

        if(user.status === "blocked"){
            return next(
                new AppError("Your account is blocked", 403)
            );
        }

        req.user = decoded;

        next();

    } catch (error) {
        if(error instanceof jwt.JsonWebTokenError){
            return next(
                new AppError("Invalid or Expired token", 401)
            );
        }
        next(error);
    }
};

export default authMiddleware;
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import User from "../models/user.js";
import AppError from "../utils/AppError.js";
import crypto from "node:crypto"

const signup = async (req, res, next) => {
    try {
        const {email, password} = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            email,
            password : hashedPassword,
            role: "user"
        })

        res.status(201).json({
            message : "user created successfully",
            user : {
                email : user.email,
                role : user.role
            }
        })
    } catch (error) {
        next(error)
    }

};

const login = async(req, res, next) => {
    try {
        const {email, password} = req.body;
    
        const user = await User.findOne({email});

        if(!user){
            return next(
                new AppError("Invalid email or password", 401)
            )
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if(!isPasswordCorrect){
            return next(
                new AppError("Invalid email or password", 401)
            )
        }

        const token = jwt.sign(
            {
                userId : user._id,
                email : user.email,
                role : user.role
            }, 
            process.env.JWT_SECRET,
            {
                expiresIn : "15m"
            }
        );

        const refreshToken = jwt.sign(
            {
                userId : user._id,
                email : user.email,
                role : user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn : "7d"
            }
        )

        res.cookie("refreshToken", refreshToken, {
            httpOnly : true,
            secure : false
        })

        res.status(200).json({
            message : "user login successfully",
            user : {
                email: user.email,
                role: user.role
            },
            token : token,
        });

    } catch (error) {
        next(error)
    }
} 

const admin = (req, res, next) => {
    res.status(200).json(
        {
            message : "welcome to admin section",
            email : req.user.email,
            role : req. user.role
        }
    )
};

const refresh = (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if(!refreshToken){
            return next(
                new AppError("Refresh token missing", 401)
            )
        }
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
        
        const newAccessToken = jwt.sign(
            {
                userId : decoded.userId,
                email : decoded.email,
                role : decoded.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn : "15m"
            }
        );

        res.status(200).json({
            message : "new Access token created successfully",
            newAccessToken : newAccessToken
        })
        
    } catch (error) {        
        return next(new AppError("Invalid or Expired refresh Token", 401));
    }

}

const logout = (req, res, next) => {
    res.clearCookie("refreshToken");
    res.status(200).json({
        message : "Logout successfully"
    })
}

const forgotPassword = async(req, res, next) => {
    try {
        const {email} = req.body;
        const user = await User.findOne({email});

        if(!user){
            return next(
                new AppError("user not found", 400)
            );
        }

        const resetToken = crypto
            .randomBytes(32)
            .toString("hex");
        
        const hashedToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex")

        user.passwordResetToken = hashedToken;
        user.passwordResetExpires = Date.now() + 10 * 60 * 1000;

        await user.save();

        const resestURL = `http://localhost:3000/reset-password/${resetToken}`;

        res.status(200).json({
            status: "success",
            message: "password reset link generated",
            resestURL
        })

    } catch (error) {
        next(error);
    }
}


const resetPassword = async(req, res, next) => {
    try {
        const token = req.params.token;

        const hashedToken = await crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");
        
        const user = await User.findOne({
            passwordResetToken: hashedToken, 
            passwordResetExpires: { $gt: Date.now() }
        });  

        if(!user){
            return next(
                new AppError("Invalid or expired reset password token", 400)
            );
        }

        const password = req.body.password;

        if (typeof password !== "string" || password.length < 6) {
            return next(
                new AppError("Password must be at least 6 characters", 400)
            );
        }   

        user.password = await bcrypt.hash(password, 10);

        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined

        await user.save();

        res.status(200).json({
            status : "success",
            message : "password reset successfully"
        })
    } catch (error) {
        next(error)
    }
}

export { signup, login, admin, refresh, logout, forgotPassword, resetPassword};

import User from "../models/user.js";
import AppError from "../utils/AppError.js";
import bcrypt from "bcrypt"

const profile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.userId);

        if (!user) {
            return next(new AppError("User not found", 404));
        }

        res.status(200).json({
            status: "success",
            user
        });
    } catch (error) {
        next(error);
    }
};


const getAllUsers = async(req, res, next) => {
    try {
        const page = req.query.page === undefined 
            ? 1 
            : Number(req.query.page);
        const limit = req.query.limit === undefined 
            ? 5 
            : Number(req.query.limit);

        if(
            req.query.page === "" || 
            req.query.limit === "" || 
            !Number.isInteger(page) || 
            !Number.isInteger(limit)
        ) {
            return next(
                new AppError("Page and Limit must be a number", 400)
            );
        }

        if (page < 1) {
            return next(
                new AppError("Page must be greater than 0", 400)
            );
        }

        if (limit < 1 || limit > 100) {
            return next(
                new AppError("Limit must be between 1 and 100", 400)
            );
        }


        const skip = (page-1) * limit;

        
        if (req.query.search !== undefined) {
            if (
                typeof req.query.search !== "string" ||
                req.query.search.trim() === ""
            ) {
                return next(
                    new AppError("Search must be a non-empty string", 400)
                );
            }
        }
        

        const filter = {};

        if(req.query.role){
            if(!["user", "admin"].includes(req.query.role)){
                return next(
                    new AppError("Invalid role", 400)
                );
            }
            filter.role = req.query.role
        }
        
        if(req.query.search !== undefined) {
            filter.email = {
                $regex: req.query.search.trim(),
                $options: "i"
            };
        }

        let sortingField = "createdAt"
        let order = -1;
        
        if(req.query.sort !== undefined){

            const allowedFilds = ["email", "role", "createdAt"];

            const sortValue = req.query.sort.trim();

            if (sortValue === "") {
                return next(
                    new AppError("Sort must be a non-empty string", 400)
                );
            }

            const field = sortValue.startsWith("-")
                ? sortValue.slice(1)
                : sortValue;

            if(!allowedFilds.includes(field)){
                return next(
                    new AppError("Invalid sorting field", 400)
                );
            }
            
            sortingField = field;

            order =  sortValue.startsWith("-") 
                ? -1 
                : 1;               
        }

        const users = await User.find(filter)
            .skip(skip)
            .limit(limit)
            .sort({
                [sortingField] : order
            });


        const totalUsers = await User.countDocuments(filter);

        res.status(200).json({
            status : "Success",
            results : users.length,
            pagination : {
                page,
                limit,
                totalUsers,
                totalPages: Math.ceil(totalUsers / limit)
            },
            users
        });
    } catch (error) {
        next(error);
    }
}

const getUserById = async (req, res, next) => {
    try {    
        const id = req.params.id;
        const user = await User.findById(id);
    
        if(!user){
            return next(
                new AppError("user not found", 404)
            )
        }
    
        res.status(200).json({
            status: "success",
            message: "user found",
            user
        });
    }catch (error) {
        next(error);
    }
}

const updateUserById = async(req, res, next) => {
    try {
        const id = req.params.id;
        const user = req.body;
        const newUser = await User.findByIdAndUpdate(
            id, 
            user,
            {
                returnDocument : "after",
                runValidators : true
            }
        )

        if(!newUser){
            return next(
                new AppError("user not found", 404)
            );
        }

        res.status(200).json({
            status : "success",
            message : "user updated successfully",
            newUser
        });
    } catch (error) {
        if(error.code === 11000){
            return next(
                new AppError("Email already exists", 409)
            );
        }
        next(error);
    }
}

const deleteUserById = async(req, res, next) => {
    try {
        const id = req.params.id;
        const user = await User.findByIdAndDelete(id);
        if(!user){
            return next(
                new AppError("user not found", 404)
            );
        }

        res.status(200).json({
            status : "success",  
            message : "user deleted successfully",
            user
        });

    } catch (error) {
        next(error);
    }
}

const updateUserRole = async (req, res, next) => {
    try {
        const id = req.params.id;

        const role = req.body.role;



        const user = await User.findByIdAndUpdate(
            id,
            {
                role : role
            },
            {
                returnDocument : "after",
                runValidators : true
            }
        );

        if(!user){
            return next(
                new AppError("user not found", 404)
            )
        }

        res.status(200).json({
            status : "success",
            message : "user role updated successfully",
            user
        })
    } catch (error) {
        next(error);
    }
}

const updateAccountStatus = async(req, res, next) => {
    try {
        const id = req.params.id;

        const status = req.body.status;

        const user = await User.findByIdAndUpdate(
            id,
            {
                status : status
            },
            {
                returnDocument : true,
                runValidators : true
            }
        )

        if(!user){
            return next(
                new AppError("user not found", 404)
            )
        }
        
        res.status(200).json({
            status : "success",
            message : "user status updated successfully",
            user: {
                _id : user._id,
                email : user.email,
                status : user.status 
            }
        })

        
    } catch (error) {
        next(error);
    }
}

const updateChangePassword = async(req, res, next) => {
    try {
        const {currentPassword, newPassword} = req.body;

        const user = await User.findById(req.user.userId).select("+password");

        if (!user) {
            return next(new AppError("User not found", 404));
        }

        const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);

        if(!isPasswordCorrect){
            return next(
                new AppError("old password is incorrect", 400)
            );
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.status(200).json({
            status : "success",
            message : "password changed successfully",
        });

    } catch (error) {
        next(error);
    }
} 

export {profile, getAllUsers, getUserById, updateUserById, deleteUserById, updateUserRole, updateAccountStatus, updateChangePassword}


import AppError from "../utils/AppError.js";

const authorizeUser = (req, res, next) => {
    const loginUserId = req.user.userId;
    const requestedUserId = req.params.id;

    if(req.user.role === "admin"){
        return next();
    }

    if(loginUserId.toString() !== requestedUserId){
        return next(
            new AppError("you can only update your own profile", 403)
        );
    }

    next();
} 

export default authorizeUser;
import AppError from "../utils/AppError.js";

const validateChangePassword = (req, res, next) => {
    const allowedField = ["currentPassword", "newPassword"];
    
    for(const field of Object.keys(req.body)){
        if(!allowedField.includes(field)){
            return next(
                new AppError(`Invalid Field: ${field}`, 400)
            );
        }
    }

    for(const field of allowedField){
        if(typeof field !== "string" || req.body[field].length === 0){
            return next(
                new AppError(`${field} is required`, 400)
            );
        }        
    }

    if(req.body.newPassword.length < 6) {
        return next(
            new AppError("password must have at least 6 character", 400)
        );
    }

    next();
}

export default validateChangePassword;
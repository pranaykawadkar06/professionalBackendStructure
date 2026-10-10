import AppError from "../utils/AppError.js";

const validateUpdateAccountStatus = (req, res, next) => {
    const allowedField = ["status"];

    for(const field of Object.keys(req.body)){
        if(!allowedField.includes(field)){
            return next(
                new AppError(`Invalid Field: ${field}`, 400)
            );
        }
    }
    
    const status = req.body.status; 

    if(typeof status !== "string" || status.trim() === ""){
        return next(
            new AppError("status must be a non-empty string", 400)
        );
    }

    const allowedstatus = ["active", "blocked"];

    if(!allowedstatus.includes(status)){
        return next(
            new AppError(`Invalid Role: ${status}`)
        )
    }

    next();
}

export default validateUpdateAccountStatus;
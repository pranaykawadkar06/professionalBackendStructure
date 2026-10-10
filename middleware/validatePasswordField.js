import AppError from "../utils/AppError.js";

const validatePasswordField = (req, res, next) => {
    const allowedField = ["password"];

    for(const field of Object.keys(req.body)){
        if(!allowedField.includes(field)){
            return next(
                new AppError(`Invalid Field: ${field}`, 400)
            );
        }
    }
    
    const password = req.body.password; 

    if(typeof password !== "string" || password.length < 6){
        return next(
            new AppError("password must be of at least 6 character", 400)
        );
    }

    next();
}

export default validatePasswordField;
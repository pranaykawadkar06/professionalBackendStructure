import AppError from "../utils/AppError.js";

const validateUpdateUserRole = (req, res, next) => {
    const allowedField = ["role"];

    for(const field of Object.keys(req.body)){
        if(!allowedField.includes(field)){
            return next(
                new AppError(`Invalid Field: ${field}`, 400)
            );
        }
    }
    
    const role = req.body.role; 

    if(typeof role !== "string" || role.trim() === ""){
        return next(
            new AppError("role must be a non-empty string", 400)
        );
    }

    const allowedroles = ["user", "admin"];

    if(!allowedroles.includes(role)){
        return next(
            new AppError(`Invalid Role: ${req.body.role}`)
        )
    }

    next();
}

export default validateUpdateUserRole;
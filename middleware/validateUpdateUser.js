import AppError from "../utils/AppError.js";

const validateUpdateUser = (req, res, next) => {
    const email = req.body.email;
    if(email !== undefined){
        if(
            typeof email  !== "string" ||
            email.trim() === ""
        ){
            return next(
                new AppError("email must be a non-empty string", 400)
            );
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        
        if(!emailRegex.test(email.trim())){
            return next(
                new AppError("Invalid Email Format", 400)
            );
        }

        req.body.email = email.trim().toLowerCase();
    }

    next();
}

export default validateUpdateUser;
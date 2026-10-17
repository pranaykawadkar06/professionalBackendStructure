import AppError from "../utils/AppError.js";

const validateSignup = (req, res, next) => {

    const allowedFields = ["email", "password"];
    
    for (const field of Object.keys(req.body)) {
        if(!allowedFields.includes(field)){
            return next(
                new AppError(`Invalid field: ${field}`, 400)
            );
        }
        
    }

    const { email, password } = req.body;

    if (!email || !password) {
        return next(
            new AppError("email and password are required", 400)
        )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        return next(
            new AppError("Invalid email format", 400)
        );
    }

    if (password.length < 6) {
        return next(
            new AppError("password must be of minimum 6 length", 400)
        )
    }

    next();
};

export default validateSignup;
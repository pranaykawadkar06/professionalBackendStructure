import AppError from "../utils/AppError.js";

const validateLogin = (req, res, next) => {
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

export default validateLogin;
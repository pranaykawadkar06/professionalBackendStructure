import AppError from "../utils/AppError.js";

const validateEmailField = (req, res, next) => {
    const allowedField = ["email"];

    for (const field of Object.keys(req.body)) {
        if (!allowedField.includes(field)) {
            return next(
                new AppError(`Invalid Field: ${field}`, 400)
            );
        }
    }

    const email = req.body.email;

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (
        typeof email !== "string" ||
        !emailRegex.test(email.trim())
    ) {
        return next(
            new AppError("Invalid email format", 400)
        );
    }

    req.body.email = email.trim().toLowerCase();

    next();
};

export default validateEmailField;
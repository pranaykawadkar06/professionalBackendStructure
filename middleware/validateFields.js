import AppError from "../utils/AppError.js";

const validateFields = (req, res, next) => {
    const user = req.body;
    const allowedFields = ["email"];
    for(const field of Object.keys(user)){
        if(!allowedFields.includes(field)){
            return next(
                new AppError(`Invalid Field ${field}`, 400)
            );
        }
    }
    next();
}

export default validateFields;
import { isValidObjectId } from "mongoose";
import AppError from "../utils/AppError.js";

const validateObjectId = (req, res, next) => {
    const id = req.params.id;
    if(!isValidObjectId(id)){
        return next(
            new AppError("Invalid User Id: ", 400)
        );
    }

    next();
}

export default validateObjectId;
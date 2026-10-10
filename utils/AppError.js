class AppError extends Error {
    constructor(message, statusCode){
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.status = statusCode >= 400 && statusCode < 500 ? "fail" : "error";
    }
}

export default AppError;
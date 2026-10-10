import rateLimit from "express-rate-limit"

const loginLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 5,
    message: {
        status: "fail",
        message: "Too many login attempts. please try again later.",
    },
    standardHeaders: "draft-8",
    legacyHeaders: false
})

export default loginLimiter;
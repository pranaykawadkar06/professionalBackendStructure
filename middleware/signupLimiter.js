import rateLimit from "express-rate-limit"; 

const signupLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 10,
    message: {
        status: "fail",
        message: "Too many signup attempts. please try again later."
    },
    standardHeaders: "draft-8",
    legacyHeaders: false
})

export default signupLimiter;
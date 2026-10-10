import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        trim : true
    },
    password: {
        type : String,
        required : true,
        minlength : 6
    },
    role: {
        type : String,
        enum : ["admin", "user"],
        default : "user"
    },
    status: {
        type : String,
        enum : ["active", "blocked"],
        default : "active"
    },
    passwordResetToken: {
        type: String,
        default: undefined
    },
    passwordResetExpires: {
        type: Date,
        default: undefined
    }
}, {
    timestamps: true
})

const User = mongoose.model("User", userSchema);

export default User;
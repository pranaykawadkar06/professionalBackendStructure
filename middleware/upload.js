import multer from "multer";
import crypto from "crypto"

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const uniqueName = crypto.randomBytes(16).toString("hex");
        cb(null, uniqueName);
    }
});


const upload = multer({
    storage,

    limits: {
        fileSize: 2 * 1024 * 1024
    },

    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        console.log("Filename:", file.originalname);
        console.log("MIME type:", file.mimetype);

        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        }else{
            cb(new Error("only JPEG, PNG and WebP images are allowed"));
        }
    }
});

export default upload;
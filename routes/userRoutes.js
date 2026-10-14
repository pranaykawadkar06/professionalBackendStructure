import express from "express"
import { profile, getAllUsers, getUserById, updateUserById, deleteUserById, updateUserRole, updateAccountStatus, updateChangePassword} from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import validateObjectId from "../middleware/validateObjectId.js"
import validateFields from "../middleware/validateFields.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import authorizeUser from "../middleware/authorizeUser.js";
import validateUpdateUser from "../middleware/validateUpdateUser.js";
import validateUpdateUserRole from "../middleware/validateUpdateUserRole.js";
import validateUpdateAccountStatus from "../middleware/validateUpdateAccountStatus.js";
import validateChangePassword from "../middleware/validateChangePassword.js";
import upload from "../middleware/upload.js";
import {uploadImage} from "../controllers/uploadController.js"

const router = express.Router();

router.get("/profile", authMiddleware, profile);

router.get("/", authMiddleware, getAllUsers);

router.get("/:id", authMiddleware, validateObjectId, getUserById);

router.patch("/:id", authMiddleware, validateObjectId, authorizeUser, validateFields, validateUpdateUser, updateUserById);

router.delete("/:id", authMiddleware, roleMiddleware("admin"), validateObjectId, deleteUserById);

router.patch("/:id/role", authMiddleware, roleMiddleware("admin"), validateObjectId, validateUpdateUserRole, updateUserRole);

router.patch("/:id/status", authMiddleware, roleMiddleware("admin"), validateObjectId, validateUpdateAccountStatus, updateAccountStatus)

router.patch("/change-password", authMiddleware, validateChangePassword, updateChangePassword);

router.post("/upload", authMiddleware, upload.single("image"), uploadImage);

export default router;
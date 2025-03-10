import express from "express";
import { loginUser, logoutUser, registerUser, userProfile, userProfileUpdate } from "../controllers/userController.js";
import isAuthenticated from "../middleware/authMiddleware.js";
import upload from "../utils/multer.js";

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logoutUser);
router.route("/profile").get(isAuthenticated,userProfile);
router.route("/profile/update").put(isAuthenticated, upload.single('profilePicture') ,userProfileUpdate);


export default router
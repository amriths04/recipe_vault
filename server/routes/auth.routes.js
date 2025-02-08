import express from "express";
import { registerUser, loginUser, logoutUser } from "../controllers/authController.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = express.Router();

// Auth Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", verifyJWT, logoutUser);

export default router;

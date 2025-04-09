import express from "express";
import { createOrder } from "../controllers/orderController.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = express.Router();

// 🔐 Protected route — create order after payment
router.post("/create", verifyJWT, createOrder);

export default router;

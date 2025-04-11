import express from "express";
import { createOrder,getAllOrders } from "../controllers/orderController.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { getOrdersByUser } from "../middleware/auth.middleware.js";
const router = express.Router();

router.post("/orders", createOrder);
router.get('/orders', getAllOrders);
router.get("/fetchusers", verifyJWT, getOrdersByUser);

export default router;

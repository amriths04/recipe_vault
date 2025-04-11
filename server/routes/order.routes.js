import express from "express";
import { createOrder,getAllOrders,getOrdersByUser } from "../controllers/orderController.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
const router = express.Router();

router.post("/orders", createOrder);
router.get('/orders', getAllOrders);
router.get("/fetchusers", verifyJWT, getOrdersByUser);

export default router;

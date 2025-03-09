// routes/shoppingListRoutes.js
import express from "express";
import {
  addToShoppingList,
  removeFromShoppingList,
} from "../controllers/shoppingListController.js";

const router = express.Router();

router.post("/add", addToShoppingList);
router.post("/remove", removeFromShoppingList);

export default router;

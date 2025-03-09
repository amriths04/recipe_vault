// routes/shoppingListRoutes.js
import express from "express";
import {
  addToShoppingList,
  removeFromShoppingList,getShoppingListRecipes
} from "../controllers/shoppingListController.js";
import { verifyJWT } from "../middleware/auth.middleware.js"; // Updated middleware


const router = express.Router();

router.post("/add", addToShoppingList);
router.post("/remove", removeFromShoppingList);
router.get("/getshoplist", verifyJWT, getShoppingListRecipes);


export default router;

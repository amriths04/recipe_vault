import express from "express";
import {
  addIngredient,
  getAllIngredients,
  deleteIngredient,
  updateIngredient,
  calculatePrice,
} from "../controllers/ingredientController.js";

const router = express.Router();

// Admin routes
router.post("/", addIngredient);
router.get("/", getAllIngredients);
router.put("/:id", updateIngredient);
router.delete("/:id", deleteIngredient);

// Price calculation
router.post("/calculate", calculatePrice);

export default router;

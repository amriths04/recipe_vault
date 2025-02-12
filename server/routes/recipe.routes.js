import express from "express";
import {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  getRecipesByUser,
  updateRecipe,
  deleteRecipe,
  toggleBookmarkRecipe,
} from "../controllers/recipeController.js";

import { protect } from "../middleware/authMiddleware.js"; // Assuming authentication middleware

const router = express.Router();

router.post("/", protect, createRecipe); // Create a recipe
router.get("/", getAllRecipes); // Get all recipes
router.get("/user", protect, getRecipesByUser); // Get recipes created by logged-in user
router.get("/:id", getRecipeById); // Get recipe by ID
router.put("/:id", protect, updateRecipe); // Update recipe
router.delete("/:id", protect, deleteRecipe); // Delete recipe
router.post("/bookmark", protect, toggleBookmarkRecipe); // Toggle bookmark

export default router;

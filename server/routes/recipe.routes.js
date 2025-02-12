import express from "express";
import {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  toggleBookmarkRecipe,
} from "../controllers/recipeController.js";

const router = express.Router();

router.post("/", createRecipe); // Create a recipe
router.get("/", getAllRecipes); // Get all recipes
router.get("/:id", getRecipeById); // Get recipe by ID
router.put("/:id", updateRecipe); // Update recipe
router.delete("/:id", deleteRecipe); // Delete recipe
router.post("/bookmark", toggleBookmarkRecipe); // Toggle bookmark

export default router;

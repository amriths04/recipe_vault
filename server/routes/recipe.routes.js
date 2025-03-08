import express from "express";
import {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  toggleBookmarkRecipe,
  getBookmarkedRecipes,
} from "../controllers/recipeController.js";
import { verifyJWT } from "../middleware/auth.middleware.js"; // ✅ Use your existing middleware

const router = express.Router();

router.post("/", createRecipe); // Create a recipe
router.get("/", getAllRecipes); // Get all recipes
router.get("/:id", getRecipeById); // Get recipe by ID
router.put("/:id", updateRecipe); // Update recipe
router.delete("/:id", deleteRecipe); // Delete recipe
router.post("/bookmark", verifyJWT, toggleBookmarkRecipe); // ✅ Protected route
router.get("/bookmarked/meow", verifyJWT, getBookmarkedRecipes); // ✅ Protected route


export default router;

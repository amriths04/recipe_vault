import Recipe from "../models/recipeModel.js";
import Bookmark from "../models/bookmarkModel.js";

// 📌 Create a Recipe
export const createRecipe = async (req, res) => {
  try {
    const { name, description, ingredients, procedure, characteristics } = req.body;
    const newRecipe = new Recipe({
      name,
      description,
      ingredients,
      procedure,
      characteristics,
      createdBy: req.user.id, // Assuming user ID is extracted from auth middleware
    });
    const savedRecipe = await newRecipe.save();
    res.status(201).json(savedRecipe);
  } catch (error) {
    res.status(500).json({ error: "Failed to create recipe" });
  }
};

// 📌 Get All Recipes
export const getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find().populate("createdBy", "username email");
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch recipes" });
  }
};

// 📌 Get a Single Recipe by ID
export const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate("createdBy", "username email");
    if (!recipe) return res.status(404).json({ error: "Recipe not found" });
    res.status(200).json(recipe);
  } catch (error) {
    res.status(500).json({ error: "Error fetching recipe" });
  }
};

// 📌 Get Recipes Created by a Specific User
export const getRecipesByUser = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming authentication middleware
    const recipes = await Recipe.find({ createdBy: userId });
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ error: "Error fetching user recipes" });
  }
};

// 📌 Update a Recipe
export const updateRecipe = async (req, res) => {
  try {
    const updatedRecipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedRecipe) return res.status(404).json({ error: "Recipe not found" });
    res.status(200).json(updatedRecipe);
  } catch (error) {
    res.status(500).json({ error: "Error updating recipe" });
  }
};

// 📌 Delete a Recipe
export const deleteRecipe = async (req, res) => {
  try {
    const deletedRecipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!deletedRecipe) return res.status(404).json({ error: "Recipe not found" });
    res.status(200).json({ message: "Recipe deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting recipe" });
  }
};

// 📌 Toggle Bookmark (Add/Remove Bookmark for Recipe)
export const toggleBookmarkRecipe = async (req, res) => {
  try {
    const { recipeId } = req.body;
    const userId = req.user.id;

    const existingBookmark = await Bookmark.findOne({ user: userId, recipe: recipeId });

    if (existingBookmark) {
      await Bookmark.findByIdAndDelete(existingBookmark._id);
      return res.status(200).json({ message: "Bookmark removed" });
    } else {
      const newBookmark = new Bookmark({ user: userId, recipe: recipeId });
      await newBookmark.save();
      return res.status(201).json({ message: "Recipe bookmarked" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error toggling bookmark" });
  }
};

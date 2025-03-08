import Recipe from "../models/recipeModel.js";
import Bookmark from "../models/bookmarkModel.js";

// 📌 Create a Recipe
export const createRecipe = async (req, res) => {
    try {
      const { name, description, image, ingredients, procedure, characteristics, createdBy } = req.body;
  
      // Check required fields
      if (!name || !ingredients || !procedure || !characteristics || !createdBy) {
        return res.status(400).json({ error: "Missing required fields" });
      }
  
      const newRecipe = new Recipe({
        name,
        description,
        image: image || "https://via.placeholder.com/300", // Default placeholder
        ingredients,
        procedure,
        characteristics,
        createdBy
      });
  
      const savedRecipe = await newRecipe.save();
      res.status(201).json(savedRecipe);
    } catch (error) {
      console.error("Error creating recipe:", error);
      res.status(500).json({ error: error.message || "Server error" });
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

export const toggleBookmarkRecipe = async (req, res) => {
  const { recipeId } = req.body;
  const userId = req.user._id; // Ensure this comes from auth middleware

  // Find the recipe by ID
  const recipe = await Recipe.findById(recipeId);
  if (!recipe) {
      throw new ApiError(404, "Recipe not found");
  }

  // Check if the user has already bookmarked it
  const isBookmarked = recipe.favoritedBy.includes(userId);

  if (isBookmarked) {
      // If bookmarked, remove the user from favoritedBy
      recipe.favoritedBy = recipe.favoritedBy.filter(id => id.toString() !== userId.toString());
  } else {
      // If not bookmarked, add the user to favoritedBy
      recipe.favoritedBy.push(userId);
  }

  await recipe.save(); // Save changes to DB

  res.status(200).json({ 
      message: "Recipe bookmark toggled", 
      isBookmarked: !isBookmarked 
  });
};


export const getBookmarkedRecipes = async (req, res) => {
  try {
    const userId = req.user?._id;

    console.log("🔍 Fetching bookmarked recipes for user:", userId);

    if (!userId) {
      console.log("❌ Error: User not authenticated");
      return res.status(401).json({ error: "Unauthorized. Please log in." });
    }

    const bookmarkedRecipes = await Recipe.find({ favoritedBy: userId });

    console.log("📌 Found Bookmarked Recipes:", bookmarkedRecipes);

    if (bookmarkedRecipes.length === 0) {
      return res.status(200).json({ message: "No bookmarked recipes found", bookmarkedRecipes: [] });
    }

    res.status(200).json({ bookmarkedRecipes });

  } catch (error) {
    console.log("❌ Error fetching bookmarked recipes:", error.message);
    res.status(500).json({ error: error.message || "Failed to fetch bookmarked recipes" });
  }
};





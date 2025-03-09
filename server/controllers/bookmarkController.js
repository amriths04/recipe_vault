import Recipe from "../models/recipeModel.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/userModel.js";

export const unbookmarkRecipes = async (req, res) => {
    try {
      const userId = req.user._id;
      const { recipeIds } = req.body;
  
      if (!recipeIds || !Array.isArray(recipeIds) || recipeIds.length === 0) {
        throw new ApiError(400, "Invalid recipe IDs");
      }
  
      // 1. Pull userId from Recipe.favoritedBy in all specified recipes
      const recipeUpdateResult = await Recipe.updateMany(
        { _id: { $in: recipeIds } },
        { $pull: { favoritedBy: userId } }
      );
  
      // 2. Pull recipeIds from User.bookmarks
      const userUpdateResult = await User.updateOne(
        { _id: userId },
        { $pull: { bookmarks: { $in: recipeIds } } }
      );
  
      // If no bookmarks were removed at all
      if (recipeUpdateResult.modifiedCount === 0 && userUpdateResult.modifiedCount === 0) {
        throw new ApiError(404, "No bookmarks found to remove");
      }
  
      res.json({
        message: "Recipes unbookmarked successfully",
        recipesModified: recipeUpdateResult.modifiedCount,
        userBookmarksModified: userUpdateResult.modifiedCount,
      });
    } catch (error) {
      console.error("🔴 Unbookmark Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
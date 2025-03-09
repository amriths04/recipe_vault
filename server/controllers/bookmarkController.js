import Recipe from "../models/recipeModel.js";
import { ApiError } from "../utils/ApiError.js";

export const unbookmarkRecipes = async (req, res) => {
    const userId = req.user._id; // Extract user ID from verified JWT
    const { recipeIds } = req.body; // Expect an array of recipe IDs

    if (!recipeIds || !Array.isArray(recipeIds) || recipeIds.length === 0) {
        throw new ApiError(400, "Invalid recipe IDs");
    }

    // Remove userId from favoritedBy in multiple recipes
    const result = await Recipe.updateMany(
        { _id: { $in: recipeIds } }, // Find recipes by given IDs
        { $pull: { favoritedBy: userId } } // Remove userId from favoritedBy array
    );

    if (result.modifiedCount === 0) {
        throw new ApiError(404, "No bookmarks found to remove");
    }

    res.json({
        message: "Recipes unbookmarked successfully",
        modifiedCount: result.modifiedCount
    });
};

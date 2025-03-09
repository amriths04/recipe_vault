// controllers/shoppingListController.js
import { User } from "../models/userModel.js";

// ✅ Add to shopping list
export const addToShoppingList = async (req, res) => {
  try {
    const { userId, recipeIds } = req.body;

    if (!userId || !recipeIds || !Array.isArray(recipeIds)) {
      return res.status(400).json({ message: "Invalid input" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    recipeIds.forEach((id) => {
      if (!user.shoppingList.includes(id)) {
        user.shoppingList.push(id);
      }
    });

    await user.save();
    res.status(200).json({
      message: "Recipes added to shopping list",
      shoppingList: user.shoppingList,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Remove from shopping list & send back to bookmarks
export const removeFromShoppingList = async (req, res) => {
  try {
    const { userId, recipeIds } = req.body;

    if (!userId || !recipeIds || !Array.isArray(recipeIds)) {
      return res.status(400).json({ message: "Invalid input" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Remove from shopping list
    user.shoppingList = user.shoppingList.filter(
      (id) => !recipeIds.includes(id.toString())
    );

    // Add back to bookmarks (if not already there)
    recipeIds.forEach((id) => {
      if (!user.bookmarks.includes(id)) {
        user.bookmarks.push(id);
      }
    });

    await user.save();
    res.status(200).json({
      message: "Removed from shopping list and added to bookmarks",
      shoppingList: user.shoppingList,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

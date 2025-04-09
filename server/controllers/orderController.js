import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/userModel.js";
import Order from "../models/orderModel.js";
import Recipe from "../models/recipeModel.js";

export const createOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { recipeIds, deliveryAddress, items, totalPrice } = req.body;

    // ✅ Input validation
    if (!recipeIds || !Array.isArray(recipeIds) || recipeIds.length === 0) {
      throw new ApiError(400, "No recipe IDs provided");
    }

    if (!deliveryAddress || typeof deliveryAddress !== "string") {
      throw new ApiError(400, "Delivery address is required");
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new ApiError(400, "Order items are required");
    }

    if (typeof totalPrice !== "number" || isNaN(totalPrice)) {
      throw new ApiError(400, "Invalid or missing total price");
    }

    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, "User not found");

    // ✅ Strictly ensure ALL recipeIds are present in shopping list
    const shoppingListIds = user.shoppingList.map((id) => id.toString());
    const missingIds = recipeIds.filter(
      (id) => !shoppingListIds.includes(id.toString())
    );

    if (missingIds.length > 0) {
      throw new ApiError(
        400,
        `The following recipes are not in your shopping list: ${missingIds.join(", ")}`
      );
    }

    // ✅ Validate items and their ingredients
    const validatedItems = items.map((item) => {
      const { recipe, name, price, ingredients } = item;

      if (!recipe || !name || typeof price !== "number") {
        throw new ApiError(400, "Invalid order item format");
      }

      if (
        !ingredients ||
        !Array.isArray(ingredients) ||
        ingredients.length === 0
      ) {
        throw new ApiError(400, `Missing ingredients for recipe: ${name}`);
      }

      ingredients.forEach((ing) => {
        if (
          !ing.name ||
          typeof ing.name !== "string" ||
          !ing.quantity ||
          typeof ing.quantity !== "string" ||
          typeof ing.price !== "number"
        ) {
          throw new ApiError(400, `Invalid ingredient in recipe: ${name}`);
        }
      });

      return {
        recipe,
        name,
        price,
        ingredients,
      };
    });

    // ✅ Create and save the order
    const newOrder = new Order({
      user: userId,
      items: validatedItems,
      totalPrice,
      deliveryAddress,
    });

    await newOrder.save();

    // ✅ Remove ordered recipes from user's shopping list
    user.shoppingList = user.shoppingList.filter(
      (id) => !recipeIds.includes(id.toString())
    );
    await user.save();

    res.status(201).json({
      message: "Order placed successfully",
      orderId: newOrder._id,
      totalPrice,
      itemCount: validatedItems.length,
    });

  } catch (error) {
    console.error("🔴 Order Creation Error:", error);
    res
      .status(error.statusCode || 500)
      .json({ error: error?.message || "Internal Server Error" });
  }
};

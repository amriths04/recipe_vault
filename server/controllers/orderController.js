import Order from "../models/orderModel.js";
import {User} from "../models/userModel.js"
// Create an order
export const createOrder = async (req, res) => {
  try {
    const { userId, deliveryAddress, ingredients, totalPrice, recipeIds } = req.body;

    if (!userId || !deliveryAddress || !ingredients || !totalPrice || !recipeIds) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Create a new order
    const newOrder = new Order({
      user: userId,
      ingredients: ingredients,
      deliveryAddress: deliveryAddress,
      totalPrice: totalPrice,
      recipeIds: recipeIds,
      status: "Pending",
      createdAt: new Date(Date.now() + 5.5 * 60 * 60 * 1000)

    });
    await newOrder.save();
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    user.shoppingList = user.shoppingList.filter(recipe => !recipeIds.includes(recipe.toString()));
    await user.save();

    res.status(201).json(newOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating order", error: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    if (orders.length === 0) {
      return res.status(404).json({ message: "No orders found" });
    }
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching orders", error: error.message });
  }
};
export const getOrdersByUser = async (req, res) => {
  try {
    const userId = req.user._id;

    const orders = await Order.find({ user: userId });

    if (orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this user" });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching user orders", error: error.message });
  }
};
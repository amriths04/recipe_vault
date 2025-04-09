import Order from "../models/orderModel.js";

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
      status: "Pending", // Default status
    });

    // Save the order to the database
    const savedOrder = await newOrder.save();

    res.status(201).json(savedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating order", error: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    // If no orders found, return an appropriate message
    if (orders.length === 0) {
      return res.status(404).json({ message: "No orders found" });
    }
    // Return the list of orders
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching orders", error: error.message });
  }
};

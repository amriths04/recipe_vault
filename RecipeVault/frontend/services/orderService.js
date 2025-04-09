import axios from "axios";
import { API_URL } from "../config";

export const calculateOrderPrice = async (ingredients) => {
  try {
    const response = await axios.post(
      `${API_URL}/ingredients/calculate`,
      { ingredients },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error calculating order price:", error.response?.data || error.message);
    throw error.response?.data || { message: "Unknown error occurred" };
  }
};

//not used 
export const createOrder = async (orderData) => {
  try {
    const response = await axios.post(`${API_URL}/orders/orders`, orderData);
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const fetchAllOrders = async () => {
  try {
    const response = await axios.get(`${API_URL}/orders/orders`);
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error.response?.data || error.message);
    throw error.response?.data || { message: "Unknown error occurred while fetching orders" };
  }
};

export const placeOrder = async (orderData) => {
  const { userId, ingredients, totalAmount, recipeIds, deliveryAddress } = orderData;

  if (!userId || !deliveryAddress || !ingredients || !totalAmount || !recipeIds) {
    throw new Error("Missing required fields in the order data.");
  }

  const orderPayload = {
    userId,
    deliveryAddress: deliveryAddress || "",
    ingredients: ingredients,
    totalPrice: totalAmount,
    recipeIds: recipeIds,
  };

  try {
    const response = await fetch(`${API_URL}/orders/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderPayload),
    });

    const result = await response.json();

    if (response.ok) {
      return { success: true, message: "Order placed successfully." };
    } else {
      throw new Error(result.message || "Failed to place order.");
    }
  } catch (err) {
    throw new Error(err.message || "Failed to place order.");
  }
};
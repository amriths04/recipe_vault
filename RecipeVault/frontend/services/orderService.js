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

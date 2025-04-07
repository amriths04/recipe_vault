import { API_URL } from '../config.js';

export const removeBookmarks = async (recipeIds, token) => {
  try {
    const response = await fetch(`${API_URL}/bookmarks/unbookmark`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // ✅ Add token if JWT auth is required
      },
      body: JSON.stringify({ recipeIds }),
    });

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const textResponse = await response.text();
      console.error("🔴 Non-JSON Response:", textResponse);
      return { error: "Unexpected server response" };
    }

    const jsonResponse = await response.json();
    return jsonResponse;
  } catch (error) {
    console.error("🔴 Remove Bookmarks error:", error);
    return { error: "Something went wrong!" };
  }
};

// services/bookmarkService.js (or shoppingListService.js)
export const sendToShoppingList = async (recipeIds, userId) => {
  try {
    const response = await fetch(`${API_URL}/shopping-list/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, recipeIds }),
    });

    const jsonResponse = await response.json();
    return jsonResponse;
  } catch (error) {
    console.error("🔴 Send to Shopping List error:", error);
    return { error: "Something went wrong!" };
  }
};

export const getShoppingList = async (token) => {
  try {
    const response = await fetch(`${API_URL}/shopping-list/getshoplist`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      console.error("🔴 Non-JSON Response:", text);
      return { error: "Unexpected server response" };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("🔴 Error fetching shopping list:", error);
    return { error: "Something went wrong!" };
  }
};

export const removeFromShoppingList = async (userId, recipeIds) => {
  try {
    const body = {
      userId,
      recipeIds,
    };
    console.log("📤 Sending to remove-from-shopping-list API:", body);

    const response = await fetch(`${API_URL}/shopping-list/remove`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      console.error("🔴 Non-JSON Response from removeFromShoppingList:", text);
      return { error: "Unexpected server response" };
    }

    const json = await response.json();
    return json;
  } catch (error) {
    console.error("🛑 removeFromShoppingList fetch error:", error.message);
    return { error: "Something went wrong!" };
  }
};

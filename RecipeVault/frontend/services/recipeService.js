import { API_URL } from '../config.js';

export const fetchRecipes = async () => {
  try {
    const response = await fetch(`${API_URL}/recipes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const textResponse = await response.text();
      console.error("🔴 Non-JSON Response:", textResponse);
      return { error: "Unexpected server response" };
    }

    return await response.json();
  } catch (error) {
    console.error("🔴 Fetch Recipes Error:", error);
    return { error: "Something went wrong!" };
  }
};

export const fetchRecipeById = async (recipeId) => {
  try {
    const response = await fetch(`${API_URL}/recipes/${recipeId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    return await response.json();
  } catch (error) {
    console.error("🔴 Fetch Recipe Error:", error);
    return { error: "Something went wrong!" };
  }
};

export const addRecipe = async (recipeData) => {
  try {
    const response = await fetch(`${API_URL}/recipes/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(recipeData),
    });

    return await response.json();
  } catch (error) {
    console.error("🔴 Add Recipe Error:", error);
    return { error: "Something went wrong!" };
  }
};

export const updateRecipe = async (recipeId, updatedData) => {
  try {
    const response = await fetch(`${API_URL}/recipes/${recipeId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });

    return await response.json();
  } catch (error) {
    console.error("🔴 Update Recipe Error:", error);
    return { error: "Something went wrong!" };
  }
};

export const deleteRecipe = async (recipeId) => {
  try {
    const response = await fetch(`${API_URL}/recipes/${recipeId}`, {
      method: "DELETE",
    });

    return await response.json();
  } catch (error) {
    console.error("🔴 Delete Recipe Error:", error);
    return { error: "Something went wrong!" };
  }
};

export const toggleBookmarkRecipe = async (recipeId, userId, token) => {
  try {
    const response = await fetch(`${API_URL}/recipes/bookmark`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // ✅ Include JWT token
      },
      body: JSON.stringify({ recipeId }),
    });

    const text = await response.text();
    console.log("🔍 Raw API Response:", text); // Debugging

    const data = JSON.parse(text);
    return data;
  } catch (error) {
    console.error("🔴 Toggle Bookmark Error:", error);
    return { error: "Something went wrong!" };
  }
};

export const fetchBookmarkedRecipes = async (token) => {
  try {
    const response = await fetch(`${API_URL}/recipes/bookmarked/meow`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // ✅ Get token from context
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch bookmarked recipes");
    }

    return data.bookmarkedRecipes;
  } catch (error) {
    console.error("🔴 Fetch Bookmarked Recipes Error:", error);
    return [];
  }
};

export const removeBookmarks = async (recipeIds, token) => {
  try {
    const response = await fetch(`${API_URL}/recipes/bookmarks/unbookmark`, { // Bulk unbookmarking endpoint
      method: "DELETE", // Use DELETE method to remove bookmarks
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // Pass token for authentication
      },
      body: JSON.stringify({ recipeIds }), // Send array of recipe IDs to be removed
    });

    const contentType = response.headers.get("content-type");

    if (!contentType || !contentType.includes("application/json")) {
      const textResponse = await response.text();
      console.error("🔴 Non-JSON Response:", textResponse);
      return { error: "Unexpected server response" };
    }

    const jsonResponse = await response.json();

    if (!jsonResponse.success) {
      return { error: jsonResponse.message || "Failed to remove bookmarks" };
    }

    return jsonResponse.data; // Return success data
  } catch (error) {
    console.error("🔴 Remove Bookmarks error:", error);
    return { error: "Something went wrong!" };
  }
};

export const fetchRecipeIdsByNames = async (names) => {
  try {
    const response = await fetch(`${API_URL}/recipes/ids`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ names }),
    });
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const textResponse = await response.text();
      console.error("🔴 Non-JSON Response:", textResponse);
      return { error: "Unexpected server response" };
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("🔴 Fetch Recipe IDs by Names Error:", error);
    return { error: "Something went wrong!" };
  }
};

export const searchRecipes = async (query) => {
  try {
    const response = await fetch(`${API_URL}/recipes/search?query=${query}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch recipes");
    }

    const data = await response.json();

    return data; // Return the matched recipes
  } catch (error) {
    console.error("Search error:", error);
    throw new Error("An error occurred while searching for recipes");
  }
};

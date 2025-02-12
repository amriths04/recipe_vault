const API_URL = "http://192.168.0.170:5000/api/recipes";

export const fetchRecipes = async () => {
  try {
    const response = await fetch(`${API_URL}/`, {
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
    const response = await fetch(`${API_URL}/${recipeId}`, {
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
    const response = await fetch(`${API_URL}/`, {
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
    const response = await fetch(`${API_URL}/${recipeId}`, {
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
    const response = await fetch(`${API_URL}/${recipeId}`, {
      method: "DELETE",
    });

    return await response.json();
  } catch (error) {
    console.error("🔴 Delete Recipe Error:", error);
    return { error: "Something went wrong!" };
  }
};

export const toggleBookmarkRecipe = async (recipeId, userId) => {
  try {
    const response = await fetch(`${API_URL}/bookmark`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ recipeId, userId }),
    });

    return await response.json();
  } catch (error) {
    console.error("🔴 Toggle Bookmark Error:", error);
    return { error: "Something went wrong!" };
  }
};

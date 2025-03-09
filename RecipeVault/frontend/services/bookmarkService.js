const API_URL = "http://192.168.71.126:5000/api";


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

export const sendToShoppingList = async (recipeIds, token) => {
  try {
    const response = await fetch(`${API_URL}/shopping-list/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ recipeIds }),
    });

    const jsonResponse = await response.json();
    return jsonResponse;
  } catch (error) {
    console.error("🔴 Send to Shopping List error:", error);
    return { error: "Something went wrong!" };
  }
};


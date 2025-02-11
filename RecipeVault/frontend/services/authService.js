const API_URL = "http://192.168.0.166:5000/api/auth";

export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const responseText = await response.text();
    console.log("🔹 Raw Response:", responseText);

    // 🔹 Check if response is valid JSON
    try {
      const jsonResponse = JSON.parse(responseText);

      if (!jsonResponse.accessToken) {
        console.error("🔴 No access token in response:", jsonResponse);
        return { error: "Invalid response from server" };
      }

      return jsonResponse;
    } catch (error) {
      console.error("🔴 JSON Parse Error:", error);
      return { error: "Invalid server response" };
    }
  } catch (error) {
    console.error("🔴 Login error:", error);
    return { error: "Something went wrong!" };
  }
};



import { API_URL } from '../config';

export const registerUser = async (username, email, phone, password, name, dob) => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
        phone,
        password,
        profile: { name, dob },
      }),
    });

    const contentType = response.headers.get("content-type");

    if (!contentType || !contentType.includes("application/json")) {
      const textResponse = await response.text();
      console.error("🔴 Non-JSON Response:", textResponse);
      return { error: "Unexpected server response" };
    }

    const jsonResponse = await response.json();

    if (!jsonResponse.success) {
      return { error: jsonResponse.message || "Registration failed" };
    }

    return jsonResponse.data; // Return only relevant data
  } catch (error) {
    console.error("🔴 Register error:", error);
    return { error: "Something went wrong!" };
  }
};




export const loginUser = async (identifier, password) => {
  try {
    const payload =
      identifier.includes("@")
        ? { email: identifier, password }
        : { username: identifier, password };

    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const responseText = await response.text();
    try {
      const jsonResponse = JSON.parse(responseText);

      if (!jsonResponse.accessToken) {
        return { error: "Invalid Credentials" };
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




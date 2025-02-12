import { User } from "../models/userModel.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generateAccessAndRefreshTokens } from "../utils/jwtToken.js";

// 🔹 REGISTER USER
const registerUser = asyncHandler(async (req, res) => {
    const { username, email, phone, password, profile } = req.body;

    if ([username, email, password, profile.name, profile.dob].some((field) => !field?.trim())) {
        throw new ApiError(400, "All fields are required: username, email, password, name, dob,.");
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }, { phone }] });
    if (existingUser) {
        throw new ApiError(409, "User with this email, username, or phone already exists.");
    }

    // Create new user
    const user = await User.create({
        username: username.toLowerCase(),
        email,
        phone,
        password,
        profile: {
            name: profile.name,
            dob: profile.dob, // ✅ Ensure location is stored
        },
    });

    // Generate tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
    user.refreshToken = refreshToken;
    await user.save();

    // Remove sensitive data before sending response
    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    // Set cookies (httpOnly & secure)
    const options = { httpOnly: true, secure: true, sameSite: "Strict" };

    return res
        .status(201)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(201, { user: createdUser, accessToken }, "User registered successfully"));
});



// 🔹 LOGIN USER
const loginUser = asyncHandler(async (req, res) => {
    console.log("🔹 Login Request Body:", req.body);

    const { email, username, password } = req.body;

    if (!username && !email) {
        return res.status(400).json({ error: "Username or email is required" });
    }

    const user = await User.findOne({ $or: [{ username }, { email }] });
    if (!user) {
        return res.status(404).json({ error: "User does not exist" });
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid user credentials" });
    }

    // 🔹 Generate tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
    user.refreshToken = refreshToken;
    await user.save();

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    console.log("✅ Login Successful:", { user: loggedInUser, accessToken });

    // 🔹 Ensure accessToken is included in response
    return res.status(200).json({ success: true, user: loggedInUser, accessToken });
});



// 🔹 LOGOUT USER
const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: 1 } });

    const options = { httpOnly: true, secure: true, sameSite: "Strict" };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out successfully"));
});

export { registerUser, loginUser, logoutUser };

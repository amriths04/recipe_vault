import { User } from "../models/userModel.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generateAccessAndRefreshTokens } from "../utils/jwtToken.js";

// 🔹 REGISTER USER
const registerUser = asyncHandler(async (req, res) => {
    const { username, email, phone, password, profile } = req.body;

    if ([username, email, password].some((field) => !field?.trim())) {
        throw new ApiError(400, "Username, email, and password are required");
    }

    // Check if user already exists
    const existedUser = await User.findOne({ $or: [{ username }, { email }, { phone }] });
    if (existedUser) {
        throw new ApiError(409, "User with email, username, or phone already exists");
    }

    // Create user
    const user = await User.create({
        username: username.toLowerCase(),
        email,
        phone,
        password,
        profile: {
            name: profile?.name || "",
            dob: profile?.dob || null,
            location: profile?.location || "",
        },
    });

    // Generate tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
    user.refreshToken = refreshToken;
    await user.save();

    // Return user without sensitive data
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
    const { email, username, password } = req.body;

    if (!username && !email) {
        throw new ApiError(400, "Username or email is required");
    }

    const user = await User.findOne({ $or: [{ username }, { email }] });
    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
    user.refreshToken = refreshToken;
    await user.save();

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = { httpOnly: true, secure: true, sameSite: "Strict" };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, { user: loggedInUser, accessToken }, "User logged in successfully"));
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

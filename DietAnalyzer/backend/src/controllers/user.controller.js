import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating tokens");
  }
};

export const signUp = async (req, res) => {
  try {
    const { username, email, password, firstName, lastName } = req.body;

    // Input validation
    if (!username?.trim()) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Username is required"));
    }

    if (!email?.trim()) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Email is required"));
    }

    if (!password?.trim()) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Password is required"));
    }

    // Username validation
    if (username.length < 3) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Username must be at least 3 characters long"));
    }

    if (username.length > 30) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Username cannot exceed 30 characters"));
    }

    // Password validation
    if (password.length < 6) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Password must be at least 6 characters long"));
    }

    // Email format validation
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Please provide a valid email address"));
    }

    // Check for existing user
    const existingUser = await User.findOne({
      $or: [
        { username: { $regex: new RegExp(`^${username}$`, 'i') } },
        { email: email.toLowerCase() }
      ]
    });

    if (existingUser) {
      if (existingUser.email === email.toLowerCase()) {
        return res
          .status(409)
          .json(new ApiResponse(409, null, "Email is already registered"));
      }
      return res
        .status(409)
        .json(new ApiResponse(409, null, "Username is already taken"));
    }

    // Create user
    const user = await User.create({
      username: username.trim(),
      email: email.toLowerCase().trim(),
      password,
      firstName: firstName?.trim(),
      lastName: lastName?.trim()
    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
      throw new ApiError(500, "Something went wrong while registering the user");
    }

    return res
      .status(201)
      .json(new ApiResponse(201, createdUser, "Account created successfully! You can now sign in."));

  } catch (error) {
    console.error("SignUp Error:", error);
    const statusCode = error instanceof ApiError ? error.statusCode : 500;
    const message = error instanceof ApiError 
      ? error.message 
      : "Something went wrong. Please try again.";
    
    return res
      .status(statusCode)
      .json(new ApiResponse(statusCode, null, message));
  }
};

export const signIn = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username?.trim()) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Username is required"));
    }

    if (!password?.trim()) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Password is required"));
    }

    const user = await User.findOne({
      username: { $regex: new RegExp(`^${username}$`, 'i') }
    });

    if (!user) {
      return res
        .status(401)
        .json(new ApiResponse(401, null, "Invalid credentials"));
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
      return res
        .status(401)
        .json(new ApiResponse(401, null, "Invalid credentials"));
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
      httpOnly: true,
      secure: true
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(new ApiResponse(
        200,
        { user: loggedInUser },
        "Sign in successful! Redirecting..."
      ));

  } catch (error) {
    console.error("SignIn Error:", error);
    const statusCode = error instanceof ApiError ? error.statusCode : 500;
    const message = error instanceof ApiError 
      ? error.message 
      : "Something went wrong. Please try again.";
    
    return res
      .status(statusCode)
      .json(new ApiResponse(statusCode, null, message));
  }
};

export const logout = async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $unset: { refreshToken: 1 }
      },
      { new: true }
    );

    const options = {
      httpOnly: true,
      secure: true
    };

    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResponse(
        200,
        {},
        "Logged out successfully"
      ));

  } catch (error) {
    console.error("Logout Error:", error);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Something went wrong while logging out"));
  }
};

export const refreshAccessToken = async (req, res) => {
  try {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
      return res
        .status(401)
        .json(new ApiResponse(401, null, "Unauthorized request"));
    }

    try {
      const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
      const user = await User.findById(decodedToken?._id);

      if (!user || incomingRefreshToken !== user?.refreshToken) {
        return res
          .status(401)
          .json(new ApiResponse(401, null, "Invalid refresh token"));
      }

      const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

      const options = {
        httpOnly: true,
        secure: true
      };

      return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(
          200,
          { accessToken, refreshToken },
          "Access token refreshed successfully"
        ));

    } catch (err) {
      console.error("Token Verification Error:", err);
      return res
        .status(401)
        .json(new ApiResponse(401, null, "Invalid refresh token"));
    }
  } catch (error) {
    console.error("Refresh Token Error:", error);
    return res
      .status(401)
      .json(new ApiResponse(401, null, "Invalid refresh token"));
  }
};
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { ApiResponse } from "../utils/ApiResponse.js"
import { ApiError } from "../utils/ApiError.js"

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
    throw new ApiError(500, "Something went wrong while generating tokens: " + error.message);
  }
};

export const signUp = async (req, res) => {
  try {
    const { username, email, password, firstName, lastName } = req.body;

    if (!username || !email || !password) {
      const error = new ApiError(400, "Username, email, and password are required");
      return res.status(error.statusCode).json({
        statusCode: error.statusCode,
        message: error.message,
        success: false,
        data: null
      });
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existingUser) {
      const error = new ApiError(409, "Username or email already exists");
      return res.status(error.statusCode).json({
        statusCode: error.statusCode,
        message: error.message,
        success: false,
        data: null
      });
    }

    const user = await User.create({
      username,
      email,
      password,
      firstName,
      lastName
    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
      const error = new ApiError(500, "Something went wrong while creating the user");
      return res.status(error.statusCode).json({
        statusCode: error.statusCode,
        message: error.message,
        success: false,
        data: null
      });
    }

    return res.status(201).json({
      statusCode: 201,
      message: "User created successfully",
      success: true,
      data: createdUser
    });
  } catch (error) {
    const statusCode = error instanceof ApiError ? error.statusCode : 500;
    return res.status(statusCode).json({
      statusCode,
      message: error instanceof ApiError ? error.message : "Internal server error",
      success: false,
      data: null
    });
  }
};

export const signIn = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username) {
      return res.status(400).json({
        statusCode: 400,
        message: "Username is required",
        success: false,
        data: null
      });
    }

    if (!password) {
      return res.status(400).json({
        statusCode: 400,
        message: "Password is required",
        success: false,
        data: null
      });
    }

    console.log(username, password);

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({
        statusCode: 404,
        message: "User not found",
        success: false,
        data: null
      });
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        statusCode: 401,
        message: "Invalid credentials",
        success: false,
        data: null
      });
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
      .json({
        statusCode: 200,
        message: "User logged in successfully",
        success: true,
        data: {
          user: loggedInUser
        }
      });
  } catch (error) {
    const statusCode = error instanceof ApiError ? error.statusCode : 500;
    return res.status(statusCode).json({
      statusCode,
      message: error instanceof ApiError ? error.message : "Internal server error",
      success: false,
      data: null
    });
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
      .json({
        statusCode: 200,
        message: "User logged out successfully",
        success: true,
        data: {}
      });
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      message: "Internal server error",
      success: false,
      data: null
    });
  }
};

export const refreshAccessToken = async (req, res) => {
  try {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
      return res.status(401).json({
        statusCode: 401,
        message: "Unauthorized request",
        success: false,
        data: null
      });
    }

    try {
      const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
      const user = await User.findById(decodedToken?._id);

      if (!user) {
        return res.status(401).json({
          statusCode: 401,
          message: "Invalid refresh token",
          success: false,
          data: null
        });
      }

      if (incomingRefreshToken !== user?.refreshToken) {
        return res.status(401).json({
          statusCode: 401,
          message: "Invalid refresh token",
          success: false,
          data: null
        });
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
        .json({
          statusCode: 200,
          message: "Access token refreshed successfully",
          success: true,
          data: { accessToken, refreshToken }
        });
    } catch (err) {
      return res.status(401).json({
        statusCode: 401,
        message: "Invalid refresh token",
        success: false,
        data: null
      });
    }
  } catch (error) {
    return res.status(401).json({
      statusCode: 401,
      message: "Invalid refresh token",
      success: false,
      data: null
    });
  }
};
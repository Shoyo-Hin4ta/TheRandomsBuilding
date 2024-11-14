import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import {ApiResponse} from "../utils/ApiResponse.js"
import {ApiError} from "../utils/ApiError.js"

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
        throw new ApiError(400, "Username, email, and password are required");
      }
  
      const existingUser = await User.findOne({ $or: [{ username }, { email }] });
  
      if (existingUser) {
        throw new ApiError(409, "Username or email already exists");
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
        throw new ApiError(500, "Something went wrong while creating the user");
      }
  
      return res.status(201).json(
        new ApiResponse(201, createdUser, "User created successfully")
      );
    } catch (error) {
      if (error instanceof ApiError) {
        return res.status(error.statusCode).json(error);
      }
      return res.status(500).json(new ApiError(500, "Internal server error"));
    }
  };
  
  export const signIn = async (req, res) => {
    try {
      const { username, password } = req.body;
  
      if (!username) {
        throw new ApiError(400, "Username is required");
      }
  
      if (!password) {
        throw new ApiError(400, "Password is required");
      }

      console.log(username, password)
  
      const user = await User.findOne({ $or: [{ username }] });
  
      if (!user) {
        throw new ApiError(404, "User not found");
      }
  
      const isPasswordValid = await user.isPasswordCorrect(password);
  
      if (!isPasswordValid) {
        throw new ApiError(401, "Invalid credentials");
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
        .json(
          new ApiResponse(200, {
            user: loggedInUser,
            // accessToken,
            // refreshToken
          }, "User logged in successfully")
        );
    } catch (error) {
      if (error instanceof ApiError) {
        return res.status(error.statusCode).json(error);
      }
      return res.status(500).json(new ApiError(500, "Internal server error"));
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
        .json(new ApiResponse(200, {}, "User logged out successfully"));
    } catch (error) {
      return res.status(500).json(new ApiError(500, "Internal server error"));
    }
  };
  
  export const refreshAccessToken = async (req, res) => {
    try {
      const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
  
      if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request");
      }
  
      const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
      
      const user = await User.findById(decodedToken?._id);
  
      if (!user) {
        throw new ApiError(401, "Invalid refresh token");
      }
  
      if (incomingRefreshToken !== user?.refreshToken) {
        throw new ApiError(401, "Refresh token is expired or used");
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
        .json(
          new ApiResponse(200, { accessToken, refreshToken }, "Access token refreshed successfully")
        );
    } catch (error) {
      if (error instanceof ApiError) {
        return res.status(error.statusCode).json(error);
      }
      return res.status(500).json(new ApiError(500, "Internal server error"));
    }
  };
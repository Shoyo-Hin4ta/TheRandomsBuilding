// src/middlewares/auth.middleware.js
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();

export const verifyJWT = async(req, res, next) => {
    try {
        let token = req.cookies?.accessToken || req.header("Authorization");
        
        if (token?.startsWith("Bearer ")) {
            token = token.substring(7);
        }
    
        if(!token) {
            throw new ApiError(401, "Unauthorized Request");
        }
    
        try {
            const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            
            if (!decodedToken?._id) {
                throw new ApiError(401, "Invalid access token");
            }

            const user = await User.findById(decodedToken._id)
                                 .select("-password -refreshToken");
        
            if(!user) {
                throw new ApiError(401, "User not found");
            }
        
            req.user = user;
            next();
        } catch (err) {
            if (err.name === 'JsonWebTokenError') {
                throw new ApiError(401, "Invalid access token");
            }
            if (err.name === 'TokenExpiredError') {
                throw new ApiError(401, "Access token expired");
            }
            throw err;
        }
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            statusCode: error.statusCode || 500,
            message: error.message || "Authentication failed",
            success: false,
            data: null
        });
    }
}
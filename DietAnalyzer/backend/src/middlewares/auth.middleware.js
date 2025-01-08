// src/middlewares/auth.middleware.js
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();

export const verifyJWT = async(req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");
    
        if(!token) {
            throw new ApiError(401, "Unauthorized Request");
        }
    
        try {
            const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            
            if (!decodedToken?._id) {
                throw new ApiError(401, "Invalid access token");
            }

            const user = await User.findById(decodedToken._id)
                                 .select("-password");
        
            if(!user) {
                throw new ApiError(401, "User not found");
            }
        
            req.user = user;
            next();
        } catch (err) {
            throw new ApiError(401, "Invalid access token");
        }
    } catch (error) {
        throw new ApiError(error.statusCode || 401, error.message || "Invalid access token");
    }
}
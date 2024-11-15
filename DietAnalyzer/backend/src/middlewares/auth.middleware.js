import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";

export const verifyJWT = async(req, res, next) => {
    try {
        let token = req.cookies?.accessToken || req.header("Authorization");
        
        if (token?.startsWith("Bearer ")) {
            token = token.substring(7);
        }
    
        if(!token) {
            return res.status(401).json({
                statusCode: 401,
                message: "Unauthorized Request",
                success: false,
                data: null
            });
        }
    
        try {
            const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
        
            if(!user) {
                return res.status(401).json({
                    statusCode: 401,
                    message: "Invalid access token",
                    success: false,
                    data: null
                });
            }
        
            req.user = user;
            next();
        } catch (err) {
            return res.status(401).json({
                statusCode: 401,
                message: "Invalid access token",
                success: false,
                data: null
            });
        }
    } catch (error) {
        return res.status(401).json({
            statusCode: 401,
            message: "Invalid access token",
            success: false,
            data: null
        });
    }
}
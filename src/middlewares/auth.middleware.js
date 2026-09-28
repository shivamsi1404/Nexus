import { ApiError } from "../utils/apierror.js";
import { async_handler } from "../utils/asynchandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

// Middleware to authorize the authentication process 

export const verifyJWT = async_handler(async (req,_,next) => {

    try {
        // we will use two different ways to get the access token 
        const token = req.cookies?.accesstoken || req.header("Authorization")?.replace("Bearer ","");
    
        if (!token)
        {
            throw ApiError(401,"Unauthorize request")
        }
    
        // verification 
        const decodetoken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET )
    
        // getting user by tokens 
        const user = await User.findById(decodetoken?._id).select("-password -refreshtokens");
    
        if (!user)
        {
            throw new ApiError(401,"invalid access token")
        }
    
        req.user = user;
    
        next();
    } catch (error) {
        throw new ApiError(401,error?.error?.message||"invalid access tokem")
    }
}) 
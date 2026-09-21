import mongoose from "mongoose";
import { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// creation of User Model with password encryption 

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true 
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    fullname: {
        type: String,
        required: true,
        lowercase: true,
        trim: true 
    },
    avatar: {
        type: String, // URL
        required: true
    },
    coverimage: {
        type: String // URL
    },
    watchhistory: [
        {
            type: Schema.Types.ObjectId,
            ref: "video"
        }
    ],
    password: {
        type: String,
        required: [true,"Password is required"]
    },
    refreshtokens: {
        type: String
    }
},{timestamps: true  /* will give createdat and updatedat */ });

// pre is the hook that runs before every then User is saved or modified 

// to handle unrequired password encryption we use if to handle that situation 

UserSchema.pre("save", async function(next) {
    if (!this.isModified("password")) return next(); // if modified then change the password it not modified then simply run the next fn 
    this.password = await bcrypt.hash(this.password,10);
    next()
});

// use bcrypt to de encrypt the password and match it with the one user entered  

UserSchema.methods.isPasswordcorrect = async function (password) {
    return await bcrypt.compare(password,this.password)
}

// Access Token and Refresh Token generation 

UserSchema.methods.generateAccesstoken = function(){
    return jwt.sign({
        _id: this._id,
        username: this.username,
        fullname: this.fullname,
        email: this.email
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
)
};
UserSchema.methods.generateRefreshtoken = function(){
    return jwt.sign({
        _id: this._id,
        username: this.username,
        fullname: this.fullname,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
)
};

export const User = mongoose.model("User",UserSchema);

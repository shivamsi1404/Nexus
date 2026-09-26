import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// Initialising Express application
const app = express()

// This allows your frontend to communicate with your backend from the specified origin.
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))


app.use(express.json({limit:"16kb"})); // allows Express to understant JSON and access it through req.body
app.use(express.urlencoded({extended:true,limit:"16kb"})); // Allows Express to parse URL-encoded/form data.
app.use(express.static("public")); // Treat the public folder as a folder containing static files.
app.use(cookieParser()); // This allows you to read cookies through: req.cookies

// routes import

import userRouter from './routes/user.routes.js'

// routes declaration

app.use("/api/v1/users",userRouter)

export {app};
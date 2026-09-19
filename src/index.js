import dotenv from "dotenv";
import connectDB from "./database/dbconnect.js";

dotenv.config({
    path: './env'
})

connectDB();
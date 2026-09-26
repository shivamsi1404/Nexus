import dotenv from "dotenv";
import connectDB from "./database/dbconnect.js";
import { app } from "./app.js";

// Load Environment Variables 
dotenv.config({
    path: './env'
})

// Call DB connection 
connectDB()
.then(()=>{
    const server = app.listen(process.env.PORT || 8000, () => {
        console.log(` Server is running at port ${process.env.PORT || 8000}`);
    });
    server.on("error",(error)=>{
        console.log("Error",error);
        
    })
})
.catch((error) => {
    console.log("MongoDB connection failed",error);
})

// connect the MongoDB server if it succeeds then start the express server on PORT mentioned in the Environment Variable or on 8000

// server.on is used to throw error if 8000 is already in use Error: listen EADDRINUSE

// then finally catch the final error is mongoDB connection fails 
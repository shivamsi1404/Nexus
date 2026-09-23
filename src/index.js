import dotenv from "dotenv";
import connectDB from "./database/dbconnect.js";
import { app } from "./app.js";

dotenv.config({
    path: './env'
})



connectDB()
.then(()=>{
    const server = app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running at port ${process.env.PORT}`);
    });
    server.on("error",(error)=>{
        console.log("Error",error);
        
    })
})
.catch((error) => {
    console.log("MongoDB connection failed",error);
})


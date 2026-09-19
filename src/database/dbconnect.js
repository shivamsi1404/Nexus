import dns from "node:dns";
import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

dns.setServers(["8.8.8.8"]);

const connectDB = async () => {
    try {
        const connectiondata = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`\n MongoDB connected !! DB host: ${connectiondata.connection.host}`);
    } catch (error) {
        console.log("Error in Database Connection ",error);
        process.exit(1);
    }
}

export default connectDB
import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";

// fs is the node js library for file system handling 

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// 

const Uploadoncloud = async (localfilepath) => {
    try {
        if (!localfilepath) {
            return null;
        }
        else {
            // unpload the locally saved file to the cloud and get its URL 

            const response = await cloudinary.uploader.upload(localfilepath, {
                resource_type: "auto"
            });

            console.log("file uploaded on cloud", response.url);
            if (fs.existsSync(localfilepath)) {
                fs.unlinkSync(localfilepath);
            }
            return response;
        }

    } catch (error) {
        console.log("Cloudinary error:", error);

        if (fs.existsSync(localfilepath)) {
            fs.unlinkSync(localfilepath);
        }

        return null;
    }
}

export { Uploadoncloud }
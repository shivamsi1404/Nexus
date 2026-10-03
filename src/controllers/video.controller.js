import { ApiError } from "../utils/apierror.js";
import { async_handler } from "../utils/asynchandler.js";
import { Uploadoncloud } from "../utils/cloudinary.js";
import { video } from "../models/video.model.js";
import { ApiResponse } from "../utils/apiresponse.js";

const uploadvideo = async_handler(async(req,res) => {
    // control flow
    // get the title and description from user request 
    // user upload the video from their device 
    // we upload that video to cloud 
    // server gets the cloud url in return and we store them
    // used the stored urls and update them on the database 
    // do the same for thumbnail 

    const {userdescription,usertitle} = req.body;
    const getvideolocally = req.files?.video[0]?.path;

    if(!getvideolocally)
    {
        throw new ApiError(400,"video not available")
    }

    const getthumbnaillocally = req.files?.thumbnail[0]?.path;

    if(!getthumbnaillocally)
    {
        throw new ApiError(400,"thumbnail not available")
    }

    const cloudvideo = await Uploadoncloud(getvideolocally);
    const cloudthumbnail = await Uploadoncloud(getthumbnaillocally);

    if(!cloudvideo)
    {
        throw new ApiError(400,"video path not available")
    }

    if(!cloudthumbnail)
    {
        throw new ApiError(400,"thumbnail path not available")
    }

    const postvideo = await video.create({
        videofile: cloudvideo.url,
        thumbnailfile: cloudthumbnail.url,
        title: usertitle,
        description: userdescription,
        duration: cloudvideo.duration,
        owner: req.user._id
    })

    const postedvideo = await video.findById(postvideo._id);

    if(!postedvideo)
    {
        throw new ApiError(400,"failed in fetching the video")
    }

    return res.status(200)
    .json(
        new ApiResponse(
            200,postedvideo,"video uploaded to NEXUS successfully"
        )
    )

})

export {uploadvideo}
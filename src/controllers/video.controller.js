import { ApiError } from "../utils/apierror.js";
import { async_handler } from "../utils/asynchandler.js";
import { Uploadoncloud } from "../utils/cloudinary.js";
import { video, video } from "../models/video.model.js";
import { ApiResponse } from "../utils/apiresponse.js";

const uploadvideo = async_handler(async (req, res) => {
    // control flow
    // get the title and description from user request 
    // user upload the video from their device 
    // we upload that video to cloud 
    // server gets the cloud url in return and we store them
    // used the stored urls and update them on the database 
    // do the same for thumbnail 

    const { userdescription, usertitle } = req.body;
    const getvideolocally = req.files?.video[0]?.path;

    if (!getvideolocally) {
        throw new ApiError(400, "video not available")
    }

    const getthumbnaillocally = req.files?.thumbnail[0]?.path;

    if (!getthumbnaillocally) {
        throw new ApiError(400, "thumbnail not available")
    }

    const cloudvideo = await Uploadoncloud(getvideolocally);
    const cloudthumbnail = await Uploadoncloud(getthumbnaillocally);

    if (!cloudvideo) {
        throw new ApiError(400, "video path not available")
    }

    if (!cloudthumbnail) {
        throw new ApiError(400, "thumbnail path not available")
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

    if (!postedvideo) {
        throw new ApiError(400, "failed in fetching the video")
    }

    return res.status(200)
        .json(
            new ApiResponse(
                200, postedvideo, "video uploaded to NEXUS successfully"
            )
        )

})

const getvideobyid = async_handler(async (req, res) => {
    // control flow 
    // get the id from the user 
    // use that id to run databse call
    // then we can call the databse from that id

    const { videoid } = req.params;

    if (!videoid)
    {
        throw new ApiError(400,"video id not found")
    }

    const getvideo = await video.findById(videoid);

    if (!getvideo) {
        throw new ApiError(404, "video not available")
    }

    return res.status(200)
        .json(
            new ApiResponse(
                200, getvideo, "video fetched"
            )
        )

})

const updatevideodetails = async_handler(async (req, res) => {
    // control flow 
    // get the video id 
    // get the new title and description from the user 
    // call the database and update the details 
    const { videoid } = req.params;

    if (!videoid)
    {
        throw new ApiError(400,"video id not found")
    }

    const { newtitle, newdescription } = req.body;

    if (!(newtitle && newdescription)) {
        throw new ApiError(401, "enter empty fields")
    }

    const Video = await video.findByIdAndUpdate(videoid,
        {
            $set: {
                title: newtitle,
                description: newdescription
            }
        },
        {
            new: true
        }
    )

    return res.status(200).json(
        new ApiResponse(
            200, Video,
            "details updates"
        )
    )
})

const updatethumbnail = async_handler(async (req, res) => {
    // controll flow 
    // get the video from id 
    // then get the file by multer and upload it on cloudinary 
    // then make the update on database 

    const { videoid } = req.params;

    if (!videoid)
    {
        throw new ApiError(400,"video id not found")
    }

    const newthumbnailpath = req.file?.path

    if (!newthumbnailpath) {
        throw new ApiError(400, "upload new thumbnail")
    }

    const newthumbnail = await Uploadoncloud(newthumbnailpath);

    if (!newthumbnail) {
        throw new ApiError(400, "upload new thumbnail")
    }

    const Video = await video.findByIdAndUpdate(videoid, {
        $set: {
            thumbnail: newthumbnail
        },
    }, {
        new: true
    })


    return res.status(200).json(
        new ApiResponse(
            200, Video, "thumbnail updated"
        )
    )
})

const deletevideo = async_handler(async(req,res) => {
    // control flow 
    // get the video from id 
    // wipe it from the database 

    const {videoid} = req.params

    if (!videoid)
    {
        throw new ApiError(400,"video id not found")
    }

    const videotobedeleted = await video.findByIdAndDelete(videoid)

    return res.status(200).json(
        new ApiResponse(200,videotobedeleted,"video deleted successfully")
    )
}) 

export {
    uploadvideo,
    getvideobyid, updatevideodetails,
    updatethumbnail,
    deletevideo
}
import { async_handler } from "../utils/asynchandler";
import { ApiError } from "../utils/apierror";
import { ApiResponse } from "../utils/apiresponse.js";
import { Like } from "../models/like.model.js";

const toggleVideoLike = async_handler(async (req, res) => {
    const {videoid} = req.params
    
    // control flow 
    // get the video id from request parameter 
    // check if a like exist by .findOne function 
    // if like exist just delete it 
    // if like does not exist then create it 

    const userid = req.user._id;

    if (!videoid) {
        throw new ApiError(400, "Video ID is required");
    }

    // check whether the user has already liked the video
    const existinglike = await Like.findOne({
        video: videoid,
        likedBy: userid
    });

    // if the like exists, delete it
    if (existinglike) {

        await Like.findByIdAndDelete(existinglike._id);

        return res
            .status(200)
            .json(new ApiResponse(200, {}, "Video unliked successfully"));
    }

    // if the like doesn't exist, create it
    const like = await Like.create({
        video: videoid,
        likedBy: userid
    });

    return res
        .status(201)
        .json(new ApiResponse(201, like, "Video liked successfully"));
})

const togglecommentlike = async_handler(async (req, res) => {

    const { commentid } = req.params;
    const userid = req.user._id;

    if (!commentid) {
        throw new ApiError(400, "Comment ID is required");
    }

    const existinglike = await Like.findOne({
        comment: commentid,
        likedBy: userid
    });

    if (existinglike) {

        await Like.findByIdAndDelete(existinglike._id);

        return res
            .status(200)
            .json(new ApiResponse(200, {}, "Comment unliked successfully"));
    }

    const like = await Like.create({
        comment: commentid,
        likedBy: userid
    });

    return res
        .status(201)
        .json(new ApiResponse(201, like, "Comment liked successfully"));
});

const toggletweetlike = async_handler(async (req, res) => {

    const { tweetid } = req.params;
    const userid = req.user._id;

    if (!tweetid) {
        throw new ApiError(400, "Tweet ID is required");
    }

    const existinglike = await Like.findOne({
        tweet: tweetid,
        likedBy: userid
    });

    if (existinglike) {

        await Like.findByIdAndDelete(existinglike._id);

        return res
            .status(200)
            .json(new ApiResponse(200, {}, "Tweet unliked successfully"));
    }

    const like = await Like.create({
        tweet: tweetid,
        likedBy: userid
    });

    return res
        .status(201)
        .json(new ApiResponse(201, like, "Tweet liked successfully"));
});

export {
    toggleVideoLike,
    togglecommentlike,
    toggletweetlike
}
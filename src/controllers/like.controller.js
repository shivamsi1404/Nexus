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

const toggleCommentLike = async_handler(async (req, res) => {
    const {commentId} = req.params
    

})

const toggleTweetLike = async_handler(async (req, res) => {
    const {tweetId} = req.params
    t
}
)

const getLikedVideos = async_handler(async (req, res) => {
    
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}
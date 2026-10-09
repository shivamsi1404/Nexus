import { async_handler } from "../utils/asynchandler";
import { ApiError } from "../utils/apierror";
import { ApiResponse } from "../utils/apiresponse.js"
import { Tweet } from "../models/tweet.model.js";

const createtweet = async_handler(async(req,res) => {
    // control flow 
    // just create a tweet data from the user request 
    // use that data create tweet database document 

    const {content} = req.body;

    if (typeof content !== "string" || !content.trim())
    {
        throw ApiError(400,"invalid input")
    }

    const tweet = await Tweet.create({
        content: content,
        owner: req.user._id
    })

    return res.status(200)
    .json(
        new ApiResponse(200,tweet,"tweet created")
    )
})
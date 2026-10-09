import { async_handler } from "../utils/asynchandler";
import { ApiError } from "../utils/apierror";
import { ApiResponse } from "../utils/apiresponse.js"
import { Tweet } from "../models/tweet.model.js";

const createtweet = async_handler(async(req,res) =>{
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

const updatetweet = async_handler(async(req,res) =>{
    // control flow 
    // get the new content from the user request 
    // get the tweet from the user params 
    // check for the error handling 
    // find and update 
    // return the response 

    const { content } = req.body;
    const { tweetid } = req.params;

    if (!content || !content.trim()) {
        throw ApiError(400, "Tweet content is required");
    }

    const tweet = await Tweet.findOneAndUpdate(
        {
            _id: tweetid,
            owner: req.user._id // handling the owner 
        },
        {
            $set: {
                content: content.trim()
            }
        },
        {
            new: true,
            runValidators: true
        }
    );

    if (!tweet) {
        throw ApiError(404, "Tweet not found or unauthorized");
    }

    return res.status(200).json(
        new ApiResponse(200, tweet, "Tweet updated successfully")
    );

})

const deletetweet = async_handler(async(req,res) =>{
    // control flow 
    // get the tweet id 
    // find and delete 
// Get the tweet ID
    const { tweetid } = req.params;

    if (!tweetid) {
        throw ApiError(400, "Tweet ID is required");
    }

    // Find and delete the tweet belonging to the authenticated user
    const tweet = await Tweet.findOneAndDelete({
        _id: tweetid,
        owner: req.user._id
    });

    if (!tweet) {
        throw ApiError(404, "Tweet not found or unauthorized");
    }

    return res.status(200).json(
        new ApiResponse(200, tweet, "Tweet deleted successfully")
    );
})

const getusertweet = async_handler(async(req,res) =>{
        // control flow 
        // use the user id from the request 
        // then use that and find function to get all the tweets  
    
        const {userid} = req.params
    
        if (!userid)
        {
            throw ApiError(404,"user not found")
        }
    
        const listtweets = await Tweet.find({
            owner : userid
        })
    
        if (listtweets.length === 0)
        {
            throw ApiError(404,"user has no tweets")
        }
    
        return res.status(200).json(
            new ApiResponse(
                200,listtweets,"all tweets"
            )
        )
})

export {createtweet,updatetweet,deletetweet,getusertweet}
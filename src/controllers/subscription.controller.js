import { async_handler } from "../utils/asynchandler";
import { ApiError } from "../utils/apierror";
import { ApiResponse } from "../utils/apiresponse.js";
import { subscription, subscription, subscription } from "../models/subscription.model.js";

const toggleSubscription = async_handler(async (req,res) => {
    const {channelid} = req.params;

    if (!channelid)
    {
        throw new ApiError(400,"no channel available")
    }

    const existingsubscription = await subscription.findOne({
        subscriber : req.user._id, // user who subscribed
        channel : channelid // the channel which user subscribed
    })

    if (existingsubscription)
    {
        await subscription.findByIdAndDelete(existingsubscription._id)


        
        return res.status(200)
        .json(
            new ApiResponse(
                200,{},"subscription removed"
            )
        )
    }

    const subscribe = await subscription.create({
        subscriber : req.user._id,
        channel : channelid
    })

    return res.status(200)
    .json(
        new ApiResponse(
            200,subscribe,"subscription added"
        )
    )
})

const getSubscribers = async_handler(async (req, res) => {
    const { channelid } = req.params;

    if (!channelid) {
        throw new ApiError(400, "Channel ID is required");
    }

    const subscribers = await subscription.aggregate([
        {
            $match: {
                channel: new mongoose.Types.ObjectId(channelid)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "subscriber",
                foreignField: "_id",
                as: "subscriberDetails"
            }

            // with the lookup we are checking for user whos id matches with id in the subscriber field in the subscription document that matches with the channelid provided 
        },
        {
            $unwind: "$subscriberDetails"
        },
        {
            $replaceRoot: {
                newRoot: "$subscriberDetails"
            }
        }
    ]);

    return res.status(200).json(
        new ApiResponse(
            200,
            subscribers,
            "Subscribers fetched successfully"
        )
    );
});

const getSubscribedChannels = async_handler(async (req, res) => {
    const userid = req.user._id;

    const subscribedChannels = await subscription.aggregate([
        {
            $match: {
                subscriber: new mongoose.Types.ObjectId(userid)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "channel",
                foreignField: "_id",
                as: "channelDetails"
            }

            // with the lookup we are finding who user id is same as the channel id from the subscription document that matches with user 
        },
        {
            $unwind: "$channelDetails"
        },
        {
            $replaceRoot: {
                newRoot: "$channelDetails"
            }
        }
    ]);

    return res.status(200).json(
        new ApiResponse(
            200,
            subscribedChannels,
            "Subscribed channels fetched successfully"
        )
    );
});

export {toggleSubscription,getSubscribedChannels,getSubscribers}
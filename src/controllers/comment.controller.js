import { async_handler } from "../utils/asynchandler";
import { ApiError } from "../utils/apierror";
import { ApiResponse } from "../utils/apiresponse.js"
import { Comment } from "../models/comment.model.js";

const createcomment = async_handler(async (req, res) => {

    // control flow
    // get the video id from params
    // get the content from user
    // create a comment document for the database
    // get the user and mark them as the owner

    const { videoid } = req.params;
    const { content } = req.body;

    // validate the inputs
    if (!videoid) {
        throw new ApiError(400, "Video ID is required");
    }

    if (!content || !content.trim()) {
        throw new ApiError(400, "Comment content cannot be empty");
    }

    // create the comment
    const comment = await Comment.create({
        content: content.trim(),
        video: videoid,
        owner: req.user._id
    });

    // verify comment creation
    const createdcomment = await Comment.findById(comment._id);

    if (!createdcomment) {
        throw new ApiError(500, "Failed to create comment");
    }

    // return the response
    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                createdcomment,
                "Comment created successfully"
            )
        );
});

const updatecomment = async_handler(async (req, res) => {

    const { commentid } = req.params;
    const { content } = req.body;

    if (!commentid) {
        throw new ApiError(400, "Comment ID is required");
    }

    if (!content?.trim()) {
        throw new ApiError(400, "Comment content is required");
    }

    const comment = await Comment.findOneAndUpdate(
        {
            _id: commentid,
            owner: req.user._id
        },
        {
            $set: {
                content: content.trim()
            }
        },
        {
            new: true
        }
    );

    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, comment, "Comment updated successfully"));
});

const deletecomment = async_handler(async (req, res) => {

    const { commentid } = req.params;

    if (!commentid) {
        throw new ApiError(400, "Comment ID is required");
    }

    const comment = await Comment.findOneAndDelete({
        _id: commentid,
        owner: req.user._id
    });

    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, comment, "Comment deleted successfully"));
});

const getvideocomments = async_handler(async (req, res) => {

    const { videoid } = req.params;

    if (!videoid) {
        throw new ApiError(400, "video not found");
    }

    const comments = await Comment.find({
        video : videoid
    });

    return res
        .status(200)
        .json(new ApiResponse(200, comments, "video comments fetched successfully"));
});

export {createcomment,updatecomment,deletecomment,getvideocomments}
import mongoose from "mongoose";
import { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema({
    videoFile: {
        type: String, // URL
        required: true,
    },
    thumbnail: {
        type: String, // URL
        required: true
    },
    title: {
        type: String, 
        required: true
    },
    description: {
        type: String, 
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    views: {
        type: Number,
        required: true,
        default: true
    },
    isPublic:{
        type: Boolean,
        default: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }

},{timestamps: true})

videoSchema.plugin(mongooseAggregatePaginate); // it will allow you to write aggregation queries 

export const video = mongoose.model("video",videoSchema);

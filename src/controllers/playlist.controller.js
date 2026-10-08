import { async_handler } from "../utils/asynchandler";
import { Playlist } from "../models/playlist.model";
import { ApiError } from "../utils/apierror";
import { ApiResponse } from "../utils/apiresponse.js"

const createplaylist = async_handler(async (req, res) => {
    // control flow 
    // get the name and description of playlist from the user 
    // use that to create a new document in the database 

    const { name, description } = req.body;

    if(!(name && description))
    {
        throw new ApiError(400,"enter required fields")
    }

    const playlist = await Playlist.create({
        name,
        description,
        owner: req.user._id,
        videos: []
    });

    if(!playlist)
    {
        throw new ApiError(400,"error occured while creating playlist")
    }

    return res.status(201)
    .json(
        new ApiResponse(
            201,playlist,"playlist created Successfully"
        ) 
    )

})

const deleteplaylist = async_handler(async (req, res) => {

})

const updateplaylist = async_handler(async (req, res) => {

})

const getallplaylistofuser = async_handler(async (req, res) => {

})

const playlistbyid = async_handler(async (req, res) => {

})

const addvideotoplaylist = async_handler(async (req, res) => {

})

const removevideofromplaylist = async_handler(async (req, res) => {

})


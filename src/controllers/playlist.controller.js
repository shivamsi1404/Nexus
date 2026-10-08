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

    // controll flow 
    // get the playlist id from req.params 
    // use that id to get the playlist from database and delete it 
    
    const {playlistid} = req.params;

    if (!playlistid)
    {
        throw ApiError (400,"no valid playlist")
    }

    const playlisttobedeleted = await Playlist.findOneAndDelete({
        _id: playlistid,
        owner: req.user._id
    });

    if(!playlisttobedeleted)
    {
        throw ApiError (404,"no valid playlist or you are not the owner")
    }

    return res.status(200).json(
        new ApiResponse(200, playlisttobedeleted, "playlist deleted successfully")
    )
})

const updateplaylist = async_handler(async (req, res) => {
    // control flow 
    // get the new title and description from the user and update them in the database 
    // to update any of them available we will create an empty object and update those parameters there 

    const {playlistid} = req.params;
    const {title,description} = req.body

    if (!playlistid)
    {
        throw ApiError (400,"no valid playlist")
    }

    if (!(title || description))
    {
        throw ApiError (400,"empty fields")
    }

    const updateobject = {}

    if (title) 
    {
        updateobject.title = title;
    }

    if (description) 
    {
        updateobject.description = description;
    }


    const playlist = await Playlist.findByIdAndUpdate(playlistid,updateobject,{new : true})

    if (!playlist)
    {
        throw new ApiError(404,"no update made")
    }

    return res.status(200).json(
        new ApiResponse(
            200,playlist,"playlist updated"
        )
    )
})

const getallplaylistofuser = async_handler(async (req, res) => {

})

const playlistbyid = async_handler(async (req, res) => {

})

const addvideotoplaylist = async_handler(async (req, res) => {

})

const removevideofromplaylist = async_handler(async (req, res) => {

})


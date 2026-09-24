import { async_handler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/apierror.js";
import { User } from "../models/user.model.js";
import { Uploadoncloud } from "../utils/cloudinary.js";
import { upload } from "../middlewares/multer.middleware.js";
import { ApiResponse } from "../utils/apiresponse.js";

const registerUser = async_handler(async (req, res) => {
    // get user details from frontend here we use postman to get the data from the user 
    // validation (checking all the details)
    // check if user already exist : check by username and email 
    // check for images , check for avatar
    // if available then upload them to cloudinary , check for avatar 
    // create user object - create entry in DB
    // remove password and refresh token from the response
    // check for user creation 
    // return response 

    // get from postman 
    const { fullname, email, username, password } = req.body
    console.log("Email:",email);

    // Validation

    /*
    if (fullname === ""){
        throw new ApiError(400,"Full name not found")
    }
    */

    // that was the beginner apporach where we check every field by if conditions so that none of them remains empty 

    // Professional method 

    if (
        [fullname, email, username, password].some((entry) =>
            entry?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are neccesary")
    }

    // we imported user from the usermodel it has the ability directly call the mongoDB 

    const existeduser = User.findOne({
        $or: [{username},{email}]
    });

    if (existeduser)
    {
        throw new ApiError(409, "User already exist")
    }

    // as we added a middlewere before the register user it gives req more functions to perform 

    const avatarlocalpath = req.files?.avatar[0]?.path;
    const coverimagelocalpath = req.files?.coverimage[0]?.path;

    // validation 

    if (!avatarlocalpath)
    {
        throw new ApiError(409, "Avatar file is required")
    }

    // upload on cloudinary 

    const avatar = await Uploadoncloud(avatarlocalpath)
    const cover = await Uploadoncloud(coverimagelocalpath)

    if (!avatar)
    {
        throw new ApiError(409, "Avatar file is required")
    }

    // storing on database 

    const Userdb = await User.create({
        fullname,
        avatar : avatar.url,
        coverimage : coverimage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    // removing not needed stuff from response 

    const createduser = await User.findById(Userdb._id).select(
        "-password -refreshtokens"
    )

    // checking if user created on DB

    if (!createduser)
    {
        throw new ApiError(500, "Something went wrong")
    }

    return res.status(201).json(
        new ApiResponse(200,createduser,"User Registered Successfully")
    )

})

export { registerUser, };
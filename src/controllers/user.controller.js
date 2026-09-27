import { async_handler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/apierror.js";
import { User } from "../models/user.model.js";
import { Uploadoncloud } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiresponse.js";

// method to create refresh and access token 

const generateAccessandRefreshtoken = async (userID)=>{
    try {
        const user = await User.findById(userID)
        const accesstoken = user.generateAccesstoken();
        const refreshtoken = user.generateRefreshtoken();

        // storing those refresh tokens on the database
        user.refreshtokens = refreshtoken;
        await user.save({validateBeforeSave: false})

        // return both tokens to the codebase
        return {accesstoken,refreshtoken};
        
    } catch (error) {
        throw new ApiError(500,"Something went wrong while generating refresh and accesss token")
    }
}

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

    const existeduser = await User.findOne({
        $or: [{username},{email}]
    });

    console.log(existeduser);

    if (existeduser)
    {
        throw new ApiError(409, "User already exist")
    }

    // as we added a middlewere before the register user it gives req more functions to perform 

    const avatarlocalpath = req.files?.avatar[0]?.path;
    //const coverimagelocalpath = req.files?.coverimage[0]?.path; // this cannot handle the case if the cover image remains empty 

    let coverimagelocalpath;

    if ( req.files && Array.isArray(req.files.coverimage) && req.files.coverimage.length > 0)
    {
        coverimagelocalpath = req.files.coverimage[0].path
    }

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

    console.log(req.body)

    // storing on database 

    const Userdb = await User.create({
        fullname,
        avatar : avatar.url,
        coverimage : cover?.url || "",
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

const loginuser = async_handler(async (req,res) => {
    // get the data from the user by request body 
    // it can be login by username or email
    // check if user exist ( return error massage if dont exist )
    // if yes then validate password ( return error if wrong password )
    // access and refresh token generation 
    // send secure cookies 
    // response successful login 

    // get from request body 
    const {email,username,password} = req.body

    // email or username or both not available
    if (!username || !email)
    {
        throw new ApiError(400,"username or password is required");
    }

    // Find the user in the database either by username or email 
    const finduser = await User.findOne({
        $or: [{username},{email}]
    })
    // if user was not found 
    if (!finduser)
    {
        throw new ApiError(404,"user not found"); 
    }

    // password check 
    const passwordcheck = await finduser.isPasswordcorrect(password);

    if (!passwordcheck)
    {
        throw new ApiError(401,"incorrect password"); 
    }

    // token generation
    const {accesstoken,refreshtoken} = await generateAccessandRefreshtoken(finduser._id);

    // finduser had all the fields like password and all and we wont be returning them to the frontend so get a new variable holding details without sensitive info 
    const loggedinUser = await User.findById(finduser._id).select("-password -refreshtokens")

    // Sending cookies 
    const option = {
        httpOnly: true,
        secure: true
    }

    return res.status(200).cookie("accesstoken",accesstoken,option).cookie("refreshtoken",refreshtoken,option)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedinUser,accesstoken,refreshtoken
            },
            "User logged in Successfully"
        )
    )
})

const logoutuser = async_handler(async(req,res) => {
    // clear cookies 
    // and clear the refresh token from the user model saved in the dataabase 
    // we can get req user from the middlewere we inejcted in the route 

    User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshtokens: undefined
            }
            
        },
        {
            new: true
        }
    )
const option = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
    .clearCookie("accesstoken",option)
    .clearCookie("refreshtoken",option).json(
        200,{},"user loggged out"
    )

})

export { registerUser, 
    loginuser,logoutuser
};
import { async_handler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/apierror.js";
import { User } from "../models/user.model.js";
import { Uploadoncloud } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiresponse.js";
import jwt from "jsonwebtoken";

// method to create refresh and access token 

const generateAccessandRefreshtoken = async (userID) => {
    try {
        const user = await User.findById(userID)
        const accesstoken = user.generateAccesstoken();
        const refreshtoken = user.generateRefreshtoken();

        // test 2 checking token generation 
        // console.log(accesstoken, refreshtoken)

        // storing those refresh tokens on the database
        user.refreshtokens = refreshtoken;
        await user.save({ validateBeforeSave: false })

        // return both tokens to the codebase
        return { accesstoken, refreshtoken };

    } catch (error) {
        // test 3 checking for the token error 
        // console.log(error)
        throw new ApiError(500, "Something went wrong while generating refresh and accesss token")
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
    console.log("Email:", email);

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
        $or: [{ username }, { email }]
    });

    console.log(existeduser);

    if (existeduser) {
        throw new ApiError(409, "User already exist")
    }

    // as we added a middlewere before the register user it gives req more functions to perform 

    const avatarlocalpath = req.files?.avatar[0]?.path;
    //const coverimagelocalpath = req.files?.coverimage[0]?.path; // this cannot handle the case if the cover image remains empty 

    let coverimagelocalpath;

    if (req.files && Array.isArray(req.files.coverimage) && req.files.coverimage.length > 0) {
        coverimagelocalpath = req.files.coverimage[0].path
    }

    // validation 

    if (!avatarlocalpath) {
        throw new ApiError(409, "Avatar file is required")
    }

    // upload on cloudinary 

    const avatar = await Uploadoncloud(avatarlocalpath)
    const cover = await Uploadoncloud(coverimagelocalpath)

    if (!avatar) {
        throw new ApiError(409, "Avatar file is required")
    }

    console.log(req.body)

    // storing on database 

    const Userdb = await User.create({
        fullname,
        avatar: avatar.url,
        coverimage: cover?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    // removing not needed stuff from response 

    const createduser = await User.findById(Userdb._id).select(
        "-password -refreshtokens"
    )

    // checking if user created on DB

    if (!createduser) {
        throw new ApiError(500, "Something went wrong")
    }

    return res.status(201).json(
        new ApiResponse(200, createduser, "User Registered Successfully")
    )

})

const loginuser = async_handler(async (req, res) => {
    // get the data from the user by request body 
    // it can be login by username or email
    // check if user exist ( return error massage if dont exist )
    // if yes then validate password ( return error if wrong password )
    // access and refresh token generation 
    // send secure cookies 
    // response successful login 

    // test 1 req body error 
    // console.log(req.body)

    // get from request body 
    const { email, username, password } = req.body

    // email or username or both not available
    if (!(username || email)) {
        throw new ApiError(400, "username or email is required");
    }

    // Find the user in the database either by username or email 
    const finduser = await User.findOne({
        $or: [{ username }, { email }]
    })
    // if user was not found 
    if (!finduser) {
        throw new ApiError(404, "user not found");
    }

    // password check 
    const passwordcheck = await finduser.isPasswordcorrect(password);


    console.log(passwordcheck)

    if (!passwordcheck) {
        throw new ApiError(401, "incorrect password");
    }

    // token generation
    const { accesstoken, refreshtoken } = await generateAccessandRefreshtoken(finduser._id);

    // finduser had all the fields like password and all and we wont be returning them to the frontend so get a new variable holding details without sensitive info 
    const loggedinUser = await User.findById(finduser._id).select("-password -refreshtokens")

    // Sending cookies 
    const option = {
        httpOnly: true,
        secure: true
    }

    return res.status(200).cookie("accesstoken", accesstoken, option).cookie("refreshtoken", refreshtoken, option)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedinUser, accesstoken, refreshtoken
                },
                "User logged in Successfully"
            )
        )
})

const logoutuser = async_handler(async (req, res) => {
    // clear cookies 
    // and clear the refresh token from the user model saved in the dataabase 
    // we can get req user from the middlewere we inejcted in the route 

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshtokens: 1 // set undefined is not a subtle perfect response , 1 removes the field completely  
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
        .clearCookie("accesstoken", option)
        .clearCookie("refreshtoken", option).json(
            new ApiResponse(
                200,
                {},
                "user logged out"
            )
        )


})

const refresAccessToken = async_handler(async (req, res) => {
    // When the access token expires, we can generate a new access token by validating the refresh token from the cookie against the refresh token stored in the database.  

    // ask for the refresh token from the cookies 
    const incomingrefreshtoken = req.cookie.refreshtoken || req.body.refreshtoken

    if (!incomingrefreshtoken) {
        throw new ApiError(401, "unauthorized request")
    }


    try {
        // decoded token returns you the id that was previously used to create the token
        const decodedtoken = jwt.verify(incomingrefreshtoken
            , process.env.REFRESH_TOKEN_SECRET
        )

        // getting the user details from the database using the decoded token 
        const user = await User.findById(decodedtoken?._id)

        if (!user) {
            throw new ApiError(402, "invalid refresh token");
        }

        // validation 
        if (incomingrefreshtoken !== user?.refreshtokens) {
            throw new ApiError(402, "refresh token expired");
        }

        // generate new tokens 
        const option = {
            httpOnly: true,
            secure: true
        }

        const { accesstoken, newrefreshtoken } = await generateAccessandRefreshtoken(user?.id);

        // return response 
        return res.status(200)
            .cookie("accesstoken", accesstoken)
            .cookie("refreshtoken", newrefreshtoken)
            .json(
                new ApiResponse(
                    200, { accesstoken, newrefreshtoken }, "access token refreshed "
                )
            )
    } catch (error) {
        throw new ApiError(403, error?.message || "invalid refresh token")
    }
})

const changePassword = async_handler(async (req, res) => {
    // take these feilds from the user side 
    const { oldpassword, newpassword } = req.body;

    // now as user is logged in the middlewere auth is active so we can get req.user 
    const user = await User.findById(req.user?._id)

    // check for the old password
    const passwordvalidation = await user.isPasswordcorrect(oldpassword);

    if (!passwordvalidation) {
        throw new ApiError(404, "incorrect password")
    }

    // set the new password 
    user.password = newpassword;

    // save on the databases 
    await user.save({ validateBeforeSave: false });

    return res.status(200).json(
        new ApiResponse(
            200, {}, "password changed successfully"
        )
    )
})

const getcurrentuser = async_handler(async (req, res) => {
    return res.status(200).json(
        new ApiResponse(
            200, req.user, "user fetched successfully"
        )
    )
})

const updateaccountdetails = async_handler(async (req, res) => {
    const { fullname, email } = req.body;

    if (!fullname || !email) {
        throw new ApiError(407, "enter the empty fields")
    }

    // find the user ( always use await while using database)
    const user = await User.findByIdAndUpdate(req.user?._id,
        {
            $set:
            {
                fullname,
                email
            }
        },
        {
            new: true
        }
    ).select("-password"); // get the new user without password 

    return res.status(200).json(
        new ApiResponse(
            200, user,
            "details updates"
        )
    )
})

const updateuseravatar = async_handler(async (req, res) => {
    // storing the new avatar file on the local device
    const avatarlocal = req.file?.path;

    if (!avatarlocal) {
        throw new ApiError(409, "uplaod avatar image")
    }
    // uploading on the cloud it will return the object uploaded on cloud 
    const avatar = await Uploadoncloud(avatarlocal)

    if (!avatar.url) {
        throw new ApiError(410, "error while uploading new avatar on cloud")
    }

    const updateduser = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar: avatar.url
            }
        }, {
        new: true
    }
    ).select("-password")

    return res.status(200).json(
        new ApiResponse(
            200, updateduser, "avatar updated"
        )
    )
})

const updateusercover = async_handler(async (req, res) => {
    // storing the new avatar file on the local device
    const coverlocal = req.file?.path;

    if (!coverlocal) {
        throw new ApiError(409, "uplaod cover image")
    }
    // uploading on the cloud it will return the object uploaded on cloud 
    const cover = await Uploadoncloud(coverlocal)

    if (!cover.url) {
        throw new ApiError(410, "error while uploading new avatar on cloud")
    }

    const updateduser = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                coverimage: cover.url
            }
        }, {
        new: true
    }
    ).select("-password")

    return res.status(200).json(
        new ApiResponse(
            200, updateduser, "avatar updated"
        )
    )
})

const getuserchannelprofile = async_handler(async (req, res) => {
    const { username } = req.params // to get the username from the profile URL 

    if (!username) {
        throw new ApiError(400, "username not found")
    }

    const channel = await User.aggregate([
        {
            $match: {
                username: username?.toLowerCase()
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedto"
            }
        },
        {
            $addFields: {
                subscribercount: {
                    $size: "$subscribers"
                },
                channelsubscribedtocount: {
                    $size: "$subscribedto"
                },
                issubscribed: {
                    $cond: {
                        if: { $in: [req.user?._id, "$subscribers.subscriber"] },
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                fullname: 1,
                username: 1,
                subscribercount: 1,
                channelsubscribedtocount: 1,
                avatar: 1,
                coverimage: 1,
                email: 1,
                issubscribed: 1
            }
        }
    ])

    if (!channel?.length) {
        throw new ApiError(404, "Channel not found")
    }

    return res.status(200)
        .json(
            new ApiResponse(
                200, channel[0], "user channel fetched successfully"
            )
        )


})

const getwatchhistory = async_handler(async (req,res) => {
    // Note normally req,user._id return just the string part of the object id not the complete mongodb id but mongoose behind the scene helps you to get the entire mongoDB id 

    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id) // aggregate cant directly get the object id from mongoDB we would manually add mongoose to get the id 
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "watchhistory",
                foreignField: "_id",
                as: "watchhistoy",
                pipeline:[
                    {
                        $lookup: {
                            from:"users",
                            localField: "owner",
                            foreignField: "._id",
                            as: "owner",
                            pipeline: [
                                {
                                    username: 1,
                                    fullname: 1,
                                    avatar: 1
                                }
                            ]
                        }
                    },
                    {
                        $addFields: {
                            owner: {
                                $first: "#owner"   
                            }
                        }
                    }
                ]
            }
        }
    ])

    return res.status(200)
    .json(new ApiResponse(
        200,user[0].watchhistory,"Watch history fetched"
    ))
})

export {
    registerUser,
    loginuser, logoutuser,
    refresAccessToken, changePassword, getcurrentuser,
    updateaccountdetails, updateuseravatar, updateusercover,
    getuserchannelprofile, getwatchhistory
};
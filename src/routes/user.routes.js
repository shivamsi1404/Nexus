import { Router } from "express";
import { loginuser, logoutuser, registerUser,refresAccessToken, changePassword, getcurrentuser, updateaccountdetails, updateuseravatar, updateusercover, getuserchannelprofile, getwatchhistory } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import multer from "multer";

// we created the user route with express router 

// we can not handle files in JSON that we will recieve after registerUser thus we will use multer Middlewere just before using register 

// we injected middlewere 

const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverimage",
            maxCount: 1
        }
    ]),
    registerUser)

router.route("/login").post(loginuser)

// secured route 
router.route("/logout").post(verifyJWT,logoutuser)
router.route("/refresh-token").post(refresAccessToken)
router.route("/change_password").post(verifyJWT,changePassword)
router.route("/current_user").get(verifyJWT,getcurrentuser)
router.route("/update_details").patch(verifyJWT,updateaccountdetails)
router.route("/avatar").patch(verifyJWT,upload.single("avatar"),updateuseravatar)
router.route("/cover").patch(verifyJWT,upload.single("cover"),updateusercover)
router.route("/c/:username").get(verifyJWT,getuserchannelprofile)
router.route("/watch-history").get(verifyJWT,getwatchhistory)

export default router
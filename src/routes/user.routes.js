import { Router } from "express";
import { loginuser, logoutuser, registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

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


export default router
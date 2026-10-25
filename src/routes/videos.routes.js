import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { deletevideo, getallvideos, getvideobyid, publicstatus, updatethumbnail, updatevideodetails, uploadvideo } from "../controllers/video.controller.js";

const router = Router();

router.use(verifyJWT);

router.route("/uploadvideo").post(
    upload.fields([
        {
            name: "video",
            maxCount: 1
        },
        {
            name: "thumbnail",
            maxCount: 1
        }
    ]),uploadvideo
)

router.route("/getvideo/:videoid").get(getvideobyid);
router.route("/updatedetails/:videoid").patch(updatevideodetails);
router.route("/updatethumbnail/:videoid").patch(updatethumbnail);
router.route("/deletevideo/:videoid").patch(deletevideo);
router.route("/publicstatus/:videoid").get(publicstatus);
router.route("/getallvideos/:videoid").get(getallvideos);

export default router

// testing not done for controller 
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/multer.middleware";
import { deletevideo, getvideobyid, updatethumbnail, updatevideodetails, uploadvideo } from "../controllers/video.controller";

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

export default router
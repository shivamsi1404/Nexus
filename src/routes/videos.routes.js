import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/multer.middleware";
import { uploadvideo } from "../controllers/video.controller";

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

export default router
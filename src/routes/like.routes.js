import { Router } from 'express';
import {
    toggleVideoLike,
    togglecommentlike,
    toggletweetlike,
    getalllikedvideo
} from "../controllers/like.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/toggle/v/:videoid").post(toggleVideoLike);
router.route("/toggle/c/:commentid").post(togglecommentlike);
router.route("/toggle/t/:tweetid").post(toggletweetlike);
router.route("/videos").get(getalllikedvideo);

export default router
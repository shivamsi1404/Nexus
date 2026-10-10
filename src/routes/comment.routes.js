import { Router } from 'express';
import {
createcomment,updatecomment,deletecomment,getvideocomments
} from "../controllers/comment.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/:videoId").get(getvideocomments).post(createcomment);
router.route("/c/:commentId").delete(deletecomment).patch(updatecomment);

export default router
import { Router } from 'express';
import {
    createtweet,updatetweet,deletetweet,getusertweet
} from "../controllers/tweet.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/").post(createtweet);
router.route("/user/:userId").get(getusertweet);
router.route("/:tweetId").patch(updatetweet).delete(deletetweet);

export default router
import { Router } from 'express';
import {
    createplaylist,deleteplaylist,updateplaylist,getallplaylistofuser,playlistbyid,addvideotoplaylist,removevideofromplaylist
} from "../controllers/playlist.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/").post(createplaylist)

router
    .route("/:playlistid")
    .get(playlistbyid)
    .patch(updateplaylist)
    .delete(deleteplaylist);

router.route("/add/:videoid/:playlistid").patch(addvideotoplaylist);
router.route("/remove/:videoid/:playlistid").patch(removevideofromplaylist);

router.route("/user/:userid").get(getallplaylistofuser);

export default router
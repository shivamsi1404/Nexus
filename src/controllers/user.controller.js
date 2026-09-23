import { async_handler } from "../utils/asynchandler.js";

const registerUser = async_handler( async (req,res) => {
    res.status(200).json({
        message: "ok"
    })
})

export {registerUser};
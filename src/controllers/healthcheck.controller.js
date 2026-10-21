import { async_handler } from "../utils/asynchandler";
import { ApiResponse } from "../utils/apiresponse.js";

const healthcheck = async_handler(async (req, res) => {
    return res.status(200).json(
        new ApiResponse(200, {}, "Server is healthy")
    );
});

export {
    healthcheck
};

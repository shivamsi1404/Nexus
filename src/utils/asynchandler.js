// Wrapper for handling async route errors
const async_handler = (fn) => async (req, res, next) => {

    try {
        // Execute the async function
        await fn(req, res, next);

    } catch (error) {

        console.log(error);
        // Send error response
        res.status(error.statuscode || 500).json({
            success: false,
            massage: error.massage
        });
    }
}

// Export the async handler
export { async_handler };
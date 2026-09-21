// Wrapper for handling async route errors
const asyn_handler = (fn) => async (req, res, next) => {

    try {
        // Execute the async function
        await fn(req, res, next);

    } catch (error) {

        // Send error response
        res.status(error.code || 500).json({
            success: false,
            massage: error.massage
        });
    }
}

// Export the async handler
export { asyn_handler };
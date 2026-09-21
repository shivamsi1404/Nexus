// Custom error class for handling API errors
// Extends JavaScript's built-in Error class
class ApiError extends Error {

    constructor(
        statuscode,
        message = "Something went wrong",
        error = [],
        stack = ""
    ) {

        // Call the parent Error constructor with the error message
        super(message);

        // Store the HTTP status code of the error
        this.statuscode = statuscode;

        // Data field is kept null for error responses
        this.data = null;

        // Store the error message
        this.message = message;

        // Indicates that the API request was not successful
        this.success = false;

        // Store additional error details, if any
        this.errors = error;

        // Use the provided stack trace if available
        if (stack) {
            this.stack = stack;
        }

        // Otherwise, automatically generate a stack trace
        else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

// Export ApiError so it can be used in other files
export { ApiError };
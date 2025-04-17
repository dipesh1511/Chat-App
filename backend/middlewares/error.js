/**
 * Error handling middleware for the application.
 * This middleware captures errors and sends a structured response.
 */

const errorMiddleware = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    return res.status(statusCode).json({
        success: false,
        message,
    });
};

const TryCatch = (passedFunc) => async (req, res, next) => {
    try {
        await passedFunc(req, res, next);
    } catch (error) {
        next(error);
    }
}

export {errorMiddleware,TryCatch}
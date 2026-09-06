/**
 * Global error-handling middleware.
 * Catches all unhandled errors and returns a safe JSON response.
 * Never exposes internal error details in production.
 */
const errorHandler = (err, req, res, _next) => {
    console.error(`[ERROR] ${req.method} ${req.originalUrl}:`, err.message);

    // Mongoose validation error
    if (err.name === "ValidationError") {
        const messages = Object.values(err.errors).map((e) => e.message);
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: messages,
        });
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue).join(", ");
        return res.status(409).json({
            success: false,
            message: `Duplicate value for: ${field}`,
        });
    }

    // Mongoose cast error (e.g., invalid ObjectId)
    if (err.name === "CastError") {
        return res.status(400).json({
            success: false,
            message: `Invalid value for ${err.path}: ${err.value}`,
        });
    }

    // Default: Internal server error
    const statusCode = err.statusCode || 500;
    const message =
        process.env.NODE_ENV === "production"
            ? "Internal server error"
            : err.message;

    res.status(statusCode).json({
        success: false,
        message,
    });
};

module.exports = errorHandler;

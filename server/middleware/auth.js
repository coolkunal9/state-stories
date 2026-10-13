const jwt = require("jsonwebtoken");

const INSECURE_DEFAULT = "state-stories-dev-secret-change-me";

// Fail-fast: if JWT_SECRET is missing or is the insecure default in production,
// crash loudly at startup rather than silently signing tokens anyone can forge.
// In development the fallback is acceptable for local testing only.
if (process.env.NODE_ENV === "production") {
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET === INSECURE_DEFAULT) {
        console.warn(
            "[SECURITY WARNING] JWT_SECRET environment variable is not set or uses the insecure default. " +
            "Please configure a strong random secret in your production environment variables."
        );
    }
}

const JWT_SECRET = process.env.JWT_SECRET || INSECURE_DEFAULT;

/**
 * Middleware: Verifies JWT token from Authorization header.
 * Attaches decoded user payload to req.user on success.
 */
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Access denied. No token provided.",
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token.",
        });
    }
};

/**
 * Middleware: Restricts access to users with the "admin" role.
 * Must be used after authenticate middleware.
 */
const authorizeAdmin = (req, res, next) => {
    if (req.user?.role !== "admin") {
        return res.status(403).json({
            success: false,
            message: "Access denied. Admin privileges required.",
        });
    }
    next();
};

module.exports = { authenticate, authorizeAdmin, JWT_SECRET };

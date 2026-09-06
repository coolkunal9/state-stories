const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "state-stories-dev-secret-change-me";

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

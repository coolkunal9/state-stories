const express = require("express");
const router = express.Router();
const authService = require("../services/authService");
const { validate, registerSchema, loginSchema } = require("../middleware/validate");

/**
 * POST /api/auth/register
 * Public route to register a new user
 */
router.post("/register", validate(registerSchema), async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const result = await authService.register({ username, email, password });
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            ...result,
        });
    } catch (err) {
        next(err); // Central global error handler catches and formats this!
    }
});

/**
 * POST /api/auth/login
 * Public route to log in an existing user
 */
router.post("/login", validate(loginSchema), async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const result = await authService.login({ email, password });
        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            ...result,
        });
    } catch (err) {
        next(err);
    }
});

const { authenticate } = require("../middleware/auth");

/**
 * GET /api/auth/me
 * Protected route to fetch the currently authenticated user's profile
 */
router.get("/me", authenticate, async (req, res, next) => {
    try {
        const user = await authService.getUserProfile(req.user.id);
        res.status(200).json({
            success: true,
            user,
        });
    } catch (err) {
        next(err);
    }
});

/**
 * GET /api/auth/my-comments
 * Protected route to fetch comments created by the authenticated user
 */
router.get("/my-comments", authenticate, async (req, res, next) => {
    try {
        const comments = await authService.getUserComments(req.user.id);
        res.status(200).json({
            success: true,
            comments,
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;

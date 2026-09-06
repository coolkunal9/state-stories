const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { JWT_SECRET } = require("../middleware/auth");

const TOKEN_EXPIRY = "7d";

/**
 * Register a new user.
 * Returns the created user (without password) and a JWT token.
 */
const register = async ({ username, email, password }) => {
    // Check for existing user
    const existingUser = await User.findOne({
        $or: [{ email }, { username }],
    });

    if (existingUser) {
        const field =
            existingUser.email === email ? "email" : "username";

        const err = new Error(
            `A user with that ${field} already exists`
        );

        err.statusCode = 409;
        throw err;
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
        username,
        email,
        password: hashedPassword,
    });

    // Create JWT token
    const token = jwt.sign(
        {
            id: user._id,
            username: user.username,
            role: user.role,
        },
        JWT_SECRET,
        {
            expiresIn: TOKEN_EXPIRY,
        }
    );

    return {
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
        },
        token,
    };
};


/**
 * Login an existing user.
 * Returns the user (without password) and a JWT token.
 */
const login = async ({ email, password }) => {
    // Find user
    const user = await User.findOne({ email });

    if (!user) {
        const err = new Error("Invalid email or password");
        err.statusCode = 401;
        throw err;
    }

    // Compare password
    const isMatch = await bcrypt.compare(
        password,
        user.password
    );

    if (!isMatch) {
        const err = new Error("Invalid email or password");
        err.statusCode = 401;
        throw err;
    }

    // Create JWT token
    const token = jwt.sign(
        {
            id: user._id,
            username: user.username,
            role: user.role,
        },
        JWT_SECRET,
        {
            expiresIn: TOKEN_EXPIRY,
        }
    );

    return {
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
        },
        token,
    };
};


/**
 * Get profile data for the authenticated user.
 * Password is excluded.
 */
const getUserProfile = async (userId) => {
    const user = await User.findById(userId)
        .select("-password")
        .lean();

    if (!user) {
        const err = new Error("User not found");
        err.statusCode = 404;
        throw err;
    }

    return {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
    };
};


/**
 * Get all comments created by a specific user.
 */
const getUserComments = async (userId) => {
    const Comment = require("../models/Comment");

    const comments = await Comment.find({
        user: userId,
    })
        .sort({
            createdAt: -1,
        })
        .populate(
            "article",
            "title name state"
        )
        .lean();

    return comments.map((comment) => ({
        id: comment._id,
        text: comment.text,
        username: comment.username,
        createdAt: comment.createdAt,
        article: comment.article,
    }));
};


module.exports = {
    register,
    login,
    getUserProfile,
    getUserComments,
};
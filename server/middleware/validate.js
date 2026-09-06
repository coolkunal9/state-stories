const Joi = require("joi");

/**
 * Creates an Express middleware that validates req.body against a Joi schema.
 * Returns 400 with a clear error message on validation failure.
 */
const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        const messages = error.details.map((d) => d.message);
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: messages,
        });
    }
    next();
};

// ── Schemas ──

const commentSchema = Joi.object({
    text: Joi.string().trim().min(1).max(2000).required().messages({
        "string.empty": "Comment text is required",
        "string.max": "Comment cannot exceed 2000 characters",
    }),
});

const registerSchema = Joi.object({
    username: Joi.string().trim().min(3).max(30).required().messages({
        "string.min": "Username must be at least 3 characters",
        "string.max": "Username cannot exceed 30 characters",
        "string.empty": "Username is required",
    }),
    email: Joi.string().email().trim().required().messages({
        "string.email": "Please provide a valid email",
        "string.empty": "Email is required",
    }),
    password: Joi.string().min(6).max(128).required().messages({
        "string.min": "Password must be at least 6 characters",
        "string.empty": "Password is required",
    }),
});

const loginSchema = Joi.object({
    email: Joi.string().email().trim().required().messages({
        "string.email": "Please provide a valid email",
        "string.empty": "Email is required",
    }),
    password: Joi.string().required().messages({
        "string.empty": "Password is required",
    }),
});

module.exports = {
    validate,
    commentSchema,
    registerSchema,
    loginSchema,
};

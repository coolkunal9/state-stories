const mongoose = require("mongoose");

const ArticleSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "URL slug is required"],
            unique: true,
            trim: true,
            lowercase: true,
        },
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
            maxlength: [200, "Title cannot exceed 200 characters"],
        },
        image: {
            type: String,
            required: [true, "Primary image URL is required"],
        },
        image2: {
            type: String,
            default: null,
        },
        content: {
            type: String,
            required: [true, "Article content is required"],
        },
        state: {
            type: String,
            required: [true, "State name is required"],
            trim: true,
            index: true,
        },
        sourceLink: {
            type: String,
            default: null,
        },
        // Keeping embedded comments for backward compatibility during migration.
        // New comments should be stored in the separate Comment collection.
        comments: [
            {
                username: String,
                text: String,
                createdAt: { type: Date, default: Date.now },
            },
        ],
    },
    { timestamps: true }
);

// Text index for server-side search across title, state, and content
ArticleSchema.index({ title: "text", state: "text", content: "text" });

module.exports = mongoose.model("Article", ArticleSchema);
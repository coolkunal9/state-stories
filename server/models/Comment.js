const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
    {
        article: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Article",
            required: [true, "Article reference is required"],
            index: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User reference is required"],
        },
        username: {
            type: String,
            required: [true, "Username is required"],
            trim: true,
            maxlength: [50, "Username cannot exceed 50 characters"],
        },
        text: {
            type: String,
            required: [true, "Comment text is required"],
            trim: true,
            maxlength: [2000, "Comment cannot exceed 2000 characters"],
        },
    },
    { timestamps: true }
);

// Compound index for fetching comments by article, sorted by newest
CommentSchema.index({ article: 1, createdAt: -1 });

module.exports = mongoose.model("Comment", CommentSchema);

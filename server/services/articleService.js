const Article = require("../models/Article");
const Comment = require("../models/Comment");

/**
 * Get all articles with optional pagination, state filtering, and search query.
 */
const getArticles = async ({ page = 1, limit = 12, state, search } = {}) => {
    const filter = {};
    if (state) {
        filter.state = { $regex: new RegExp(`^${state}$`, "i") };
    }

    if (search && search.trim().length >= 2) {
        const term = search.trim();
        // Use MongoDB native $text index search across title, state, and content
        filter.$text = { $search: term };
    }

    const skip = (page - 1) * limit;

    const [articles, total] = await Promise.all([
        Article.find(filter)
            .select("-comments") // Exclude embedded comments from list view
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        Article.countDocuments(filter),
    ]);

    return {
        articles,
        pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            pages: Math.ceil(total / limit),
        },
    };
};

/**
 * Get a single article by its URL slug (name).
 */
const getArticleByName = async (name) => {
    const article = await Article.findOne({ name }).lean();
    if (!article) return null;

    // Fetch comments from the separate collection
    const comments = await Comment.find({ article: article._id })
        .sort({ createdAt: -1 })
        .lean();

    return { ...article, comments };
};

/**
 * Basic helper to sanitize string input by escaping HTML tags (XSS protection)
 */
const escapeHTML = (str) => {
    if (typeof str !== "string") return str;
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#x27;")
        .replace(/\//g, "&#x2F;");
};

/**
 * Add a comment to an article (stored in the separate Comment collection).
 */
const addComment = async (articleName, { userId, username, text }) => {
    const article = await Article.findOne({ name: articleName });
    if (!article) return null;

    // Sanitize user inputs to prevent Stored XSS attacks
    const sanitizedUsername = escapeHTML(username);
    const sanitizedText = escapeHTML(text);

    const comment = await Comment.create({
        article: article._id,
        user: userId,
        username: sanitizedUsername,
        text: sanitizedText,
    });

    return comment;
};

/**
 * Get comments for an article with pagination.
 */
const getComments = async (articleName, { page = 1, limit = 20 } = {}) => {
    const article = await Article.findOne({ name: articleName })
        .select("_id")
        .lean();
    if (!article) return null;

    const skip = (page - 1) * limit;

    const [comments, total] = await Promise.all([
        Comment.find({ article: article._id })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        Comment.countDocuments({ article: article._id }),
    ]);

    return {
        comments,
        pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            pages: Math.ceil(total / limit),
        },
    };
};

module.exports = {
    getArticles,
    getArticleByName,
    addComment,
    getComments,
};

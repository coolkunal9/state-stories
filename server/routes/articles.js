const express = require("express");
const router = express.Router();
const articleService = require("../services/articleService");
const { validate, commentSchema } = require("../middleware/validate");
const { authenticate } = require("../middleware/auth");

// GET /api/articles - Fetch all articles (supports optional query parameters: page, limit, state, search)
router.get("/", async (req, res, next) => {
    try {
        const { page, limit, state, search } = req.query;
        const result = await articleService.getArticles({ page, limit, state, search });
        res.json(result);
    } catch (err) {
        next(err);
    }
});

// GET /api/articles/:name - Fetch a single article by its URL name slug
router.get("/:name", async (req, res, next) => {
    try {
        const article = await articleService.getArticleByName(req.params.name);
        if (!article) {
            return res.status(404).json({ success: false, message: "Article not found" });
        }
        res.json(article);
    } catch (err) {
        next(err);
    }
});

// POST /api/articles/:name/comments - Add a new comment to an article (Requires JWT Authentication)
router.post("/:name/comments", authenticate, validate(commentSchema), async (req, res, next) => {
    try {
        const { text } = req.body;
        const userId = req.user.id;
        const username = req.user.username;

        const comment = await articleService.addComment(req.params.name, { userId, username, text });
        
        if (!comment) {
            return res.status(404).json({ success: false, message: "Article not found" });
        }

        res.status(201).json({
            success: true,
            message: "Comment added successfully",
            comment,
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;

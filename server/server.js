// Load server/.env regardless of cwd (npm start runs from project root)
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const articleRoutes = require("./routes/articles");
const authRoutes = require("./routes/auth");
const errorHandler = require("./middleware/errorHandler");
const { connectDB, isDbConnected } = require("./db");

const app = express();

// Secure backend HTTP headers using helmet
app.use(helmet());

// Limit requests to prevent rate limit vulnerabilities (spam/DoS)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many requests from this IP, please try again after 15 minutes."
    }
});
app.use("/api/", limiter);

// CORS — set CLIENT_URL to your live frontend (e.g. https://your-app.vercel.app)
const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    process.env.CLIENT_URL,
    process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);

        if (process.env.NODE_ENV !== "production" && origin.startsWith("http://localhost")) {
            return callback(null, true);
        }

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        // Vercel preview/production frontends (*.vercel.app)
        if (process.env.NODE_ENV === "production" && /\.vercel\.app$/i.test(origin)) {
            return callback(null, true);
        }

        const msg = "CORS blocked for origin: " + origin;
        return callback(new Error(msg), false);
    },
    credentials: true,
}));

app.use(express.json());

// Ensure DB is connected (critical on Vercel serverless cold starts)
const requireDatabase = async (req, res, next) => {
    try {
        if (!isDbConnected()) {
            await connectDB();
        }
        next();
    } catch {
        return res.status(503).json({
            success: false,
            message:
                "Database unavailable. Check MONGO_URI and MongoDB Atlas network access (allow 0.0.0.0/0).",
        });
    }
};

// Warm connection locally; serverless connects on first request via requireDatabase
if (process.env.NODE_ENV !== "production") {
    connectDB().catch(() => {
        setTimeout(() => connectDB().catch(() => {}), 5000);
    });
}

// Health check (no DB required) — use for debugging frontend ↔ API connectivity
app.get("/api/health", async (req, res) => {
    let database = "disconnected";
    try {
        await connectDB();
        database = isDbConnected() ? "connected" : "disconnected";
    } catch {
        database = "error";
    }
    res.json({
        ok: database === "connected",
        database,
        env: process.env.NODE_ENV || "development",
    });
});

// API Routes
app.use("/api/articles", requireDatabase, articleRoutes);
app.use("/api/auth", requireDatabase, authRoutes);

app.get("/", (req, res) => {
    res.send("State Stories of India API is running smoothly with security features.");
});

// Centralized Error-Handling Middleware (Must be registered last!)
app.use(errorHandler);

// Run the local development server if not running on serverless environments like Vercel
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
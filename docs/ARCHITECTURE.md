# State Stories — Architectural Guide & System Design

## 1. High-Level Architecture Overview

State Stories is an end-to-end full-stack MERN (MongoDB, Express, React, Node.js) web application designed for regional storytelling across Indian states. The system is architected as a decoupled client-server application optimized for serverless edge deployment on Vercel and scalable document storage on MongoDB Atlas.

```
┌───────────────────────────────────────────────────────────┐
│                    Client (React SPA)                     │
│  - React 18, React Router v7                              │
│  - Tailwind CSS + Framer Motion                           │
│  - AuthContext (JWT State & Session Persistence)          │
│  - Custom API client with AbortController & Auth Headers  │
└──────────────┬────────────────────────────▲───────────────┘
               │ HTTP Requests (JSON)       │ JSON Responses
               ▼                            │
┌───────────────────────────────────────────────────────────┐
│                 Express API Server / Function             │
│  - Entry: server.js (Express 5 app)                       │
│  - Security Pipeline: Helmet, CORS allowlist, Rate Limit  │
│  - DB Gateway: requireDatabase + Cached Mongoose Client   │
│  - Router & Controllers: routes/auth.js, routes/articles  │
│  - Middleware: Joi Validation, JWT Auth, Error Handler    │
│  - Business Layer: authService.js, articleService.js      │
└──────────────┬────────────────────────────▲───────────────┘
               │ Mongoose ODM queries       │ BSON documents
               ▼                            │
┌───────────────────────────────────────────────────────────┐
│                    MongoDB Atlas                          │
│  - Collections: Users, Articles, Comments                 │
│  - Indexes: Unique constraints, Text index ($text)        │
│  - Compound Indexes: { article: 1, createdAt: -1 }        │
└───────────────────────────────────────────────────────────┘
```

---

## 2. Request Lifecycle & Execution Trace

When a user interacts with the application (e.g., submitting a comment on an article), the request travels through a deterministic sequence across client, network, server, and database layers:

```
[Browser Action: Submit Comment]
  │
  ├─ 1. Form Validation in React (length, non-empty)
  ├─ 2. Client API Service (`client/src/services/api.js`)
  │     └─ Appends Authorization: Bearer <token> from localStorage
  ├─ 3. Network Transport (TLS / HTTPS)
  │
[Express Server Pipeline]
  │
  ├─ 4. Helmet: Attaches 11 HTTP security headers (CSP, HSTS, X-Content-Type, etc.)
  ├─ 5. CORS Check: Validates Origin against strict allowlist (Localhost & production domains)
  ├─ 6. Rate Limiting: Verifies IP quota via `express-rate-limit`
  ├─ 7. Body Parsing: `express.json()` parses payload (capped at 100kb)
  ├─ 8. DB Connection Check: `requireDatabase` middleware ensures active Mongoose connection
  ├─ 9. Routing: Matches `POST /api/articles/:name/comments`
  ├─ 10. Authentication Middleware (`middleware/auth.js`):
  │      ├─ Extracts Bearer token
  │      ├─ Verifies signature with `jwt.verify(token, JWT_SECRET)`
  │      └─ Attaches payload `req.user = { id, role }` to request object
  ├─ 11. Validation Middleware (`middleware/validate.js`):
  │      └─ Validates payload against `commentSchema` via Joi
  ├─ 12. Service Layer (`services/articleService.js`):
  │      ├─ Queries Article by slug (`name`)
  │      ├─ Sanitizes text via `escapeHTML`
  │      └─ Creates Comment document referencing Article._id and User._id
  ├─ 13. Persistence: Writes to MongoDB `comments` collection
  │
[Response Cycle]
  │
  ├─ 14. Server responds with HTTP 201 Created and JSON payload
  ├─ 15. Client receives response, updates React state optimistically
  └─ 16. UI re-renders comment in `CommentsList` without full page reload
```

---

## 3. Directory Structure & Layer Responsibilities

The codebase enforces strict separation of concerns across presentation, routing, validation, domain logic, and data access.

```
state-stories/
├── client/                     # Frontend Single Page Application
│   ├── public/                 # Static assets (favicons, manifest, article images)
│   ├── src/
│   │   ├── components/         # Reusable structural components (Navbar, Footer, AuthModal)
│   │   │   └── ui/             # Atomic design components (Button, ArticleCard, Spinner, etc.)
│   │   ├── config/             # Environment & API configuration
│   │   ├── context/            # React Contexts (AuthContext for user state)
│   │   ├── hooks/              # Custom hooks (e.g., useDebounce)
│   │   ├── pages/              # Routed view containers (Home, Article, ArticlesList, Search, Profile)
│   │   ├── services/           # HTTP API client and abstraction methods
│   │   └── utils/              # Helper utilities (readTime estimation, formatting)
│   └── vercel.json             # Frontend routing & SPA fallback configuration
│
├── server/                     # Backend REST API Server
│   ├── middleware/             # Express middlewares (auth, validation, error handler)
│   ├── models/                 # Mongoose Schemas & Model Definitions (User, Article, Comment)
│   ├── routes/                 # Express Router endpoint definitions
│   ├── services/               # Pure business logic and database queries
│   ├── db.js                   # Mongoose connection pooling & serverless caching
│   ├── seed.js                 # Idempotent database seeding script
│   ├── server.js               # Express application setup & middleware stack
│   └── vercel.json             # Serverless function routing for Vercel backend
└── docs/                       # Engineering & Architectural Documentation
```

### Layer Responsibilities & Rules
1. **Routes (`server/routes/`)**: Responsible ONLY for routing HTTP requests, invoking middleware, calling service methods, and mapping service output to HTTP status codes. No database calls or business rules belong in route handlers.
2. **Services (`server/services/`)**: Pure business logic. Services take plain parameters, interact with Mongoose models, enforce business constraints, and throw domain errors. They do not touch `req` or `res` objects.
3. **Models (`server/models/`)**: Define document schemas, data types, indexes, and schema-level validations.
4. **Middleware (`server/middleware/`)**: Cross-cutting concerns such as token verification, request payload validation, and centralized exception handling.

---

## 4. Serverless Adaptations for Vercel

Unlike traditional monolithic servers that run continuously on a virtual machine, Vercel hosts Express applications as ephemeral **Serverless Functions**:

### Connection Re-use (Connection Pooling)
In a serverless environment, functions spin up on-demand and freeze or terminate after execution. Establishing a new MongoDB connection on every HTTP request adds 200–500ms of latency (SSL handshake, authentication).

`server/db.js` solves this with global connection caching:
```javascript
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
    if (cached.conn) {
        return cached.conn; // Re-use active connection across invocations
    }
    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, {
            bufferCommands: false, // Fail fast if connection drops
        }).then((mongoose) => mongoose);
    }
    cached.conn = await cached.promise;
    return cached.conn;
};
```

### Server Export vs. `app.listen()`
In local development, Express starts an active TCP listener with `app.listen(PORT)`. In Vercel serverless execution, the Express instance is exported directly as a request listener handler (`module.exports = app`).
```javascript
if (process.env.NODE_ENV !== "production") {
    app.listen(PORT, () => {
        console.log(`Server running locally on port ${PORT}`);
    });
}

module.exports = app;
```

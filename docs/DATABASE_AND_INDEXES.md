# State Stories — Database Schema & Indexing Guide

## 1. Entity Relationship & Schema Design

State Stories persists application data across three core collections in MongoDB Atlas: `users`, `articles`, and `comments`.

```
┌───────────────────────────────────────┐
│                 User                  │
├───────────────────────────────────────┤
│ _id: ObjectId                         │
│ username: String (unique)             │
│ email: String (unique, lowercase)     │
│ password: String (bcrypt hash)        │
│ role: String ('user' | 'admin')       │
│ createdAt: Date                       │
│ updatedAt: Date                       │
└──────────────────┬────────────────────┘
                   │ 1
                   │
                   │ *
┌──────────────────▼────────────────────┐         ┌───────────────────────────────────────┐
│               Comment                 │         │                Article                │
├───────────────────────────────────────┤         ├───────────────────────────────────────┤
│ _id: ObjectId                         │         │ _id: ObjectId                         │
│ article: ObjectId (ref: 'Article') ───┼────────>│ name: String (unique slug, e.g. 'goa')│
│ user: ObjectId (ref: 'User')          │         │ title: String                         │
│ username: String (denormalized snapshot)│       │ image: String (URL / path)            │
│ text: String (sanitized)              │         │ image2: String (optional)             │
│ createdAt: Date                       │         │ content: [String] (paragraph blocks)  │
│ updatedAt: Date                       │         │ state: String                         │
└───────────────────────────────────────┘         │ sourceLink: String                    │
                                                  │ comments: [Legacy Array]              │
                                                  │ createdAt: Date                       │
                                                  │ updatedAt: Date                       │
                                                  └───────────────────────────────────────┘
```

---

## 2. Schema Definitions

### User Schema (`server/models/User.js`)
```javascript
const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            minlength: 3,
            maxlength: 30,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
    },
    { timestamps: true }
);

userSchema.index({ email: 1 });
```

### Article Schema (`server/models/Article.js`)
```javascript
const articleSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        image: {
            type: String,
            required: true,
        },
        image2: {
            type: String,
            default: "",
        },
        content: {
            type: [String],
            required: true,
        },
        state: {
            type: String,
            required: true,
            trim: true,
        },
        sourceLink: {
            type: String,
            default: "",
        },
        // Legacy embedded comments array preserved for backward compatibility
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

// Indexes
articleSchema.index({ state: 1 });
articleSchema.index({ title: "text", state: "text", content: "text" });
```

### Comment Schema (`server/models/Comment.js`)
```javascript
const commentSchema = new mongoose.Schema(
    {
        article: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Article",
            required: true,
            index: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        username: {
            type: String,
            required: true,
            trim: true,
        },
        text: {
            type: String,
            required: true,
            trim: true,
            maxlength: 1000,
        },
    },
    { timestamps: true }
);

// Compound index for high-throughput article comment queries
commentSchema.index({ article: 1, createdAt: -1 });
```

---

## 3. Database Indexes & Query Optimization

| Collection | Index Fields | Type | Purpose | Query Optimization |
|---|---|---|---|---|
| `users` | `{ email: 1 }` | Single field / Unique | Login & registration lookup | Transforms `O(N)` scan into `O(log N)` B-tree lookup for user authentication |
| `users` | `{ username: 1 }` | Unique constraint | Username uniqueness validation | Prevents duplicate usernames across registrations |
| `articles` | `{ name: 1 }` | Unique constraint | Slug-based retrieval | Instant article fetching by route slug (`/articles/kerala`) |
| `articles` | `{ state: 1 }` | Single field | State filtering | Accelerates regional queries (`?state=Rajasthan`) |
| `articles` | `{ title: "text", state: "text", content: "text" }` | Text Index (`$text`) | Full-text keyword search | Powers global search bar across titles, states, and paragraph bodies |
| `comments` | `{ article: 1, createdAt: -1 }` | Compound index | Article comment feed | Fast retrieval and reverse-chronological sorting without in-memory sort |

---

## 4. Idempotent Seeding Architecture

The seed script (`server/seed.js`) populates 10 comprehensive state stories. To avoid destroying production data, the script uses **idempotent upserts (`bulkWrite`)**:

```javascript
const seed = async () => {
    const isProduction = process.env.NODE_ENV === "production";
    const forceRun = process.argv.includes("--force");

    if (isProduction && !forceRun) {
        console.error(
            "Refusing to run seed in production without --force flag."
        );
        process.exit(1);
    }

    // Idempotent upsert operations
    const operations = articles.map((art) => ({
        updateOne: {
            filter: { name: art.name },
            update: { $set: art },
            upsert: true,
        },
    }));

    const result = await Article.bulkWrite(operations);
    console.log(`Seeding complete: ${result.upsertedCount} inserted, ${result.modifiedCount} updated.`);
};
```

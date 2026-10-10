# State Stories — Testing Strategy & Quality Assurance

## 1. Testing Pyramid Overview

To transition State Stories to enterprise readiness, testing should span three primary tiers:

```
        / \
       /   \       End-to-End Tests (Playwright / Cypress)
      / E2E \      Critical User Flows: Auth -> Read Article -> Post Comment
     /───────\
    /         \     Integration Tests (Jest + Supertest + MongoMemoryServer)
   / Integrat. \    API routes, Joi schemas, Mongoose models, Rate limiting
  /─────────────\
 /               \   Unit Tests (Jest / React Testing Library)
/    Unit Tests   \  AuthContext, useDebounce, readTime calculation, Button/Card UI
───────────────────
```

---

## 2. API Integration Testing Setup (Supertest + Jest)

Backend integration tests verify that HTTP endpoints, authentication middleware, validation schemas, and database operations function cohesively without needing an external database.

### Recommended Test Stack:
- **Test Runner:** `jest`
- **HTTP Assertions:** `supertest`
- **In-Memory Database:** `mongodb-memory-server`

### Sample Integration Test: Authentication & Comments (`server/tests/api.test.js`)
```javascript
const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../server");
const Article = require("../models/Article");
const User = require("../models/User");

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

beforeEach(async () => {
    await User.deleteMany({});
    await Article.deleteMany({});
});

describe("Auth API", () => {
    it("should successfully register a new user and return JWT", async () => {
        const res = await request(app)
            .post("/api/auth/register")
            .send({
                username: "testuser",
                email: "test@example.com",
                password: "Password123!",
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body.success).toBe(true);
        expect(res.body.token).toBeDefined();
        expect(res.body.user.email).toEqual("test@example.com");
    });

    it("should reject duplicate registrations with 409 Conflict", async () => {
        await request(app)
            .post("/api/auth/register")
            .send({
                username: "duplicate",
                email: "dup@example.com",
                password: "Password123!",
            });

        const res = await request(app)
            .post("/api/auth/register")
            .send({
                username: "duplicate",
                email: "dup@example.com",
                password: "Password123!",
            });

        expect(res.statusCode).toEqual(409);
        expect(res.body.success).toBe(false);
    });
});

describe("Articles & Comments API", () => {
    it("should allow an authenticated user to post a comment", async () => {
        // 1. Create Article
        await Article.create({
            name: "goa",
            title: "Goa: Beyond the Beaches",
            image: "/images/goa.jpg",
            content: ["Sample paragraph."],
            state: "Goa",
        });

        // 2. Register User & Obtain Token
        const authRes = await request(app)
            .post("/api/auth/register")
            .send({
                username: "goa_fan",
                email: "goa@example.com",
                password: "Password123!",
            });

        const token = authRes.body.token;

        // 3. Post Comment
        const commentRes = await request(app)
            .post("/api/articles/goa/comments")
            .set("Authorization", `Bearer ${token}`)
            .send({
                text: "Loved the spice plantation history!",
            });

        expect(commentRes.statusCode).toEqual(201);
        expect(commentRes.body.comment.text).toEqual("Loved the spice plantation history!");
    });
});
```

---

## 3. Frontend Unit Testing (React Testing Library)

Frontend unit tests verify isolated components, custom hooks, and utility functions:

### Sample Hook Test (`client/src/hooks/useDebounce.test.js`)
```javascript
import { renderHook, act } from "@testing-library/react";
import { useDebounce } from "./useDebounce";

describe("useDebounce Hook", () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it("should return initial value immediately and update only after delay", () => {
        const { result, rerender } = renderHook(({ val }) => useDebounce(val, 300), {
            initialProps: { val: "initial" },
        });

        expect(result.current).toBe("initial");

        rerender({ val: "updated" });
        expect(result.current).toBe("initial");

        act(() => {
            jest.advanceTimersByTime(300);
        });

        expect(result.current).toBe("updated");
    });
});
```

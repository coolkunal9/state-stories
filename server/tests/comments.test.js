const request = require("supertest");
const app = require("../server");
const Article = require("../models/Article");
const User = require("../models/User");
const Comment = require("../models/Comment");

describe("Comments API (/api/articles/:name/comments & /api/auth/my-comments)", () => {
  let userToken;
  let user;

  beforeEach(async () => {
    await Article.deleteMany({});
    await User.deleteMany({});
    await Comment.deleteMany({});

    // Create test article
    await Article.create({
      name: "punjab",
      title: "Punjab: Land of Five Rivers",
      image: "/images/punjab.jpg",
      content: "Rich agricultural heritage and vibrant music.",
      state: "Punjab",
    });

    // Register test user
    const regRes = await request(app)
      .post("/api/auth/register")
      .send({
        username: "gurpreet",
        email: "gurpreet@example.com",
        password: "Password123!",
      });

    userToken = regRes.body.token;
    user = regRes.body.user;
  });

  describe("POST /api/articles/:name/comments", () => {
    it("should allow an authenticated user to post a comment", async () => {
      const res = await request(app)
        .post("/api/articles/punjab/comments")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          text: "The Golden Temple in Amritsar is breathtaking!",
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.comment).toBeDefined();
      expect(res.body.comment.text).toBe("The Golden Temple in Amritsar is breathtaking!");
      expect(res.body.comment.username).toBe("gurpreet");
    });

    it("should reject unauthenticated comment attempts with 401", async () => {
      const res = await request(app)
        .post("/api/articles/punjab/comments")
        .send({
          text: "Anonymous comment attempt",
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it("should return 400 Bad Request when comment text is empty", async () => {
      const res = await request(app)
        .post("/api/articles/punjab/comments")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          text: "",
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe("GET /api/auth/my-comments", () => {
    it("should return the authenticated user's comment history", async () => {
      // Post a comment first
      await request(app)
        .post("/api/articles/punjab/comments")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          text: "Loved visiting the mustard fields!",
        });

      const res = await request(app)
        .get("/api/auth/my-comments")
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.comments)).toBe(true);
      expect(res.body.comments.length).toBe(1);
      expect(res.body.comments[0].text).toBe("Loved visiting the mustard fields!");
      expect(res.body.comments[0].article).toBeDefined();
      expect(res.body.comments[0].article.name).toBe("punjab");
    });
  });
});

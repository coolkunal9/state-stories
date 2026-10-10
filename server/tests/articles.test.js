const request = require("supertest");
const app = require("../server");
const Article = require("../models/Article");

describe("Articles API (/api/articles)", () => {
  beforeEach(async () => {
    await Article.deleteMany({});

    // Seed test articles
    await Article.create([
      {
        name: "kerala",
        title: "Kerala: God's Own Country",
        image: "/images/kerala.jpg",
        content: "Paragraph 1 about backwaters and tea hills.",
        state: "Kerala",
      },
      {
        name: "rajasthan",
        title: "Rajasthan: Forts and Royalty",
        image: "/images/rajasthan.jpg",
        content: "Paragraph 1 about Thar desert and Havelis.",
        state: "Rajasthan",
      },
      {
        name: "goa",
        title: "Goa: Coastal Heritage and Sunshine",
        image: "/images/goa.jpg",
        content: "Paragraph 1 about Portuguese churches and beaches.",
        state: "Goa",
      },
    ]);
  });

  describe("GET /api/health", () => {
    it("should return 200 OK and database status", async () => {
      const res = await request(app).get("/api/health");
      expect(res.statusCode).toBe(200);
      expect(res.body.ok).toBe(true);
      expect(res.body.database).toBe("connected");
    });
  });

  describe("GET /api/articles", () => {
    it("should return all articles with pagination metadata", async () => {
      const res = await request(app).get("/api/articles");

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.articles)).toBe(true);
      expect(res.body.articles.length).toBe(3);
      expect(res.body.pagination).toBeDefined();
      expect(res.body.pagination.total).toBe(3);
    });

    it("should filter articles by state accurately", async () => {
      const res = await request(app).get("/api/articles?state=Kerala");

      expect(res.statusCode).toBe(200);
      expect(res.body.articles.length).toBe(1);
      expect(res.body.articles[0].name).toBe("kerala");
    });

    it("should cap the limit parameter safely", async () => {
      const res = await request(app).get("/api/articles?limit=100");

      expect(res.statusCode).toBe(200);
      expect(res.body.pagination.limit).toBe(50); // Capped at MAX_LIMIT 50
    });
  });

  describe("GET /api/articles/:name", () => {
    it("should return a single article by slug name", async () => {
      const res = await request(app).get("/api/articles/rajasthan");

      expect(res.statusCode).toBe(200);
      expect(res.body.name).toBe("rajasthan");
      expect(res.body.title).toBe("Rajasthan: Forts and Royalty");
    });

    it("should return 404 Not Found for non-existent article slug", async () => {
      const res = await request(app).get("/api/articles/atlantis");

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/not found/i);
    });
  });
});

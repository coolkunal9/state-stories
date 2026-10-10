const request = require("supertest");
const app = require("../server");
const User = require("../models/User");

describe("Authentication API (/api/auth)", () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe("POST /api/auth/register", () => {
    it("should successfully register a new user and return a JWT", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({
          username: "priya_sharma",
          email: "priya@example.com",
          password: "Password123!",
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
      expect(res.body.user).toBeDefined();
      expect(res.body.user.email).toBe("priya@example.com");
      expect(res.body.user.username).toBe("priya_sharma");
      expect(res.body.user.password).toBeUndefined(); // Ensure hashed password is not returned
    });

    it("should return 409 Conflict when registering with an existing email", async () => {
      await request(app)
        .post("/api/auth/register")
        .send({
          username: "user1",
          email: "duplicate@example.com",
          password: "Password123!",
        });

      const res = await request(app)
        .post("/api/auth/register")
        .send({
          username: "user2",
          email: "duplicate@example.com",
          password: "Password123!",
        });

      expect(res.statusCode).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/already exists/i);
    });

    it("should return 400 Bad Request when password is under minimum length", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({
          username: "validuser",
          email: "valid@example.com",
          password: "123",
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe("POST /api/auth/login", () => {
    beforeEach(async () => {
      await request(app)
        .post("/api/auth/register")
        .send({
          username: "testuser",
          email: "test@example.com",
          password: "Password123!",
        });
    });

    it("should successfully login with valid credentials", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({
          email: "test@example.com",
          password: "Password123!",
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
      expect(res.body.user.email).toBe("test@example.com");
    });

    it("should return 401 Unauthorized for incorrect password", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({
          email: "test@example.com",
          password: "WrongPassword999!",
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/invalid email or password/i);
    });
  });

  describe("GET /api/auth/me", () => {
    it("should return user profile when valid Bearer token is provided", async () => {
      const regRes = await request(app)
        .post("/api/auth/register")
        .send({
          username: "profile_user",
          email: "profile@example.com",
          password: "Password123!",
        });

      const token = regRes.body.token;

      const res = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user.email).toBe("profile@example.com");
      expect(res.body.user.username).toBe("profile_user");
    });

    it("should return 401 Unauthorized when no token is provided", async () => {
      const res = await request(app).get("/api/auth/me");

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });
});

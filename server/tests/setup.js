const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

jest.setTimeout(180000);

let mongoServer;

beforeAll(async () => {
  process.env.NODE_ENV = "test";
  process.env.JWT_SECRET = "test-jwt-secret-for-supertest-1234567890";
  
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  
  if (global.mongoose) {
    global.mongoose = { conn: null, promise: null };
  }
  
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
});

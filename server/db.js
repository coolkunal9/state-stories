const mongoose = require("mongoose");

/**
 * Reuse one MongoDB connection across Vercel serverless invocations (cold starts).
 * @see https://mongoosejs.com/docs/lambda.html
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  const uri =
    process.env.MONGO_URI || "mongodb://127.0.0.1:27017/state-stories";

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(uri, {
        bufferCommands: false,
        maxPoolSize: 10,
      })
      .then((m) => {
        console.log("MongoDB connected");
        return m;
      })
      .catch((err) => {
        cached.promise = null;
        console.error("MongoDB connection error:", err.message);
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

function isDbConnected() {
  return mongoose.connection.readyState === 1;
}

module.exports = { connectDB, isDbConnected };

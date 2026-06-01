import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("Thiếu MONGODB_URI trong environment variables");

// Vercel serverless: tái sử dụng connection để tránh timeout
let cached = global._mongo;
if (!cached) cached = global._mongo = { client: null, promise: null };

export async function connectDB() {
  if (cached.client) return cached.client;
  if (!cached.promise) {
    cached.promise = new MongoClient(uri, { maxPoolSize: 10 }).connect();
  }
  cached.client = await cached.promise;
  return cached.client;
}

export function getDB(client) {
  return client.db("hatdieu");
}

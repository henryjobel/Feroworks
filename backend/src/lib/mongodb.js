import mongoose from "mongoose";
import { env } from "../config/env.js";

let mongooseInstance = globalThis.__ferroworksMongoose;

export async function connectMongoDB() {
  if (mongooseInstance?.connection?.readyState === 1) {
    return mongooseInstance;
  }

  try {
    mongooseInstance = await mongoose.connect(env.DATABASE_URL);

    if (process.env.NODE_ENV !== "production") {
      globalThis.__ferroworksMongoose = mongooseInstance;
    }

    return mongooseInstance;
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    throw error;
  }
}

export function getMongooseInstance() {
  return mongooseInstance || mongoose;
}

export default mongoose;

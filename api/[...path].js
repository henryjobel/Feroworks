import { createApp } from "../backend/src/app.js";
import { connectMongoDB } from "../backend/src/lib/mongodb.js";

const app = createApp();
let mongoConnectionPromise;

export default async function handler(req, res) {
  mongoConnectionPromise ||= connectMongoDB();
  await mongoConnectionPromise;
  return app(req, res);
}

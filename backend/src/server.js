import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { connectMongoDB } from "./lib/mongodb.js";

const app = createApp();

app.listen(env.PORT, async () => {
  console.log(`✅ Server is running!`);
  console.log(`✅ Backend is also running!`);
  console.log(`🚀 FerroWorks server running on http://localhost:${env.PORT}`);
  
  try {
    await connectMongoDB();
    console.log(`✅ Database connected!`);
  } catch (error) {
    console.error(`❌ Database connection failed:`, error.message);
  }
});

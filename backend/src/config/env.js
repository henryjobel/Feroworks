import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const backendEnvPath = path.resolve(currentDir, "../../.env");

dotenv.config();
dotenv.config({ path: backendEnvPath, override: true });

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(8).default("change-me"),
  FRONTEND_ORIGIN: z.string().default("http://localhost:5173,https://feroworks.vercel.app"),
  PUBLIC_SITE_URL: z.string().default("http://localhost:4000"),
  ADMIN_EMAIL: z.string().email().default("admin@ferroworks.local"),
  ADMIN_PASSWORD: z.string().min(8).default("admin12345"),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional(),
  SMTP_SECURE: z
    .union([z.boolean(), z.string()])
    .optional()
    .transform((value) => value === true || value === "true"),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().optional(),
  UPLOAD_DIR: z.string().min(1).default("uploads"),
  MAX_UPLOAD_SIZE_MB: z.coerce.number().positive().default(4),
  PUBLIC_UPLOAD_BASE_URL: z.string().optional(),
});

const parsedEnv = envSchema.parse(process.env);

export const env = {
  ...parsedEnv,
  FRONTEND_ORIGIN: parsedEnv.FRONTEND_ORIGIN.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
};

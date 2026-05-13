import bcrypt from "bcryptjs";
import express from "express";
import { serializeAdminUser } from "../auth/permissions.js";
import { AdminUser } from "../lib/schemas.js";
import { createAuthToken, requireAuth } from "../middleware/auth.js";
import { authRateLimiter } from "../middleware/rate-limiters.js";
import { asyncHandler } from "../utils/async-handler.js";
import { fail, ok } from "../utils/response.js";

export const authRouter = express.Router();

// function authCookieOptions() {
//   const isProduction = process.env.NODE_ENV === "production";
//   return {
//     httpOnly: true,
//     sameSite: isProduction ? "none" : "lax",
//     secure: isProduction,
//     maxAge: 7 * 24 * 60 * 60 * 1000,
//   };
// }

function authCookieOptions() {
  const isProduction = process.env.NODE_ENV === "production" || process.env.NODE_ENV === "prod";
  return {
    httpOnly: true,
    secure: true, 
    // 'none' requires 'secure: true'. If frontend/backend are on same domain, use 'lax'
    sameSite: "none" ,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/", // Ensure the cookie is valid for all paths
  };
}

authRouter.post(
  "/login",
  authRateLimiter,
  asyncHandler(async (req, res) => {
    const { email, password } = req.body ?? {};
    if (!email || !password) {
      return fail(res, 400, "Email and password are required.");
    }

    const user = await AdminUser.findOne({ email });
    if (!user) {
      return fail(res, 401, "Invalid credentials.");
    }
    if (!user.isActive) {
      return fail(res, 403, "This staff account is inactive.");
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return fail(res, 401, "Invalid credentials.");
    }

    await AdminUser.findByIdAndUpdate(user._id, { lastLoginAt: new Date() });

    const freshUser = await AdminUser.findById(user._id);
    const authUser = serializeAdminUser(freshUser);
    const token = createAuthToken(authUser);
    res.cookie("ferroworks_admin_token", token, authCookieOptions());

    return ok(res, authUser);
  }),
);

authRouter.post("/logout", (req, res) => {
  res.clearCookie("ferroworks_admin_token", authCookieOptions());
  return ok(res, { loggedOut: true });
});

authRouter.get(
  "/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    const user = await AdminUser.findById(req.auth.id);
    if (!user || !user.isActive) {
      return fail(res, 401, "Authentication required.");
    }
    return ok(res, serializeAdminUser(user));
  }),
);

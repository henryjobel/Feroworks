import jwt from "jsonwebtoken";
import { hasPermission as canAccess, serializeAdminUser } from "../auth/permissions.js";
import { env } from "../config/env.js";
import { AdminUser } from "../lib/schemas.js";
import { fail } from "../utils/response.js";

export function createAuthToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      permissions: user.permissions || [],
      isActive: user.isActive !== false,
    },
    env.JWT_SECRET,
    { expiresIn: "7d" },
  );
}

export async function requireAuth(req, res, next) {
  const token = req.cookies?.ferroworks_admin_token;
  if (!token) {
    return fail(res, 401, "Authentication required.");
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    const user = await AdminUser.findById(decoded.sub);
    if (!user || !user.isActive) {
      return fail(res, 403, "This staff account is inactive.");
    }
    req.auth = serializeAdminUser(user);
    return next();
  } catch {
    return fail(res, 401, "Invalid authentication token.");
  }
}

export function requirePermission(permission) {
  return function permissionGuard(req, res, next) {
    if (!req.auth) {
      return fail(res, 401, "Authentication required.");
    }

    if (!canAccess(req.auth, permission)) {
      return fail(res, 403, "You do not have permission for this action.");
    }

    return next();
  };
}

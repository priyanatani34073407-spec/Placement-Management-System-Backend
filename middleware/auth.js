import jwt from "jsonwebtoken";

// ===============================
// Authentication Middleware
// ===============================

export function requireAuth(
  req,
  res,
  next
) {
  try {
    // Check JWT configuration
    if (!process.env.JWT_SECRET) {
      console.error(
        "JWT_SECRET is not configured"
      );

      return res.status(500).json({
        success: false,
        message:
          "JWT_SECRET is not configured on the server",
      });
    }

    const authHeader =
      req.headers.authorization || "";

    // Authorization header must be:
    // Bearer <token>
    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required. Please log in.",
      });
    }

    const token =
      authHeader.substring(7).trim();

    if (!token) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication token is missing.",
      });
    }

    // Verify token
    const decoded =
      jwt.verify(
        token,
        process.env.JWT_SECRET
      );

    // Make sure token contains user ID
    if (!decoded?.id) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid authentication token.",
      });
    }

    // Attach authenticated user
    req.user = {
      id: decoded.id,
    };

    // Preserve additional JWT fields
    if (decoded.role) {
      req.user.role = decoded.role;
    }

    next();
  } catch (error) {
    console.error(
      "Authentication Error:",
      error.message
    );

    if (
      error.name ===
      "TokenExpiredError"
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Session expired. Please log in again.",
      });
    }

    if (
      error.name ===
      "JsonWebTokenError"
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid authentication token. Please log in again.",
      });
    }

    return res.status(401).json({
      success: false,
      message:
        "Authentication failed. Please log in again.",
    });
  }
}

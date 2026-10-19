const jwt = require("jsonwebtoken");
const pool = require("../config/db");

const JWT_SECRET = process.env.JWT_SECRET || "wow_burger_jwt_secret_key_2026";

// Map database user row to frontend expected format
function formatUser(user) {
  let role = "staff";
  if (user.role === "super_admin") role = "superadmin";
  else if (user.role === "manager") role = "admin";
  else if (user.role === "staff") role = "staff";

  return {
    id: user.id,
    name: user.full_name,
    email: user.email,
    role: role,
    branchId: user.branch_id || null,
    isActive: Boolean(user.is_active),
    createdAt: user.created_at,
  };
}

// Middleware: Authenticate JWT Token
async function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const [rows] = await pool.query(
      "SELECT id, branch_id, full_name, email, role, is_active FROM users WHERE id = ?",
      [decoded.id]
    );

    if (rows.length === 0 || !rows[0].is_active) {
      return res.status(401).json({ message: "User account not found or deactivated" });
    }

    req.user = formatUser(rows[0]);
    // Also attach raw database role for convenience
    req.user.rawRole = rows[0].role;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

// Middleware: Require specific roles (accepts frontend or DB role names)
function requireRole(allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const normalizedAllowed = allowedRoles.map((r) => {
      if (r === "superadmin") return "super_admin";
      if (r === "admin") return "manager";
      return r;
    });

    if (
      normalizedAllowed.includes(req.user.rawRole) ||
      allowedRoles.includes(req.user.role)
    ) {
      return next();
    }

    return res.status(403).json({ message: "Access denied: insufficient permissions" });
  };
}

module.exports = {
  JWT_SECRET,
  formatUser,
  authenticateToken,
  requireRole,
};

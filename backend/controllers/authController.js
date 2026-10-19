const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");
const { JWT_SECRET, formatUser } = require("../middleware/authMiddleware");

// Helper: record a login attempt
async function recordLoginLog({ userId, email, fullName, role, success, failReason, req }) {
  try {
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req.socket?.remoteAddress ||
      null;
    const userAgent = req.headers["user-agent"] || null;

    await pool.query(
      `INSERT INTO login_logs (user_id, email, full_name, role, success, fail_reason, ip_address, user_agent)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId || null, email, fullName || null, role || null, success ? 1 : 0, failReason || null, ip, userAgent]
    );
  } catch (err) {
    // Never block login because of a logging error
    console.error("Failed to write login log:", err.message);
  }
}

// POST /api/auth/login
async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const [rows] = await pool.query(
      "SELECT id, branch_id, full_name, email, password_hash, role, is_active, created_at FROM users WHERE email = ?",
      [email.trim().toLowerCase()]
    );

    // Unknown email
    if (rows.length === 0) {
      await recordLoginLog({ email, success: false, failReason: "Email not found", req });
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = rows[0];

    // Deactivated account
    if (!user.is_active) {
      await recordLoginLog({ userId: user.id, email, fullName: user.full_name, role: user.role, success: false, failReason: "Account deactivated", req });
      return res.status(403).json({ message: "This account has been deactivated" });
    }

    // Wrong password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      await recordLoginLog({ userId: user.id, email, fullName: user.full_name, role: user.role, success: false, failReason: "Wrong password", req });
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Successful login
    await recordLoginLog({ userId: user.id, email, fullName: user.full_name, role: user.role, success: true, req });

    const formatted = formatUser(user);
    const token = jwt.sign(
      { id: user.id, role: user.role, branchId: user.branch_id },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      user: formatted,
      token,
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Internal server error during login" });
  }
}

// GET /api/auth/me
async function getMe(req, res) {
  res.json({ user: req.user });
}

// GET /api/auth/login-logs  (super_admin only)
async function getLoginLogs(req, res) {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 50, 200);
    const offset = parseInt(req.query.offset) || 0;

    const [rows] = await pool.query(
      `SELECT id, user_id, email, full_name, role, success, fail_reason, ip_address, logged_at
       FROM login_logs
       ORDER BY logged_at DESC
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    const [[{ total }]] = await pool.query("SELECT COUNT(*) AS total FROM login_logs");

    res.json({ total, limit, offset, logs: rows });
  } catch (error) {
    console.error("Error fetching login logs:", error.message);
    res.status(500).json({ message: "Failed to fetch login logs" });
  }
}

module.exports = {
  login,
  getMe,
  getLoginLogs,
};

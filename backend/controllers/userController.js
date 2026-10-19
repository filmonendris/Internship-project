const bcrypt = require("bcryptjs");
const pool = require("../config/db");
const { formatUser } = require("../middleware/authMiddleware");

function mapRoleToDb(role) {
  if (role === "superadmin" || role === "super_admin") return "super_admin";
  if (role === "admin" || role === "manager") return "manager";
  return "staff";
}

// GET /api/users
async function getUsers(req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT id, branch_id, full_name, email, role, is_active, created_at
       FROM users
       ORDER BY id ASC`
    );

    res.json(rows.map(formatUser));
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({ message: "Failed to fetch users" });
  }
}

// GET /api/users/:id
async function getUserById(req, res) {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      `SELECT id, branch_id, full_name, email, role, is_active, created_at
       FROM users WHERE id = ?`,
      [Number(id)]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(formatUser(rows[0]));
  } catch (error) {
    console.error("Error fetching user:", error.message);
    res.status(500).json({ message: "Failed to fetch user" });
  }
}

// POST /api/users
async function createUser(req, res) {
  const { name, email, password, role, branchId, isActive } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ message: "Name is required" });
  }
  if (!email || !email.trim()) {
    return res.status(400).json({ message: "Email is required" });
  }
  if (!password || password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  const cleanEmail = email.trim().toLowerCase();
  const dbRole = mapRoleToDb(role);

  if (dbRole === "manager" && !branchId) {
    return res.status(400).json({ message: "Branch is required for branch admins" });
  }

  try {
    const [existing] = await pool.query("SELECT id FROM users WHERE email = ?", [cleanEmail]);
    if (existing.length > 0) {
      return res.status(400).json({ message: "A user with this email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const [result] = await pool.query(
      `INSERT INTO users (branch_id, full_name, email, password_hash, role, is_active)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        dbRole === "super_admin" ? null : Number(branchId) || null,
        name.trim(),
        cleanEmail,
        passwordHash,
        dbRole,
        isActive === false ? 0 : 1,
      ]
    );

    const newUserId = result.insertId;
    const [createdRows] = await pool.query(
      "SELECT id, branch_id, full_name, email, role, is_active, created_at FROM users WHERE id = ?",
      [newUserId]
    );

    res.status(201).json(formatUser(createdRows[0]));
  } catch (error) {
    console.error("Error creating user:", error.message);
    res.status(500).json({ message: "Failed to create user" });
  }
}

// PUT /api/users/:id
async function updateUser(req, res) {
  const { id } = req.params;
  const userId = Number(id);
  const { name, email, password, role, branchId, isActive } = req.body;

  if (isNaN(userId)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  // Prevent users from deactivating or demoting their own account
  if (req.user && req.user.id === userId) {
    if (isActive === false) {
      return res.status(400).json({ message: "You cannot deactivate your own account" });
    }
    if (role && mapRoleToDb(role) !== req.user.rawRole) {
      return res.status(400).json({ message: "You cannot change your own role" });
    }
  }

  try {
    const [existingRows] = await pool.query("SELECT * FROM users WHERE id = ?", [userId]);
    if (existingRows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = existingRows[0];
    const updates = [];
    const params = [];

    if (name && name.trim()) {
      updates.push("full_name = ?");
      params.push(name.trim());
    }

    if (email && email.trim()) {
      const cleanEmail = email.trim().toLowerCase();
      if (cleanEmail !== user.email) {
        const [dup] = await pool.query("SELECT id FROM users WHERE email = ? AND id != ?", [cleanEmail, userId]);
        if (dup.length > 0) {
          return res.status(400).json({ message: "Email is already taken by another user" });
        }
        updates.push("email = ?");
        params.push(cleanEmail);
      }
    }

    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
      }
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);
      updates.push("password_hash = ?");
      params.push(passwordHash);
    }

    if (role) {
      const dbRole = mapRoleToDb(role);
      updates.push("role = ?");
      params.push(dbRole);

      if (dbRole === "super_admin") {
        updates.push("branch_id = NULL");
      } else if (branchId) {
        updates.push("branch_id = ?");
        params.push(Number(branchId));
      }
    } else if (branchId !== undefined) {
      updates.push("branch_id = ?");
      params.push(branchId ? Number(branchId) : null);
    }

    if (isActive !== undefined) {
      updates.push("is_active = ?");
      params.push(isActive ? 1 : 0);
    }

    if (updates.length > 0) {
      params.push(userId);
      await pool.query(`UPDATE users SET ${updates.join(", ")} WHERE id = ?`, params);
    }

    const [updatedRows] = await pool.query(
      "SELECT id, branch_id, full_name, email, role, is_active, created_at FROM users WHERE id = ?",
      [userId]
    );

    res.json(formatUser(updatedRows[0]));
  } catch (error) {
    console.error("Error updating user:", error.message);
    res.status(500).json({ message: "Failed to update user" });
  }
}

// DELETE /api/users/:id
async function deleteUser(req, res) {
  const { id } = req.params;
  const userId = Number(id);

  if (isNaN(userId)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  // Prevent users from deleting their own account
  if (req.user && req.user.id === userId) {
    return res.status(400).json({ message: "You cannot delete your own account" });
  }

  try {
    const [existing] = await pool.query("SELECT id FROM users WHERE id = ?", [userId]);
    if (existing.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    await pool.query("DELETE FROM users WHERE id = ?", [userId]);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error.message);
    res.status(500).json({ message: "Failed to delete user" });
  }
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};

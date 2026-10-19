const bcrypt = require("bcryptjs");
const pool = require("../config/db");

async function seedInitialUsersIfEmpty() {
  try {
    const [rows] = await pool.query("SELECT COUNT(*) AS count FROM users");
    if (rows[0].count > 0) {
      return; // Already has users, never touch existing data
    }

    console.log("Users table is empty. Seeding initial admin users...");
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash("password123", salt);

    const initialUsers = [
      {
        full_name: "Super Admin",
        email: "superadmin@wowburger.com",
        password_hash: passwordHash,
        role: "super_admin",
        branch_id: null,
        is_active: 1,
      },
      {
        full_name: "Bole Manager",
        email: "bole@wowburger.com",
        password_hash: passwordHash,
        role: "manager",
        branch_id: 1,
        is_active: 1,
      },
      {
        full_name: "Kazanchis Manager",
        email: "kazanchis@wowburger.com",
        password_hash: passwordHash,
        role: "manager",
        branch_id: 2,
        is_active: 1,
      },
    ];

    for (const u of initialUsers) {
      await pool.query(
        `INSERT INTO users (full_name, email, password_hash, role, branch_id, is_active)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [u.full_name, u.email, u.password_hash, u.role, u.branch_id, u.is_active]
      );
    }

    console.log("Initial admin users seeded successfully.");
  } catch (err) {
    console.error("Failed to check/seed initial users:", err.message);
  }
}

module.exports = { seedInitialUsersIfEmpty };

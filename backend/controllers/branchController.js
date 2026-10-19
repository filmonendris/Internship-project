const pool = require("../config/db");

// Convert database fields to the format expected by the frontend
function formatBranch(branch) {
  return {
    id: branch.id,
    name: branch.name,
    address: branch.address,
    phone: branch.phone,
    isActive: Boolean(branch.is_active),
  };
}

// GET /api/branches
async function getBranches(req, res) {
  try {
    const [branches] = await pool.query(
      `SELECT id, name, address, phone, is_active
       FROM branches
       ORDER BY id ASC`
    );

    res.json(branches.map(formatBranch));
  } catch (error) {
    console.error("Error fetching branches:", error.message);
    res.status(500).json({ message: "Failed to fetch branches" });
  }
}

// GET /api/branches/:id
async function getBranchById(req, res) {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      `SELECT id, name, address, phone, is_active
       FROM branches WHERE id = ?`,
      [Number(id)]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Branch not found" });
    }

    res.json(formatBranch(rows[0]));
  } catch (error) {
    console.error("Error fetching branch:", error.message);
    res.status(500).json({ message: "Failed to fetch branch" });
  }
}

// POST /api/branches
async function createBranch(req, res) {
  const { name, address, phone, isActive } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ message: "Branch name is required" });
  }
  if (!phone || !phone.trim()) {
    return res.status(400).json({ message: "Branch phone is required" });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO branches (name, address, phone, is_active)
       VALUES (?, ?, ?, ?)`,
      [name.trim(), address ? address.trim() : null, phone.trim(), isActive === false ? 0 : 1]
    );

    const [rows] = await pool.query(
      `SELECT id, name, address, phone, is_active FROM branches WHERE id = ?`,
      [result.insertId]
    );

    res.status(201).json(formatBranch(rows[0]));
  } catch (error) {
    console.error("Error creating branch:", error.message);
    res.status(500).json({ message: "Failed to create branch" });
  }
}

// PUT /api/branches/:id
async function updateBranch(req, res) {
  const { id } = req.params;
  const branchId = Number(id);
  const { name, address, phone, isActive } = req.body;

  if (isNaN(branchId)) {
    return res.status(400).json({ message: "Invalid branch ID" });
  }

  try {
    const [existing] = await pool.query("SELECT * FROM branches WHERE id = ?", [branchId]);
    if (existing.length === 0) {
      return res.status(404).json({ message: "Branch not found" });
    }

    const updates = [];
    const params = [];

    if (name && name.trim()) {
      updates.push("name = ?");
      params.push(name.trim());
    }
    if (address !== undefined) {
      updates.push("address = ?");
      params.push(address ? address.trim() : null);
    }
    if (phone && phone.trim()) {
      updates.push("phone = ?");
      params.push(phone.trim());
    }
    if (isActive !== undefined) {
      updates.push("is_active = ?");
      params.push(isActive ? 1 : 0);
    }

    if (updates.length > 0) {
      params.push(branchId);
      await pool.query(`UPDATE branches SET ${updates.join(", ")} WHERE id = ?`, params);
    }

    const [rows] = await pool.query(
      `SELECT id, name, address, phone, is_active FROM branches WHERE id = ?`,
      [branchId]
    );

    res.json(formatBranch(rows[0]));
  } catch (error) {
    console.error("Error updating branch:", error.message);
    res.status(500).json({ message: "Failed to update branch" });
  }
}

// DELETE /api/branches/:id
async function deleteBranch(req, res) {
  const { id } = req.params;
  const branchId = Number(id);

  if (isNaN(branchId)) {
    return res.status(400).json({ message: "Invalid branch ID" });
  }

  try {
    const [existing] = await pool.query("SELECT * FROM branches WHERE id = ?", [branchId]);
    if (existing.length === 0) {
      return res.status(404).json({ message: "Branch not found" });
    }

    // Check if there are orders, products, or users attached to this branch
    const [prods] = await pool.query("SELECT COUNT(*) as count FROM products WHERE branch_id = ?", [branchId]);
    if (prods[0].count > 0) {
      // Soft-delete / deactivate rather than breaking foreign keys
      await pool.query("UPDATE branches SET is_active = 0 WHERE id = ?", [branchId]);
      return res.json({ message: "Branch deactivated (products are attached to it)" });
    }

    await pool.query("DELETE FROM branches WHERE id = ?", [branchId]);
    res.json({ message: "Branch deleted successfully" });
  } catch (error) {
    console.error("Error deleting branch:", error.message);
    res.status(500).json({ message: "Failed to delete branch" });
  }
}

module.exports = {
  getBranches,
  getBranchById,
  createBranch,
  updateBranch,
  deleteBranch,
};

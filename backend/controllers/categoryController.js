const pool = require("../config/db");

// Convert database fields into the frontend's expected format
function formatCategory(category) {
  return {
    id: category.id,
    branchId: category.branch_id,
    name: category.name,
    description: category.description,
    order: category.display_order ?? category.id,
    isActive: category.is_active !== undefined ? Boolean(category.is_active) : true,
  };
}

// GET /api/categories
async function getCategories(req, res) {
  const { branchId } = req.query;

  try {
    if (branchId) {
      const bId = Number(branchId);
      const [categories] = await pool.query(
        `SELECT
           c.id,
           c.branch_id,
           c.name,
           c.description,
           c.id AS display_order,
           TRUE AS is_active
         FROM categories c
         WHERE c.branch_id = ?
         ORDER BY c.id ASC`,
        [bId]
      );

      // If branch has no categories (e.g. newly created branch), fall back to branch 1
      if (categories.length === 0 && bId !== 1) {
        const [fallback] = await pool.query(
          `SELECT
             c.id,
             c.branch_id,
             c.name,
             c.description,
             c.id AS display_order,
             TRUE AS is_active
           FROM categories c
           WHERE c.branch_id = 1
           ORDER BY c.id ASC`
        );
        return res.json(fallback.map(formatCategory));
      }

      return res.json(categories.map(formatCategory));
    }

    // No branchId query: return all categories
    const [categories] = await pool.query(
      `SELECT
         c.id,
         c.branch_id,
         c.name,
         c.description,
         c.id AS display_order,
         TRUE AS is_active
       FROM categories c
       ORDER BY c.branch_id ASC, c.id ASC`
    );

    res.json(categories.map(formatCategory));
  } catch (error) {
    console.error("Error fetching categories:", error.message);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
}

// GET /api/categories/:id
async function getCategoryById(req, res) {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      `SELECT
         c.id,
         c.branch_id,
         c.name,
         c.description,
         c.id AS display_order,
         TRUE AS is_active
       FROM categories c WHERE c.id = ?`,
      [Number(id)]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(formatCategory(rows[0]));
  } catch (error) {
    console.error("Error fetching category:", error.message);
    res.status(500).json({ message: "Failed to fetch category" });
  }
}

// POST /api/categories
async function createCategory(req, res) {
  const { name, branchId, description } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ message: "Category name is required" });
  }
  if (!branchId) {
    return res.status(400).json({ message: "Branch ID is required" });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO categories (branch_id, name, description)
       VALUES (?, ?, ?)`,
      [Number(branchId), name.trim(), description ? description.trim() : null]
    );

    const [rows] = await pool.query(
      `SELECT id, branch_id, name, description, id AS display_order, TRUE AS is_active
       FROM categories WHERE id = ?`,
      [result.insertId]
    );

    res.status(201).json(formatCategory(rows[0]));
  } catch (error) {
    console.error("Error creating category:", error.message);
    res.status(500).json({ message: "Failed to create category" });
  }
}

// PUT /api/categories/:id
async function updateCategory(req, res) {
  const { id } = req.params;
  const categoryId = Number(id);
  const { name, branchId, description } = req.body;

  if (isNaN(categoryId)) {
    return res.status(400).json({ message: "Invalid category ID" });
  }

  try {
    const [existing] = await pool.query("SELECT * FROM categories WHERE id = ?", [categoryId]);
    if (existing.length === 0) {
      return res.status(404).json({ message: "Category not found" });
    }

    const updates = [];
    const params = [];

    if (name && name.trim()) {
      updates.push("name = ?");
      params.push(name.trim());
    }
    if (branchId) {
      updates.push("branch_id = ?");
      params.push(Number(branchId));
    }
    if (description !== undefined) {
      updates.push("description = ?");
      params.push(description ? description.trim() : null);
    }

    if (updates.length > 0) {
      params.push(categoryId);
      await pool.query(`UPDATE categories SET ${updates.join(", ")} WHERE id = ?`, params);
    }

    const [rows] = await pool.query(
      `SELECT id, branch_id, name, description, id AS display_order, TRUE AS is_active
       FROM categories WHERE id = ?`,
      [categoryId]
    );

    res.json(formatCategory(rows[0]));
  } catch (error) {
    console.error("Error updating category:", error.message);
    res.status(500).json({ message: "Failed to update category" });
  }
}

// DELETE /api/categories/:id
async function deleteCategory(req, res) {
  const { id } = req.params;
  const categoryId = Number(id);

  if (isNaN(categoryId)) {
    return res.status(400).json({ message: "Invalid category ID" });
  }

  try {
    const [existing] = await pool.query("SELECT * FROM categories WHERE id = ?", [categoryId]);
    if (existing.length === 0) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Safety check: verify if products use this category
    const [prods] = await pool.query("SELECT COUNT(*) as count FROM products WHERE category_id = ?", [categoryId]);
    if (prods[0].count > 0) {
      return res.status(400).json({
        message: `Cannot delete category: ${prods[0].count} product(s) are assigned to it. Reassign or delete those products first.`,
      });
    }

    await pool.query("DELETE FROM categories WHERE id = ?", [categoryId]);
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error.message);
    res.status(500).json({ message: "Failed to delete category" });
  }
}

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};

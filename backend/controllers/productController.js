const pool = require("../config/db");

// Convert database fields into the frontend's expected format
function formatProduct(p) {
  return {
    id: p.id,
    branchId: p.branch_id,
    branchName: p.branch_name || null,
    categoryId: p.category_id,
    categoryName: p.category_name || null,
    name: p.name,
    description: p.description || "",
    price: Number(p.price),
    image: p.image || null,
    isAvailable: Boolean(p.is_available),
    createdAt: p.created_at,
    updatedAt: p.updated_at,
  };
}

// GET /api/products
async function getProducts(req, res) {
  const { branchId, categoryId } = req.query;

  try {
    let query = `
      SELECT
        p.id,
        p.branch_id,
        b.name AS branch_name,
        p.category_id,
        c.name AS category_name,
        p.name,
        p.description,
        p.price,
        p.image,
        p.is_available,
        p.created_at,
        p.updated_at
      FROM products p
      JOIN branches b ON p.branch_id = b.id
      LEFT JOIN categories c ON p.category_id = c.id
    `;
    const params = [];
    const conditions = [];

    if (branchId) {
      conditions.push("p.branch_id = ?");
      params.push(Number(branchId));
    }

    if (categoryId) {
      conditions.push("p.category_id = ?");
      params.push(Number(categoryId));
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`;
    }

    query += " ORDER BY p.id ASC";

    const [products] = await pool.query(query, params);

    // Fallback: if branchId was specified but has no products, fall back to branch 1 menu
    if (branchId && products.length === 0 && Number(branchId) !== 1) {
      let fbQuery = `
        SELECT
          p.id,
          p.branch_id,
          b.name AS branch_name,
          p.category_id,
          c.name AS category_name,
          p.name,
          p.description,
          p.price,
          p.image,
          p.is_available,
          p.created_at,
          p.updated_at
        FROM products p
        JOIN branches b ON p.branch_id = b.id
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.branch_id = 1
      `;
      const fbParams = [];
      if (categoryId) {
        fbQuery += " AND p.category_id = ?";
        fbParams.push(Number(categoryId));
      }
      fbQuery += " ORDER BY p.id ASC";
      const [fallbackProducts] = await pool.query(fbQuery, fbParams);
      return res.json(fallbackProducts.map(formatProduct));
    }

    res.json(products.map(formatProduct));
  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.status(500).json({ message: "Failed to fetch products" });
  }
}

// GET /api/products/:id
async function getProductById(req, res) {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      `SELECT
        p.id,
        p.branch_id,
        b.name AS branch_name,
        p.category_id,
        c.name AS category_name,
        p.name,
        p.description,
        p.price,
        p.image,
        p.is_available,
        p.created_at,
        p.updated_at
      FROM products p
      JOIN branches b ON p.branch_id = b.id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?`,
      [Number(id)]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(formatProduct(rows[0]));
  } catch (error) {
    console.error("Error fetching product:", error.message);
    res.status(500).json({ message: "Failed to fetch product" });
  }
}

// POST /api/products
async function createProduct(req, res) {
  const {
    name,
    description,
    price,
    categoryId,
    category_id,
    branchId,
    branch_id,
    image,
    isAvailable,
    is_available,
  } = req.body;

  const resolvedBranchId = Number(branchId || branch_id);
  const resolvedCategoryId = Number(categoryId || category_id);
  const resolvedPrice = Number(price);

  if (!name || !name.trim()) {
    return res.status(400).json({ message: "Product name is required" });
  }
  if (!resolvedPrice || isNaN(resolvedPrice) || resolvedPrice <= 0) {
    return res.status(400).json({ message: "A valid positive price is required" });
  }
  if (!resolvedBranchId) {
    return res.status(400).json({ message: "Branch ID is required" });
  }

  const available = isAvailable !== undefined ? (isAvailable ? 1 : 0) : (is_available !== undefined ? (is_available ? 1 : 0) : 1);

  try {
    const [result] = await pool.query(
      `INSERT INTO products (branch_id, category_id, name, description, price, image, is_available)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        resolvedBranchId,
        resolvedCategoryId || null,
        name.trim(),
        description ? description.trim() : null,
        resolvedPrice,
        image || null,
        available,
      ]
    );

    const [rows] = await pool.query(
      `SELECT
        p.id,
        p.branch_id,
        b.name AS branch_name,
        p.category_id,
        c.name AS category_name,
        p.name,
        p.description,
        p.price,
        p.image,
        p.is_available,
        p.created_at,
        p.updated_at
      FROM products p
      JOIN branches b ON p.branch_id = b.id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?`,
      [result.insertId]
    );

    res.status(201).json(formatProduct(rows[0]));
  } catch (error) {
    console.error("Error creating product:", error.message);
    res.status(500).json({ message: "Failed to create product" });
  }
}

// PUT /api/products/:id
async function updateProduct(req, res) {
  const { id } = req.params;
  const productId = Number(id);
  const {
    name,
    description,
    price,
    categoryId,
    category_id,
    branchId,
    branch_id,
    image,
    isAvailable,
    is_available,
  } = req.body;

  if (isNaN(productId)) {
    return res.status(400).json({ message: "Invalid product ID" });
  }

  try {
    const [existing] = await pool.query("SELECT * FROM products WHERE id = ?", [productId]);
    if (existing.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    const updates = [];
    const params = [];

    if (name && name.trim()) {
      updates.push("name = ?");
      params.push(name.trim());
    }
    if (description !== undefined) {
      updates.push("description = ?");
      params.push(description ? description.trim() : null);
    }
    if (price !== undefined) {
      const p = Number(price);
      if (isNaN(p) || p <= 0) {
        return res.status(400).json({ message: "Price must be a positive number" });
      }
      updates.push("price = ?");
      params.push(p);
    }
    if (categoryId !== undefined || category_id !== undefined) {
      const c = Number(categoryId || category_id);
      updates.push("category_id = ?");
      params.push(c || null);
    }
    if (branchId !== undefined || branch_id !== undefined) {
      const b = Number(branchId || branch_id);
      updates.push("branch_id = ?");
      params.push(b);
    }
    if (image !== undefined) {
      updates.push("image = ?");
      params.push(image || null);
    }
    if (isAvailable !== undefined || is_available !== undefined) {
      const av = isAvailable !== undefined ? isAvailable : is_available;
      updates.push("is_available = ?");
      params.push(av ? 1 : 0);
    }

    if (updates.length > 0) {
      params.push(productId);
      await pool.query(`UPDATE products SET ${updates.join(", ")} WHERE id = ?`, params);
    }

    const [rows] = await pool.query(
      `SELECT
        p.id,
        p.branch_id,
        b.name AS branch_name,
        p.category_id,
        c.name AS category_name,
        p.name,
        p.description,
        p.price,
        p.image,
        p.is_available,
        p.created_at,
        p.updated_at
      FROM products p
      JOIN branches b ON p.branch_id = b.id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?`,
      [productId]
    );

    res.json(formatProduct(rows[0]));
  } catch (error) {
    console.error("Error updating product:", error.message);
    res.status(500).json({ message: "Failed to update product" });
  }
}

// PATCH /api/products/:id/availability
async function toggleAvailability(req, res) {
  const { id } = req.params;
  const productId = Number(id);
  const { isAvailable } = req.body;

  if (isNaN(productId)) {
    return res.status(400).json({ message: "Invalid product ID" });
  }

  try {
    const [existing] = await pool.query("SELECT id, is_available FROM products WHERE id = ?", [productId]);
    if (existing.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    const newAvailability = isAvailable !== undefined ? (isAvailable ? 1 : 0) : (existing[0].is_available ? 0 : 1);
    await pool.query("UPDATE products SET is_available = ? WHERE id = ?", [newAvailability, productId]);

    res.json({ id: productId, isAvailable: Boolean(newAvailability) });
  } catch (error) {
    console.error("Error updating availability:", error.message);
    res.status(500).json({ message: "Failed to update product availability" });
  }
}

// DELETE /api/products/:id
async function deleteProduct(req, res) {
  const { id } = req.params;
  const productId = Number(id);

  if (isNaN(productId)) {
    return res.status(400).json({ message: "Invalid product ID" });
  }

  try {
    const [existing] = await pool.query("SELECT id, name FROM products WHERE id = ?", [productId]);
    if (existing.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Safety check: is product in order_items?
    const [items] = await pool.query("SELECT COUNT(*) as count FROM order_items WHERE product_id = ?", [productId]);
    if (items[0].count > 0) {
      // Rather than deleting historical order records, deactivate product
      await pool.query("UPDATE products SET is_available = 0 WHERE id = ?", [productId]);
      return res.json({ message: "Product deactivated (referenced in past orders)" });
    }

    await pool.query("DELETE FROM products WHERE id = ?", [productId]);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error.message);
    res.status(500).json({ message: "Failed to delete product" });
  }
}

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  toggleAvailability,
  deleteProduct,
};

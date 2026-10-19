const express = require("express");
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const { authenticateToken, requireRole } = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes for customer and menu browsing
router.get("/", getCategories);
router.get("/:id", getCategoryById);

// Admin-only management routes
router.post("/", authenticateToken, requireRole(["super_admin", "superadmin", "manager", "admin"]), createCategory);
router.put("/:id", authenticateToken, requireRole(["super_admin", "superadmin", "manager", "admin"]), updateCategory);
router.delete("/:id", authenticateToken, requireRole(["super_admin", "superadmin", "manager", "admin"]), deleteCategory);

module.exports = router;

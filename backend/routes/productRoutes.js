const express = require("express");
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  toggleAvailability,
  deleteProduct,
} = require("../controllers/productController");
const { authenticateToken, requireRole } = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes for digital menu & customer browsing
router.get("/", getProducts);
router.get("/:id", getProductById);

// Admin-managed routes
router.post(
  "/",
  authenticateToken,
  requireRole(["super_admin", "superadmin", "manager", "admin"]),
  createProduct
);

router.put(
  "/:id",
  authenticateToken,
  requireRole(["super_admin", "superadmin", "manager", "admin"]),
  updateProduct
);

router.patch(
  "/:id/availability",
  authenticateToken,
  requireRole(["super_admin", "superadmin", "manager", "admin"]),
  toggleAvailability
);

router.delete(
  "/:id",
  authenticateToken,
  requireRole(["super_admin", "superadmin"]),
  deleteProduct
);

module.exports = router;

const express = require("express");
const {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
} = require("../controllers/orderController");
const { authenticateToken, requireRole } = require("../middleware/authMiddleware");

const router = express.Router();

// Retrieve orders (admin or customer status check)
router.get("/", getOrders);
router.get("/:id", getOrderById);

// Public order placement by customers
router.post("/", createOrder);

// Order status update (Staff & Admins only)
router.patch(
  "/:id/status",
  authenticateToken,
  requireRole(["super_admin", "superadmin", "manager", "admin", "staff"]),
  updateOrderStatus
);

module.exports = router;

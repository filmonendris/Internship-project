const express = require("express");
const {
  getBranches,
  getBranchById,
  createBranch,
  updateBranch,
  deleteBranch,
} = require("../controllers/branchController");
const { authenticateToken, requireRole } = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes for customer and menu browsing
router.get("/", getBranches);
router.get("/:id", getBranchById);

// Admin-only management routes
router.post("/", authenticateToken, requireRole(["super_admin", "superadmin"]), createBranch);
router.put("/:id", authenticateToken, requireRole(["super_admin", "superadmin"]), updateBranch);
router.delete("/:id", authenticateToken, requireRole(["super_admin", "superadmin"]), deleteBranch);

module.exports = router;

const express = require("express");
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const { authenticateToken, requireRole } = require("../middleware/authMiddleware");

const router = express.Router();

// All user management routes require authentication and superadmin privileges
router.use(authenticateToken);
router.use(requireRole(["super_admin", "superadmin"]));

router.get("/", getUsers);
router.get("/:id", getUserById);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;

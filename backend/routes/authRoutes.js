const express = require("express");
const { login, getMe, getLoginLogs } = require("../controllers/authController");
const { authenticateToken, requireRole } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/login", login);
router.get("/me", authenticateToken, getMe);
router.get("/login-logs", authenticateToken, requireRole(["superadmin"]), getLoginLogs);

module.exports = router;

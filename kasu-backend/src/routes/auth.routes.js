const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const { authMiddleware } = require("../middleware/auth.middleware");
const {
  login,
  getProfile,
  updateProfile,
  changePassword,
} = require("../controllers/auth.controller");

// Public routes
router.post(
  "/login",
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  login,
);

// Protected routes
router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);
router.post("/change-password", authMiddleware, changePassword);

module.exports = router;

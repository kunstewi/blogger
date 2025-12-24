const express = require("express");
const router = express.Router();
const {
    getStats,
    getRecentActivity,
    getPopularPosts,
} = require("../controllers/dashboardController");
const { verifyToken } = require("../middlewares/authMiddleware");

// All dashboard routes are protected
router.get("/stats", verifyToken, getStats);
router.get("/recent", verifyToken, getRecentActivity);
router.get("/popular", verifyToken, getPopularPosts);

module.exports = router;

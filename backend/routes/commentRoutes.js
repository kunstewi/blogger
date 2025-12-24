const express = require("express");
const router = express.Router();
const {
    createComment,
    getPostComments,
    updateComment,
    deleteComment,
} = require("../controllers/commentController");
const { verifyToken } = require("../middlewares/authMiddleware");

// Public routes
router.get("/:postId", getPostComments);

// Protected routes
router.post("/", verifyToken, createComment);
router.put("/:id", verifyToken, updateComment);
router.delete("/:id", verifyToken, deleteComment);

module.exports = router;

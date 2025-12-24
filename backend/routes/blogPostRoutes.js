const express = require("express");
const router = express.Router();
const {
    createPost,
    getAllPosts,
    getPostBySlug,
    getUserPosts,
    updatePost,
    deletePost,
    toggleDraft,
    likePost,
    updateCoverImage,
} = require("../controllers/blogPostController");
const { verifyToken } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

// Public routes
router.get("/", getAllPosts);
router.get("/:slug", getPostBySlug);
router.patch("/:id/like", likePost);

// Protected routes
router.post("/", verifyToken, createPost);
router.get("/user/my-posts", verifyToken, getUserPosts);
router.put("/:id", verifyToken, updatePost);
router.delete("/:id", verifyToken, deletePost);
router.patch("/:id/draft", verifyToken, toggleDraft);
router.put("/:id/cover", verifyToken, upload.single("image"), updateCoverImage);

module.exports = router;

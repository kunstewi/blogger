const express = require("express");
const router = express.Router();
const {
    generateBlogPost,
    improveSection,
    generateOutline,
    continueWriting,
    generateTags,
} = require("../controllers/aiController");
const { verifyToken } = require("../middlewares/authMiddleware");

// All AI routes are protected
router.post("/generate-post", verifyToken, generateBlogPost);
router.post("/improve-section", verifyToken, improveSection);
router.post("/generate-outline", verifyToken, generateOutline);
router.post("/continue-writing", verifyToken, continueWriting);
router.post("/generate-tags", verifyToken, generateTags);

module.exports = router;

const express = require("express");
const router = express.Router();
const {
    register,
    login,
    getProfile,
    updateProfile,
    updateProfileImage,
    changePassword,
} = require("../controllers/authController");
const { verifyToken } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected routes
router.get("/profile", verifyToken, getProfile);
router.put("/profile", verifyToken, updateProfile);
router.put("/profile-image", verifyToken, upload.single("image"), updateProfileImage);
router.put("/change-password", verifyToken, changePassword);

module.exports = router;

const BlogPost = require("../models/BlogPost");
const Comment = require("../models/Comment");

// Get user statistics
const getStats = async (req, res) => {
    try {
        const userId = req.user._id;

        // Get total posts
        const totalPosts = await BlogPost.countDocuments({ author: userId });

        // Get total published posts
        const publishedPosts = await BlogPost.countDocuments({
            author: userId,
            isDraft: false,
        });

        // Get total drafts
        const drafts = await BlogPost.countDocuments({
            author: userId,
            isDraft: true,
        });

        // Get total views
        const viewsResult = await BlogPost.aggregate([
            { $match: { author: userId } },
            { $group: { _id: null, totalViews: { $sum: "$views" } } },
        ]);
        const totalViews = viewsResult.length > 0 ? viewsResult[0].totalViews : 0;

        // Get total likes
        const likesResult = await BlogPost.aggregate([
            { $match: { author: userId } },
            { $group: { _id: null, totalLikes: { $sum: "$likes" } } },
        ]);
        const totalLikes = likesResult.length > 0 ? likesResult[0].totalLikes : 0;

        // Get total comments on user's posts
        const userPosts = await BlogPost.find({ author: userId }).select("_id");
        const postIds = userPosts.map((post) => post._id);
        const totalComments = await Comment.countDocuments({ post: { $in: postIds } });

        res.status(200).json({
            stats: {
                totalPosts,
                publishedPosts,
                drafts,
                totalViews,
                totalLikes,
                totalComments,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get recent activity
const getRecentActivity = async (req, res) => {
    try {
        const userId = req.user._id;
        const limit = parseInt(req.query.limit) || 5;

        // Get recent posts
        const recentPosts = await BlogPost.find({ author: userId })
            .sort({ createdAt: -1 })
            .limit(limit)
            .select("title slug createdAt views likes isDraft");

        // Get recent comments on user's posts
        const userPosts = await BlogPost.find({ author: userId }).select("_id title slug");
        const postIds = userPosts.map((post) => post._id);

        const recentComments = await Comment.find({ post: { $in: postIds } })
            .populate("author", "name email profileImageUrl")
            .populate("post", "title slug")
            .sort({ createdAt: -1 })
            .limit(limit);

        res.status(200).json({
            recentPosts,
            recentComments,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get popular posts
const getPopularPosts = async (req, res) => {
    try {
        const userId = req.user._id;
        const limit = parseInt(req.query.limit) || 5;
        const sortBy = req.query.sortBy || "views"; // 'views' or 'likes'

        const sortField = sortBy === "likes" ? "likes" : "views";

        const popularPosts = await BlogPost.find({ author: userId, isDraft: false })
            .sort({ [sortField]: -1 })
            .limit(limit)
            .select("title slug views likes createdAt tags");

        res.status(200).json({
            popularPosts,
            sortedBy: sortField,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = {
    getStats,
    getRecentActivity,
    getPopularPosts,
};

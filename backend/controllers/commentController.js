const Comment = require("../models/Comment");
const BlogPost = require("../models/BlogPost");

// Create new comment
const createComment = async (req, res) => {
    try {
        const { postId, content, parentComment } = req.body;

        if (!postId || !content) {
            return res.status(400).json({ message: "Post ID and content are required" });
        }

        // Check if post exists
        const post = await BlogPost.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // If replying to a comment, check if parent comment exists
        if (parentComment) {
            const parent = await Comment.findById(parentComment);
            if (!parent) {
                return res.status(404).json({ message: "Parent comment not found" });
            }
        }

        const comment = await Comment.create({
            post: postId,
            author: req.user._id,
            content,
            parentComment: parentComment || null,
        });

        const populatedComment = await Comment.findById(comment._id).populate(
            "author",
            "name email profileImageUrl"
        );

        res.status(201).json({
            message: "Comment created successfully",
            comment: populatedComment,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get all comments for a post
const getPostComments = async (req, res) => {
    try {
        const { postId } = req.params;

        // Check if post exists
        const post = await BlogPost.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const comments = await Comment.find({ post: postId })
            .populate("author", "name email profileImageUrl")
            .populate("parentComment")
            .sort({ createdAt: -1 });

        res.status(200).json({
            comments,
            total: comments.length,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Update comment
const updateComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({ message: "Content is required" });
        }

        const comment = await Comment.findById(id);

        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        // Check if user is author
        if (comment.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to update this comment" });
        }

        comment.content = content;
        await comment.save();

        const updatedComment = await Comment.findById(id).populate(
            "author",
            "name email profileImageUrl"
        );

        res.status(200).json({
            message: "Comment updated successfully",
            comment: updatedComment,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Delete comment
const deleteComment = async (req, res) => {
    try {
        const { id } = req.params;

        const comment = await Comment.findById(id);

        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        // Check if user is author or admin
        if (
            comment.author.toString() !== req.user._id.toString() &&
            req.user.role !== "admin"
        ) {
            return res.status(403).json({ message: "Not authorized to delete this comment" });
        }

        // Delete all replies to this comment
        await Comment.deleteMany({ parentComment: id });

        await Comment.findByIdAndDelete(id);

        res.status(200).json({ message: "Comment and replies deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = {
    createComment,
    getPostComments,
    updateComment,
    deleteComment,
};

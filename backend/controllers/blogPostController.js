const BlogPost = require("../models/BlogPost");
const Comment = require("../models/Comment");

// Helper function to generate slug from title
const generateSlug = (title) => {
    return title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
};

// Create new blog post
const createPost = async (req, res) => {
    try {
        const { title, content, tags, isDraft, generatedByAI } = req.body;

        if (!title || !content) {
            return res.status(400).json({ message: "Title and content are required" });
        }

        // Generate unique slug
        let slug = generateSlug(title);
        let existingPost = await BlogPost.findOne({ slug });
        let counter = 1;

        while (existingPost) {
            slug = `${generateSlug(title)}-${counter}`;
            existingPost = await BlogPost.findOne({ slug });
            counter++;
        }

        const post = await BlogPost.create({
            title,
            slug,
            content,
            tags: tags || "",
            author: req.user._id,
            isDraft: isDraft || false,
            generatedByAI: generatedByAI || false,
        });

        const populatedPost = await BlogPost.findById(post._id).populate(
            "author",
            "name email profileImageUrl"
        );

        res.status(201).json({
            message: "Blog post created successfully",
            post: populatedPost,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get all published posts with pagination and filtering
const getAllPosts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || "";
        const tag = req.query.tag || "";

        const query = { isDraft: false };

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { content: { $regex: search, $options: "i" } },
            ];
        }

        if (tag) {
            query.tags = { $regex: tag, $options: "i" };
        }

        const total = await BlogPost.countDocuments(query);
        const posts = await BlogPost.find(query)
            .populate("author", "name email profileImageUrl")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        res.status(200).json({
            posts,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit),
                limit,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get single post by slug
const getPostBySlug = async (req, res) => {
    try {
        const { slug } = req.params;

        const post = await BlogPost.findOne({ slug }).populate(
            "author",
            "name email profileImageUrl bio"
        );

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Increment views
        post.views += 1;
        await post.save();

        res.status(200).json({ post });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get current user's posts (including drafts)
const getUserPosts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const query = { author: req.user._id };

        const total = await BlogPost.countDocuments(query);
        const posts = await BlogPost.find(query)
            .populate("author", "name email profileImageUrl")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        res.status(200).json({
            posts,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit),
                limit,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Update blog post
const updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, tags, isDraft } = req.body;

        const post = await BlogPost.findById(id);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Check if user is author
        if (post.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to update this post" });
        }

        // Update slug if title changed
        if (title && title !== post.title) {
            let slug = generateSlug(title);
            let existingPost = await BlogPost.findOne({ slug, _id: { $ne: id } });
            let counter = 1;

            while (existingPost) {
                slug = `${generateSlug(title)}-${counter}`;
                existingPost = await BlogPost.findOne({ slug, _id: { $ne: id } });
                counter++;
            }

            post.slug = slug;
        }

        post.title = title || post.title;
        post.content = content || post.content;
        post.tags = tags !== undefined ? tags : post.tags;
        post.isDraft = isDraft !== undefined ? isDraft : post.isDraft;

        await post.save();

        const updatedPost = await BlogPost.findById(id).populate(
            "author",
            "name email profileImageUrl"
        );

        res.status(200).json({
            message: "Post updated successfully",
            post: updatedPost,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Delete blog post
const deletePost = async (req, res) => {
    try {
        const { id } = req.params;

        const post = await BlogPost.findById(id);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Check if user is author or admin
        if (
            post.author.toString() !== req.user._id.toString() &&
            req.user.role !== "admin"
        ) {
            return res.status(403).json({ message: "Not authorized to delete this post" });
        }

        // Delete all comments associated with this post
        await Comment.deleteMany({ post: id });

        await BlogPost.findByIdAndDelete(id);

        res.status(200).json({ message: "Post and associated comments deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Toggle draft status
const toggleDraft = async (req, res) => {
    try {
        const { id } = req.params;

        const post = await BlogPost.findById(id);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Check if user is author
        if (post.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to update this post" });
        }

        post.isDraft = !post.isDraft;
        await post.save();

        res.status(200).json({
            message: `Post ${post.isDraft ? "saved as draft" : "published"} successfully`,
            post,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Like post
const likePost = async (req, res) => {
    try {
        const { id } = req.params;

        const post = await BlogPost.findById(id);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        post.likes += 1;
        await post.save();

        res.status(200).json({
            message: "Post liked successfully",
            likes: post.likes,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Update cover image
const updateCoverImage = async (req, res) => {
    try {
        const { id } = req.params;

        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const post = await BlogPost.findById(id);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Check if user is author
        if (post.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to update this post" });
        }

        post.coverImageUrl = `/uploads/${req.file.filename}`;
        await post.save();

        res.status(200).json({
            message: "Cover image updated successfully",
            post,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = {
    createPost,
    getAllPosts,
    getPostBySlug,
    getUserPosts,
    updatePost,
    deletePost,
    toggleDraft,
    likePost,
    updateCoverImage,
};

const { GoogleGenAI } = require("@google/genai");
const {
    generateBlogPostPrompt,
    improveSectionPrompt,
    generateOutlinePrompt,
    continueWritingPrompt,
    generateTagsPrompt,
} = require("../utils/prompts");

// Initialize Gemini AI (only if API key is available)
let genAI = null;
if (process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
}

// Generate complete blog post
const generateBlogPost = async (req, res) => {
    try {
        const { topic, keywords, tone } = req.body;

        if (!topic) {
            return res.status(400).json({ message: "Topic is required" });
        }

        if (!process.env.GEMINI_API_KEY) {
            return res
                .status(500)
                .json({ message: "AI service not configured. Please add GEMINI_API_KEY to .env" });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const prompt = generateBlogPostPrompt(topic, keywords, tone);

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const content = response.text();

        res.status(200).json({
            message: "Blog post generated successfully",
            content,
        });
    } catch (error) {
        res.status(500).json({ message: "AI generation failed", error: error.message });
    }
};

// Improve section of content
const improveSection = async (req, res) => {
    try {
        const { content, instructions } = req.body;

        if (!content) {
            return res.status(400).json({ message: "Content is required" });
        }

        if (!process.env.GEMINI_API_KEY) {
            return res
                .status(500)
                .json({ message: "AI service not configured. Please add GEMINI_API_KEY to .env" });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const prompt = improveSectionPrompt(content, instructions);

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const improvedContent = response.text();

        res.status(200).json({
            message: "Content improved successfully",
            content: improvedContent,
        });
    } catch (error) {
        res.status(500).json({ message: "AI improvement failed", error: error.message });
    }
};

// Generate blog outline
const generateOutline = async (req, res) => {
    try {
        const { topic, sections } = req.body;

        if (!topic) {
            return res.status(400).json({ message: "Topic is required" });
        }

        if (!process.env.GEMINI_API_KEY) {
            return res
                .status(500)
                .json({ message: "AI service not configured. Please add GEMINI_API_KEY to .env" });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const prompt = generateOutlinePrompt(topic, sections);

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const outline = response.text();

        res.status(200).json({
            message: "Outline generated successfully",
            content: outline,
        });
    } catch (error) {
        res.status(500).json({ message: "AI generation failed", error: error.message });
    }
};

// Continue writing from existing content
const continueWriting = async (req, res) => {
    try {
        const { content, direction } = req.body;

        if (!content) {
            return res.status(400).json({ message: "Existing content is required" });
        }

        if (!process.env.GEMINI_API_KEY) {
            return res
                .status(500)
                .json({ message: "AI service not configured. Please add GEMINI_API_KEY to .env" });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const prompt = continueWritingPrompt(content, direction);

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const continuation = response.text();

        res.status(200).json({
            message: "Content continuation generated successfully",
            content: continuation,
        });
    } catch (error) {
        res.status(500).json({ message: "AI generation failed", error: error.message });
    }
};

// Generate tags for content
const generateTags = async (req, res) => {
    try {
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({ message: "Content is required" });
        }

        if (!process.env.GEMINI_API_KEY) {
            return res
                .status(500)
                .json({ message: "AI service not configured. Please add GEMINI_API_KEY to .env" });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const prompt = generateTagsPrompt(content);

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const tags = response.text();

        res.status(200).json({
            message: "Tags generated successfully",
            tags: tags.trim(),
        });
    } catch (error) {
        res.status(500).json({ message: "AI generation failed", error: error.message });
    }
};

module.exports = {
    generateBlogPost,
    improveSection,
    generateOutline,
    continueWriting,
    generateTags,
};

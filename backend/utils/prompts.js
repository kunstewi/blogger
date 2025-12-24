// AI Prompt templates for blog generation

const generateBlogPostPrompt = (topic, keywords, tone = "professional") => {
    return `You are a professional blog writer. Generate a complete, well-structured blog post in markdown format.

Topic: ${topic}
Keywords: ${keywords || "N/A"}
Tone: ${tone}

Requirements:
- Write a comprehensive blog post (800-1500 words)
- Use proper markdown formatting with headers (##, ###), lists, bold, italic, code blocks where appropriate
- Include an engaging introduction
- Use clear section headers
- Add a conclusion
- Make it informative and engaging
- Naturally incorporate the keywords if provided
- Use the specified tone

Return ONLY the markdown content, no additional commentary.`;
};

const improveSectionPrompt = (content, instructions) => {
    return `You are a professional editor. Improve the following content based on the instructions provided.

Content to improve:
${content}

Instructions: ${instructions || "Make it more engaging and professional"}

Requirements:
- Maintain markdown formatting
- Keep the core message
- Improve clarity, flow, and engagement
- Fix any grammatical issues
- Make it more compelling

Return ONLY the improved markdown content, no additional commentary.`;
};

const generateOutlinePrompt = (topic, sections = 5) => {
    return `You are a professional content strategist. Create a detailed blog post outline.

Topic: ${topic}
Number of main sections: ${sections}

Requirements:
- Create a structured outline with main sections and subsections
- Use markdown format with proper headers (##, ###)
- Include an introduction and conclusion
- Make each section title descriptive and engaging
- Add brief notes under each section about what to cover

Return ONLY the outline in markdown format, no additional commentary.`;
};

const continueWritingPrompt = (existingContent, direction = "") => {
    return `You are a professional blog writer. Continue writing the blog post based on the existing content.

Existing content:
${existingContent}

${direction ? `Direction: ${direction}` : ""}

Requirements:
- Continue seamlessly from where the content left off
- Maintain the same tone and style
- Use proper markdown formatting
- Write 200-400 words
- Make it flow naturally with the existing content

Return ONLY the continuation in markdown format, no additional commentary.`;
};

const generateTagsPrompt = (content) => {
    return `Analyze the following blog post content and suggest 5-8 relevant tags/keywords.

Content:
${content}

Requirements:
- Suggest 5-8 relevant tags
- Make them specific and searchable
- Use lowercase
- Separate with commas

Return ONLY the comma-separated tags, no additional commentary.`;
};

module.exports = {
    generateBlogPostPrompt,
    improveSectionPrompt,
    generateOutlinePrompt,
    continueWritingPrompt,
    generateTagsPrompt,
};

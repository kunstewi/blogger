import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { postsAPI } from '../utils/api';
import Input from '../components/Input';
import Button from '../components/Button';
import MarkdownEditor from '../components/MarkdownEditor';
import AIAssistant from '../components/AIAssistant';
import LoadingSpinner from '../components/LoadingSpinner';

const CreateEditPost = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = !!id;

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        tags: '',
        isDraft: false,
    });
    const [coverImage, setCoverImage] = useState(null);
    const [coverImagePreview, setCoverImagePreview] = useState('');
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(isEditing);
    const [showAI, setShowAI] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isEditing) {
            fetchPost();
        }
    }, [id]);

    const fetchPost = async () => {
        try {
            const response = await postsAPI.getUserPosts();
            const post = response.data.posts.find((p) => p._id === id);
            if (post) {
                setFormData({
                    title: post.title,
                    content: post.content,
                    tags: post.tags || '',
                    isDraft: post.isDraft,
                });
                if (post.coverImageUrl) {
                    setCoverImagePreview(post.coverImageUrl);
                }
            } else {
                window.showToast?.('Post not found', 'error');
                navigate('/my-posts');
            }
        } catch (error) {
            window.showToast?.('Failed to load post', 'error');
            navigate('/my-posts');
        } finally {
            setInitialLoading(false);
        }
    };

    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
        if (errors[field]) {
            setErrors({ ...errors, [field]: '' });
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCoverImage(file);
            setCoverImagePreview(URL.createObjectURL(file));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = 'Title is required';
        if (!formData.content.trim()) newErrors.content = 'Content is required';
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);
        try {
            let postId = id;

            if (isEditing) {
                await postsAPI.updatePost(id, formData);
            } else {
                const response = await postsAPI.createPost(formData);
                postId = response.data.post._id;
            }

            // Upload cover image if selected
            if (coverImage && postId) {
                const imageFormData = new FormData();
                imageFormData.append('image', coverImage);
                await postsAPI.updateCoverImage(postId, imageFormData);
            }

            window.showToast?.(
                isEditing ? 'Post updated successfully!' : 'Post created successfully!',
                'success'
            );
            navigate('/my-posts');
        } catch (error) {
            window.showToast?.(
                error.response?.data?.message || 'Failed to save post',
                'error'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleAIInsert = (content) => {
        setFormData({ ...formData, content: formData.content + '\n\n' + content });
    };

    if (initialLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="large" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        {isEditing ? 'Edit Post' : 'Create New Post'}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Write your thoughts in markdown format
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <Input
                        label="Title"
                        value={formData.title}
                        onChange={(e) => handleChange('title', e.target.value)}
                        error={errors.title}
                        placeholder="Enter an engaging title..."
                    />

                    {/* Tags */}
                    <Input
                        label="Tags (comma-separated)"
                        value={formData.tags}
                        onChange={(e) => handleChange('tags', e.target.value)}
                        placeholder="e.g., technology, programming, tutorial"
                    />

                    {/* Cover Image */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Cover Image
                        </label>
                        <div className="flex items-center gap-4">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900/30 dark:file:text-blue-400"
                            />
                        </div>
                        {coverImagePreview && (
                            <div className="mt-4">
                                <img
                                    src={coverImagePreview}
                                    alt="Cover preview"
                                    className="w-full h-48 object-cover rounded-lg"
                                />
                            </div>
                        )}
                    </div>

                    {/* Content Editor */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Content
                            </label>
                            <Button
                                type="button"
                                variant="outline"
                                size="small"
                                onClick={() => setShowAI(true)}
                            >
                                ✨ AI Assistant
                            </Button>
                        </div>
                        <MarkdownEditor
                            value={formData.content}
                            onChange={(value) => handleChange('content', value)}
                        />
                        {errors.content && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                {errors.content}
                            </p>
                        )}
                    </div>

                    {/* Draft Toggle */}
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="isDraft"
                            checked={formData.isDraft}
                            onChange={(e) => handleChange('isDraft', e.target.checked)}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <label
                            htmlFor="isDraft"
                            className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                            Save as draft
                        </label>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4">
                        <Button type="submit" loading={loading} className="flex-1">
                            {isEditing ? 'Update Post' : 'Create Post'}
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => navigate('/my-posts')}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>

            {/* AI Assistant Modal */}
            <AIAssistant
                isOpen={showAI}
                onClose={() => setShowAI(false)}
                onInsert={handleAIInsert}
            />
        </div>
    );
};

export default CreateEditPost;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { postsAPI } from '../utils/api';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';

const MyPosts = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, published, drafts

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await postsAPI.getUserPosts();
            setPosts(response.data.posts || []);
        } catch (error) {
            console.error('Error fetching posts:', error);
            window.showToast?.('Failed to load posts', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (postId) => {
        if (!window.confirm('Are you sure you want to delete this post?')) return;

        try {
            await postsAPI.deletePost(postId);
            setPosts(posts.filter((p) => p._id !== postId));
            window.showToast?.('Post deleted successfully', 'success');
        } catch (error) {
            window.showToast?.('Failed to delete post', 'error');
        }
    };

    const handleToggleDraft = async (postId, currentStatus) => {
        try {
            await postsAPI.toggleDraft(postId);
            setPosts(
                posts.map((p) =>
                    p._id === postId ? { ...p, isDraft: !currentStatus } : p
                )
            );
            window.showToast?.(
                currentStatus ? 'Post published' : 'Post saved as draft',
                'success'
            );
        } catch (error) {
            window.showToast?.('Failed to update post status', 'error');
        }
    };

    const filteredPosts = posts.filter((post) => {
        if (filter === 'published') return !post.isDraft;
        if (filter === 'drafts') return post.isDraft;
        return true;
    });

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="large" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            My Posts
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            Manage your blog posts
                        </p>
                    </div>
                    <Link to="/create">
                        <Button>Create New Post</Button>
                    </Link>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-4 mb-6 border-b border-gray-200 dark:border-gray-700">
                    {['all', 'published', 'drafts'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setFilter(tab)}
                            className={`px-4 py-2 font-medium capitalize transition-colors ${filter === tab
                                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                }`}
                        >
                            {tab} ({posts.filter((p) => {
                                if (tab === 'published') return !p.isDraft;
                                if (tab === 'drafts') return p.isDraft;
                                return true;
                            }).length})
                        </button>
                    ))}
                </div>

                {/* Posts List */}
                {filteredPosts.length === 0 ? (
                    <div className="text-center py-20">
                        <svg
                            className="w-24 h-24 mx-auto text-gray-400 dark:text-gray-600 mb-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                        </svg>
                        <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            No posts found
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">
                            {filter === 'drafts'
                                ? 'You have no drafts'
                                : filter === 'published'
                                    ? 'You have no published posts'
                                    : 'Start creating your first post!'}
                        </p>
                        <Link to="/create">
                            <Button>Create Your First Post</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredPosts.map((post) => (
                            <div
                                key={post._id}
                                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <Link to={`/post/${post.slug}`}>
                                                <h3 className="text-xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                                    {post.title}
                                                </h3>
                                            </Link>
                                            {post.isDraft && (
                                                <span className="px-2 py-1 text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-full">
                                                    Draft
                                                </span>
                                            )}
                                            {post.generatedByAI && (
                                                <span className="px-2 py-1 text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full">
                                                    AI Assisted
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                                            <span>{formatDate(post.createdAt)}</span>
                                            <span>•</span>
                                            <span>{post.views || 0} views</span>
                                            <span>•</span>
                                            <span>{post.likes || 0} likes</span>
                                        </div>

                                        {post.tags && (
                                            <div className="flex flex-wrap gap-2">
                                                {post.tags.split(',').map((tag, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full"
                                                    >
                                                        {tag.trim()}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2 ml-4">
                                        <Link to={`/edit/${post._id}`}>
                                            <Button size="small" variant="outline">
                                                Edit
                                            </Button>
                                        </Link>
                                        <Button
                                            size="small"
                                            variant="secondary"
                                            onClick={() => handleToggleDraft(post._id, post.isDraft)}
                                        >
                                            {post.isDraft ? 'Publish' : 'Unpublish'}
                                        </Button>
                                        <Button
                                            size="small"
                                            variant="danger"
                                            onClick={() => handleDelete(post._id)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyPosts;

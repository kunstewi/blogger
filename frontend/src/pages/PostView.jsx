import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { postsAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import CommentSection from '../components/CommentSection';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';

const PostView = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [liked, setLiked] = useState(false);

    useEffect(() => {
        fetchPost();
    }, [slug]);

    const fetchPost = async () => {
        try {
            const response = await postsAPI.getPostBySlug(slug);
            setPost(response.data.post);
        } catch (error) {
            console.error('Error fetching post:', error);
            window.showToast?.('Post not found', 'error');
            navigate('/');
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async () => {
        if (liked) return;
        try {
            await postsAPI.likePost(post._id);
            setPost({ ...post, likes: (post.likes || 0) + 1 });
            setLiked(true);
            window.showToast?.('Post liked!', 'success');
        } catch (error) {
            window.showToast?.('Failed to like post', 'error');
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this post?')) return;

        try {
            await postsAPI.deletePost(post._id);
            window.showToast?.('Post deleted', 'success');
            navigate('/my-posts');
        } catch (error) {
            window.showToast?.('Failed to delete post', 'error');
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
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

    if (!post) return null;

    const isAuthor = user?._id === post.author?._id;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Cover Image */}
            {post.coverImageUrl && (
                <div className="w-full h-96 overflow-hidden">
                    <img
                        src={post.coverImageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover"
                    />
                </div>
            )}

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="mb-8">
                    {/* Tags */}
                    {post.tags && (
                        <div className="flex flex-wrap gap-2 mb-4">
                            {post.tags.split(',').map((tag, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full"
                                >
                                    {tag.trim()}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Title */}
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                        {post.title}
                    </h1>

                    {/* Author & Meta */}
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center space-x-4">
                            {post.author?.profileImageUrl ? (
                                <img
                                    src={post.author.profileImageUrl}
                                    alt={post.author.name}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-lg">
                                    {post.author?.name?.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <div>
                                <p className="font-semibold text-gray-900 dark:text-white">
                                    {post.author?.name}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {formatDate(post.createdAt)}
                                    {post.generatedByAI && (
                                        <span className="ml-2 text-blue-600 dark:text-blue-400">
                                            • AI Assisted
                                        </span>
                                    )}
                                </p>
                            </div>
                        </div>

                        {/* Stats & Actions */}
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-4 text-gray-600 dark:text-gray-400">
                                <div className="flex items-center space-x-1">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    <span>{post.views || 0}</span>
                                </div>
                                <button
                                    onClick={handleLike}
                                    disabled={liked}
                                    className={`flex items-center space-x-1 transition-colors ${liked
                                        ? 'text-red-500'
                                        : 'hover:text-red-500'
                                        }`}
                                >
                                    <svg
                                        className="w-5 h-5"
                                        fill={liked ? 'currentColor' : 'none'}
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                    <span>{post.likes || 0}</span>
                                </button>
                            </div>

                            {/* Edit/Delete for Author */}
                            {isAuthor && (
                                <div className="flex space-x-2">
                                    <Link to={`/edit/${post._id}`}>
                                        <Button size="small" variant="outline">
                                            Edit
                                        </Button>
                                    </Link>
                                    <Button size="small" variant="danger" onClick={handleDelete}>
                                        Delete
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Markdown Content */}
                <div className="prose dark:prose-invert max-w-none mb-12">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                            code({ node, inline, className, children, ...props }) {
                                const match = /language-(\w+)/.exec(className || '');
                                return !inline && match ? (
                                    <SyntaxHighlighter
                                        style={vscDarkPlus}
                                        language={match[1]}
                                        PreTag="div"
                                        {...props}
                                    >
                                        {String(children).replace(/\n$/, '')}
                                    </SyntaxHighlighter>
                                ) : (
                                    <code className={className} {...props}>
                                        {children}
                                    </code>
                                );
                            },
                        }}
                    >
                        {post.content}
                    </ReactMarkdown>
                </div>

                {/* Comments */}
                <CommentSection postId={post._id} />
            </div>
        </div>
    );
};

export default PostView;

import React from 'react';
import { Link } from 'react-router-dom';

const PostCard = ({ post }) => {
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const getExcerpt = (content, maxLength = 150) => {
        const text = content.replace(/[#*`\n]/g, ' ').trim();
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    return (
        <Link to={`/post/${post.slug}`}>
            <div className="group bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500">
                {/* Cover Image */}
                {post.coverImageUrl ? (
                    <div className="h-48 overflow-hidden">
                        <img
                            src={post.coverImageUrl}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                    </div>
                ) : (
                    <div className="h-48 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center">
                        <svg
                            className="w-16 h-16 text-white/50"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                    </div>
                )}

                {/* Content */}
                <div className="p-6">
                    {/* Tags */}
                    {post.tags && (
                        <div className="flex flex-wrap gap-2 mb-3">
                            {post.tags.split(',').slice(0, 3).map((tag, index) => (
                                <span
                                    key={index}
                                    className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full"
                                >
                                    {tag.trim()}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                        {post.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                        {getExcerpt(post.content)}
                    </p>

                    {/* Author & Meta */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            {post.author?.profileImageUrl ? (
                                <img
                                    src={post.author.profileImageUrl}
                                    alt={post.author.name}
                                    className="w-8 h-8 rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-semibold">
                                    {post.author?.name?.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {post.author?.name}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {formatDate(post.createdAt)}
                                </p>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center space-x-3 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center space-x-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                <span>{post.views || 0}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                                <span>{post.likes || 0}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default PostCard;

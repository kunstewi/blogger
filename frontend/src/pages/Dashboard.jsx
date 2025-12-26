import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardAPI } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [recentActivity, setRecentActivity] = useState(null);
    const [popularPosts, setPopularPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [popularSort, setPopularSort] = useState('views');

    useEffect(() => {
        fetchDashboardData();
    }, [popularSort]);

    const fetchDashboardData = async () => {
        try {
            const [statsRes, recentRes, popularRes] = await Promise.all([
                dashboardAPI.getStats(),
                dashboardAPI.getRecentActivity(),
                dashboardAPI.getPopularPosts({ sortBy: popularSort, limit: 5 }),
            ]);

            setStats(statsRes.data);
            setRecentActivity(recentRes.data);
            setPopularPosts(popularRes.data.posts || []);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            window.showToast?.('Failed to load dashboard data', 'error');
        } finally {
            setLoading(false);
        }
    };

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
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Dashboard
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Overview of your blogging activity
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold opacity-90">Total Posts</h3>
                            <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <p className="text-4xl font-bold">{stats?.totalPosts || 0}</p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold opacity-90">Total Views</h3>
                            <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        </div>
                        <p className="text-4xl font-bold">{stats?.totalViews || 0}</p>
                    </div>

                    <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl shadow-lg p-6 text-white">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold opacity-90">Total Likes</h3>
                            <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </div>
                        <p className="text-4xl font-bold">{stats?.totalLikes || 0}</p>
                    </div>

                    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold opacity-90">Total Comments</h3>
                            <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <p className="text-4xl font-bold">{stats?.totalComments || 0}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Popular Posts */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                Popular Posts
                            </h2>
                            <select
                                value={popularSort}
                                onChange={(e) => setPopularSort(e.target.value)}
                                className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="views">By Views</option>
                                <option value="likes">By Likes</option>
                            </select>
                        </div>

                        <div className="space-y-4">
                            {popularPosts.length === 0 ? (
                                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                                    No posts yet
                                </p>
                            ) : (
                                popularPosts.map((post, index) => (
                                    <Link
                                        key={post._id}
                                        to={`/post/${post.slug}`}
                                        className="block p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
                                                {index + 1}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                                                    {post.title}
                                                </h3>
                                                <div className="flex items-center gap-4 mt-1 text-sm text-gray-600 dark:text-gray-400">
                                                    <span>{post.views || 0} views</span>
                                                    <span>•</span>
                                                    <span>{post.likes || 0} likes</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                            Recent Activity
                        </h2>

                        <div className="space-y-6">
                            {/* Recent Posts */}
                            {recentActivity?.recentPosts && recentActivity.recentPosts.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                        Recent Posts
                                    </h3>
                                    <div className="space-y-2">
                                        {recentActivity.recentPosts.map((post) => (
                                            <Link
                                                key={post._id}
                                                to={`/post/${post.slug}`}
                                                className="block p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                                            >
                                                <p className="font-medium text-gray-900 dark:text-white truncate">
                                                    {post.title}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                    {formatDate(post.createdAt)}
                                                </p>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Recent Comments */}
                            {recentActivity?.recentComments && recentActivity.recentComments.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                        Recent Comments
                                    </h3>
                                    <div className="space-y-2">
                                        {recentActivity.recentComments.map((comment) => (
                                            <div
                                                key={comment._id}
                                                className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                                            >
                                                <p className="text-sm text-gray-900 dark:text-white line-clamp-2">
                                                    {comment.content}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                    {formatDate(comment.createdAt)}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {(!recentActivity?.recentPosts || recentActivity.recentPosts.length === 0) &&
                                (!recentActivity?.recentComments || recentActivity.recentComments.length === 0) && (
                                    <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                                        No recent activity
                                    </p>
                                )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

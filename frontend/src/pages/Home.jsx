import React, { useState, useEffect } from 'react';
import { postsAPI } from '../utils/api';
import PostCard from '../components/PostCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Button from '../components/Button';

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedTag, setSelectedTag] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchPosts();
    }, [page, search, selectedTag]);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const params = {
                page,
                limit: 9,
                ...(search && { search }),
                ...(selectedTag && { tag: selectedTag }),
            };
            const response = await postsAPI.getAllPosts(params);
            setPosts(response.data.posts);
            setTotalPages(response.data.totalPages || 1);
        } catch (error) {
            console.error('Error fetching posts:', error);
            window.showToast?.('Failed to load posts', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        fetchPosts();
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6">
                        Welcome to Blogger
                    </h1>
                    <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
                        Discover amazing stories, insights, and ideas from writers around the world
                    </p>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search posts..."
                                className="flex-1 px-6 py-4 rounded-full text-gray-900 dark:text-white bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white"
                            />
                            <Button
                                type="submit"
                                variant="secondary"
                                className="px-8 rounded-full"
                            >
                                Search
                            </Button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Posts Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <LoadingSpinner size="large" />
                    </div>
                ) : posts.length === 0 ? (
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
                        <p className="text-gray-500 dark:text-gray-400">
                            {search ? 'Try a different search term' : 'Be the first to create a post!'}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {posts.map((post) => (
                                <PostCard key={post._id} post={post} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-4 mt-12">
                                <Button
                                    variant="ghost"
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                >
                                    Previous
                                </Button>
                                <span className="text-gray-700 dark:text-gray-300">
                                    Page {page} of {totalPages}
                                </span>
                                <Button
                                    variant="ghost"
                                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                >
                                    Next
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Home;

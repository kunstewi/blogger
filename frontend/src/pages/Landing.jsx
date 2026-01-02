import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
    return (
        <div className="min-h-screen bg-white dark:bg-black">
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                {/* Subtle gradient background */}
                <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 via-white to-white dark:from-blue-950/20 dark:via-black dark:to-black" />
                
                <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
                    {/* Main headline */}
                    <h1 className="text-6xl md:text-7xl lg:text-8xl font-semibold tracking-tight text-gray-900 dark:text-white mb-6 leading-[1.1]">
                        Write.
                        <br />
                        Share.
                        <br />
                        Inspire.
                    </h1>
                    
                    {/* Subheadline */}
                    <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto font-normal leading-relaxed">
                        A beautiful space for your thoughts. Create, publish, and connect with readers who care about what you have to say.
                    </p>
                    
                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link
                            to="/register"
                            className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                            Get started
                            <svg 
                                className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                        <Link
                            to="/"
                            className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200"
                        >
                            Explore posts
                        </Link>
                    </div>
                </div>
                
                {/* Scroll indicator */}
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce">
                    <svg 
                        className="w-6 h-6 text-gray-400" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-32 bg-gray-50 dark:bg-gray-950">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                        {/* Feature 1 */}
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-6 bg-blue-100 dark:bg-blue-950 rounded-2xl flex items-center justify-center">
                                <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                                Elegant Editor
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                Write with a distraction-free markdown editor designed for clarity and focus.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-6 bg-blue-100 dark:bg-blue-950 rounded-2xl flex items-center justify-center">
                                <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                                Build Community
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                Connect with readers through comments and build a following around your ideas.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-6 bg-blue-100 dark:bg-blue-950 rounded-2xl flex items-center justify-center">
                                <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                                AI-Powered
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                Get intelligent suggestions and insights to enhance your writing with AI assistance.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Showcase Section */}
            <section className="py-32">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-20">
                        <h2 className="text-5xl md:text-6xl font-semibold text-gray-900 dark:text-white mb-6">
                            Your words,
                            <br />
                            beautifully presented.
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Every post is crafted to look stunning on any device, ensuring your message shines through.
                        </p>
                    </div>
                    
                    {/* Visual showcase */}
                    <div className="relative">
                        <div className="aspect-[16/10] bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-3xl shadow-2xl overflow-hidden">
                            <div className="p-12 h-full flex items-center justify-center">
                                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 max-w-2xl w-full">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-950 rounded-full" />
                                        <div>
                                            <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                                            <div className="h-2 w-16 bg-gray-100 dark:bg-gray-800 rounded" />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
                                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="py-32 bg-gray-50 dark:bg-gray-950">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-5xl md:text-6xl font-semibold text-gray-900 dark:text-white mb-6">
                        Start writing today.
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-400 mb-12">
                        Join thousands of writers sharing their stories.
                    </p>
                    <Link
                        to="/register"
                        className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                        Create your account
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-gray-200 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            © 2026 Blogger. All rights reserved.
                        </p>
                        <div className="flex gap-8">
                            <Link to="/" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                                Home
                            </Link>
                            <Link to="/login" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                                Sign in
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;

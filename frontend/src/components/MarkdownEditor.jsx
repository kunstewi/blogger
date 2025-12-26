import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const MarkdownEditor = ({ value, onChange, placeholder = 'Write your content in markdown...' }) => {
    const [activeTab, setActiveTab] = useState('write');

    return (
        <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800">
                <button
                    type="button"
                    onClick={() => setActiveTab('write')}
                    className={`px-6 py-3 font-medium transition-colors ${activeTab === 'write'
                            ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                        }`}
                >
                    Write
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('preview')}
                    className={`px-6 py-3 font-medium transition-colors ${activeTab === 'preview'
                            ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                        }`}
                >
                    Preview
                </button>
            </div>

            {/* Content */}
            <div className="bg-white dark:bg-gray-800">
                {activeTab === 'write' ? (
                    <textarea
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={placeholder}
                        className="w-full min-h-[400px] p-4 bg-transparent text-gray-900 dark:text-white focus:outline-none resize-none font-mono text-sm"
                    />
                ) : (
                    <div className="min-h-[400px] p-4 prose dark:prose-invert max-w-none overflow-auto">
                        {value ? (
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
                                {value}
                            </ReactMarkdown>
                        ) : (
                            <p className="text-gray-400">Nothing to preview</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MarkdownEditor;

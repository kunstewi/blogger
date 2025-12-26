import React, { useState } from 'react';
import { aiAPI } from '../utils/api';
import Modal from './Modal';
import Button from './Button';
import Input from './Input';
import LoadingSpinner from './LoadingSpinner';

const AIAssistant = ({ isOpen, onClose, onInsert }) => {
    const [activeFeature, setActiveFeature] = useState('generate');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState('');

    // Form states
    const [topic, setTopic] = useState('');
    const [keywords, setKeywords] = useState('');
    const [tone, setTone] = useState('professional');
    const [content, setContent] = useState('');
    const [instructions, setInstructions] = useState('');
    const [sections, setSections] = useState(5);
    const [direction, setDirection] = useState('');

    const handleGeneratePost = async () => {
        if (!topic.trim()) {
            window.showToast?.('Please enter a topic', 'warning');
            return;
        }

        setLoading(true);
        try {
            const response = await aiAPI.generatePost({
                topic,
                keywords: keywords || undefined,
                tone: tone || undefined,
            });
            setResult(response.data.content);
            window.showToast?.('Post generated successfully!', 'success');
        } catch (error) {
            window.showToast?.(error.response?.data?.message || 'Failed to generate post', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleImproveSection = async () => {
        if (!content.trim()) {
            window.showToast?.('Please enter content to improve', 'warning');
            return;
        }

        setLoading(true);
        try {
            const response = await aiAPI.improveSection({
                content,
                instructions: instructions || undefined,
            });
            setResult(response.data.improvedContent);
            window.showToast?.('Content improved!', 'success');
        } catch (error) {
            window.showToast?.(error.response?.data?.message || 'Failed to improve content', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateOutline = async () => {
        if (!topic.trim()) {
            window.showToast?.('Please enter a topic', 'warning');
            return;
        }

        setLoading(true);
        try {
            const response = await aiAPI.generateOutline({
                topic,
                sections: sections || undefined,
            });
            setResult(response.data.outline);
            window.showToast?.('Outline generated!', 'success');
        } catch (error) {
            window.showToast?.(error.response?.data?.message || 'Failed to generate outline', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleContinueWriting = async () => {
        if (!content.trim()) {
            window.showToast?.('Please enter content to continue from', 'warning');
            return;
        }

        setLoading(true);
        try {
            const response = await aiAPI.continueWriting({
                content,
                direction: direction || undefined,
            });
            setResult(response.data.continuation);
            window.showToast?.('Content continued!', 'success');
        } catch (error) {
            window.showToast?.(error.response?.data?.message || 'Failed to continue writing', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateTags = async () => {
        if (!content.trim()) {
            window.showToast?.('Please enter content', 'warning');
            return;
        }

        setLoading(true);
        try {
            const response = await aiAPI.generateTags({ content });
            setResult(response.data.tags);
            window.showToast?.('Tags generated!', 'success');
        } catch (error) {
            window.showToast?.(error.response?.data?.message || 'Failed to generate tags', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleInsert = () => {
        if (result) {
            onInsert(result);
            setResult('');
            window.showToast?.('Content inserted!', 'success');
        }
    };

    const features = [
        { id: 'generate', label: 'Generate Post', icon: '✨' },
        { id: 'improve', label: 'Improve Section', icon: '🔧' },
        { id: 'outline', label: 'Generate Outline', icon: '📝' },
        { id: 'continue', label: 'Continue Writing', icon: '➡️' },
        { id: 'tags', label: 'Generate Tags', icon: '🏷️' },
    ];

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="AI Writing Assistant" size="large">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Feature Selection */}
                <div className="space-y-2">
                    {features.map((feature) => (
                        <button
                            key={feature.id}
                            onClick={() => {
                                setActiveFeature(feature.id);
                                setResult('');
                            }}
                            className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${activeFeature === feature.id
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                }`}
                        >
                            <span className="mr-2">{feature.icon}</span>
                            {feature.label}
                        </button>
                    ))}
                </div>

                {/* Feature Content */}
                <div className="md:col-span-2">
                    {activeFeature === 'generate' && (
                        <div>
                            <Input
                                label="Topic"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder="e.g., The Future of AI"
                            />
                            <Input
                                label="Keywords (optional)"
                                value={keywords}
                                onChange={(e) => setKeywords(e.target.value)}
                                placeholder="e.g., machine learning, automation"
                            />
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Tone
                                </label>
                                <select
                                    value={tone}
                                    onChange={(e) => setTone(e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="professional">Professional</option>
                                    <option value="casual">Casual</option>
                                    <option value="technical">Technical</option>
                                    <option value="creative">Creative</option>
                                </select>
                            </div>
                            <Button onClick={handleGeneratePost} loading={loading} className="w-full">
                                Generate Post
                            </Button>
                        </div>
                    )}

                    {activeFeature === 'improve' && (
                        <div>
                            <Input
                                label="Content to Improve"
                                type="textarea"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Paste the content you want to improve..."
                                className="min-h-[150px]"
                            />
                            <Input
                                label="Instructions (optional)"
                                value={instructions}
                                onChange={(e) => setInstructions(e.target.value)}
                                placeholder="e.g., Make it more concise"
                            />
                            <Button onClick={handleImproveSection} loading={loading} className="w-full">
                                Improve Content
                            </Button>
                        </div>
                    )}

                    {activeFeature === 'outline' && (
                        <div>
                            <Input
                                label="Topic"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder="e.g., Getting Started with React"
                            />
                            <Input
                                label="Number of Sections"
                                type="number"
                                value={sections}
                                onChange={(e) => setSections(parseInt(e.target.value))}
                                placeholder="5"
                            />
                            <Button onClick={handleGenerateOutline} loading={loading} className="w-full">
                                Generate Outline
                            </Button>
                        </div>
                    )}

                    {activeFeature === 'continue' && (
                        <div>
                            <Input
                                label="Existing Content"
                                type="textarea"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Paste your existing content..."
                                className="min-h-[150px]"
                            />
                            <Input
                                label="Direction (optional)"
                                value={direction}
                                onChange={(e) => setDirection(e.target.value)}
                                placeholder="e.g., Focus on practical examples"
                            />
                            <Button onClick={handleContinueWriting} loading={loading} className="w-full">
                                Continue Writing
                            </Button>
                        </div>
                    )}

                    {activeFeature === 'tags' && (
                        <div>
                            <Input
                                label="Content"
                                type="textarea"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Paste your content to generate tags..."
                                className="min-h-[200px]"
                            />
                            <Button onClick={handleGenerateTags} loading={loading} className="w-full">
                                Generate Tags
                            </Button>
                        </div>
                    )}

                    {/* Result */}
                    {loading && (
                        <div className="mt-6 flex justify-center">
                            <LoadingSpinner />
                        </div>
                    )}

                    {result && !loading && (
                        <div className="mt-6">
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Result
                                </label>
                                <Button size="small" onClick={handleInsert}>
                                    Insert
                                </Button>
                            </div>
                            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 max-h-[300px] overflow-y-auto">
                                <pre className="whitespace-pre-wrap text-sm text-gray-900 dark:text-white">
                                    {result}
                                </pre>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default AIAssistant;

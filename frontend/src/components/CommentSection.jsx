import React, { useState, useEffect } from 'react';
import { commentsAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import Button from './Button';
import LoadingSpinner from './LoadingSpinner';

const CommentSection = ({ postId }) => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState('');
    const [replyTo, setReplyTo] = useState(null);
    const [replyContent, setReplyContent] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editContent, setEditContent] = useState('');
    const { user, isAuthenticated } = useAuth();

    useEffect(() => {
        fetchComments();
    }, [postId]);

    const fetchComments = async () => {
        try {
            const response = await commentsAPI.getComments(postId);
            setComments(response.data.comments || []);
        } catch (error) {
            console.error('Error fetching comments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            await commentsAPI.createComment({
                post: postId,
                content: newComment,
            });
            setNewComment('');
            fetchComments();
            window.showToast?.('Comment added', 'success');
        } catch (error) {
            window.showToast?.('Failed to add comment', 'error');
        }
    };

    const handleReply = async (parentId) => {
        if (!replyContent.trim()) return;

        try {
            await commentsAPI.createComment({
                post: postId,
                content: replyContent,
                parentComment: parentId,
            });
            setReplyContent('');
            setReplyTo(null);
            fetchComments();
            window.showToast?.('Reply added', 'success');
        } catch (error) {
            window.showToast?.('Failed to add reply', 'error');
        }
    };

    const handleEdit = async (commentId) => {
        if (!editContent.trim()) return;

        try {
            await commentsAPI.updateComment(commentId, { content: editContent });
            setEditingId(null);
            setEditContent('');
            fetchComments();
            window.showToast?.('Comment updated', 'success');
        } catch (error) {
            window.showToast?.('Failed to update comment', 'error');
        }
    };

    const handleDelete = async (commentId) => {
        if (!window.confirm('Are you sure you want to delete this comment?')) return;

        try {
            await commentsAPI.deleteComment(commentId);
            fetchComments();
            window.showToast?.('Comment deleted', 'success');
        } catch (error) {
            window.showToast?.('Failed to delete comment', 'error');
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const renderComment = (comment, isReply = false) => {
        const isAuthor = user?._id === comment.author?._id;
        const isEditing = editingId === comment._id;

        return (
            <div
                key={comment._id}
                className={`${isReply ? 'ml-12 mt-4' : 'mt-6'} bg-gray-50 dark:bg-gray-800 rounded-lg p-4`}
            >
                {/* Author Info */}
                <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-3">
                        {comment.author?.profileImageUrl ? (
                            <img
                                src={comment.author.profileImageUrl}
                                alt={comment.author.name}
                                className="w-8 h-8 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-semibold">
                                {comment.author?.name?.charAt(0).toUpperCase()}
                            </div>
                        )}
                        <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                                {comment.author?.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {formatDate(comment.createdAt)}
                            </p>
                        </div>
                    </div>

                    {/* Actions */}
                    {isAuthor && (
                        <div className="flex space-x-2">
                            <button
                                onClick={() => {
                                    setEditingId(comment._id);
                                    setEditContent(comment.content);
                                }}
                                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(comment._id)}
                                className="text-sm text-red-600 dark:text-red-400 hover:underline"
                            >
                                Delete
                            </button>
                        </div>
                    )}
                </div>

                {/* Content */}
                {isEditing ? (
                    <div className="mt-2">
                        <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows="3"
                        />
                        <div className="flex gap-2 mt-2">
                            <Button size="small" onClick={() => handleEdit(comment._id)}>
                                Save
                            </Button>
                            <Button
                                size="small"
                                variant="ghost"
                                onClick={() => {
                                    setEditingId(null);
                                    setEditContent('');
                                }}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                ) : (
                    <>
                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                            {comment.content}
                        </p>

                        {/* Reply Button */}
                        {isAuthenticated && !isReply && (
                            <button
                                onClick={() => setReplyTo(comment._id)}
                                className="mt-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                            >
                                Reply
                            </button>
                        )}

                        {/* Reply Form */}
                        {replyTo === comment._id && (
                            <div className="mt-3">
                                <textarea
                                    value={replyContent}
                                    onChange={(e) => setReplyContent(e.target.value)}
                                    placeholder="Write a reply..."
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows="3"
                                />
                                <div className="flex gap-2 mt-2">
                                    <Button size="small" onClick={() => handleReply(comment._id)}>
                                        Reply
                                    </Button>
                                    <Button
                                        size="small"
                                        variant="ghost"
                                        onClick={() => {
                                            setReplyTo(null);
                                            setReplyContent('');
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* Nested Replies */}
                {comment.replies?.map((reply) => renderComment(reply, true))}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex justify-center py-8">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Comments ({comments.length})
            </h2>

            {/* Add Comment Form */}
            {isAuthenticated ? (
                <form onSubmit={handleAddComment} className="mb-8">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write a comment..."
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="4"
                    />
                    <div className="mt-3">
                        <Button type="submit">Post Comment</Button>
                    </div>
                </form>
            ) : (
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                    Please log in to comment
                </p>
            )}

            {/* Comments List */}
            <div>
                {comments.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                        No comments yet. Be the first to comment!
                    </p>
                ) : (
                    comments.map((comment) => renderComment(comment))
                )}
            </div>
        </div>
    );
};

export default CommentSection;

import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    getProfile: () => api.get('/auth/profile'),
    updateProfile: (data) => api.put('/auth/profile', data),
    updateProfileImage: (formData) => api.put('/auth/profile-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }),
    changePassword: (data) => api.put('/auth/change-password', data),
};

// Blog Posts API
export const postsAPI = {
    getAllPosts: (params) => api.get('/posts', { params }),
    getPostBySlug: (slug) => api.get(`/posts/${slug}`),
    getUserPosts: () => api.get('/posts/user/my-posts'),
    createPost: (data) => api.post('/posts', data),
    updatePost: (id, data) => api.put(`/posts/${id}`, data),
    deletePost: (id) => api.delete(`/posts/${id}`),
    toggleDraft: (id) => api.patch(`/posts/${id}/draft`),
    likePost: (id) => api.patch(`/posts/${id}/like`),
    updateCoverImage: (id, formData) => api.put(`/posts/${id}/cover`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

// Comments API
export const commentsAPI = {
    getComments: (postId) => api.get(`/comments/${postId}`),
    createComment: (data) => api.post('/comments', data),
    updateComment: (id, data) => api.put(`/comments/${id}`, data),
    deleteComment: (id) => api.delete(`/comments/${id}`),
};

// AI API
export const aiAPI = {
    generatePost: (data) => api.post('/ai/generate-post', data),
    improveSection: (data) => api.post('/ai/improve-section', data),
    generateOutline: (data) => api.post('/ai/generate-outline', data),
    continueWriting: (data) => api.post('/ai/continue-writing', data),
    generateTags: (data) => api.post('/ai/generate-tags', data),
};

// Dashboard API
export const dashboardAPI = {
    getStats: () => api.get('/dashboard/stats'),
    getRecentActivity: () => api.get('/dashboard/recent'),
    getPopularPosts: (params) => api.get('/dashboard/popular', { params }),
};

export default api;

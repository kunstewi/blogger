import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../utils/api';
import Input from '../components/Input';
import Button from '../components/Button';

const Profile = () => {
    const { user, updateUser } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');

    // Profile form
    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        bio: user?.bio || '',
    });
    const [profileLoading, setProfileLoading] = useState(false);

    // Image upload
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(user?.profileImageUrl || '');
    const [imageLoading, setImageLoading] = useState(false);

    // Password form
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [passwordErrors, setPasswordErrors] = useState({});
    const [passwordLoading, setPasswordLoading] = useState(false);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setProfileLoading(true);

        try {
            const response = await authAPI.updateProfile(profileData);
            updateUser(response.data.user);
            window.showToast?.('Profile updated successfully', 'success');
        } catch (error) {
            window.showToast?.(error.response?.data?.message || 'Failed to update profile', 'error');
        } finally {
            setProfileLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleImageUpload = async () => {
        if (!imageFile) return;

        setImageLoading(true);
        try {
            const formData = new FormData();
            formData.append('image', imageFile);
            const response = await authAPI.updateProfileImage(formData);
            updateUser(response.data.user);
            setImageFile(null);
            window.showToast?.('Profile image updated', 'success');
        } catch (error) {
            window.showToast?.(error.response?.data?.message || 'Failed to upload image', 'error');
        } finally {
            setImageLoading(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();

        // Validate
        const errors = {};
        if (!passwordData.currentPassword) errors.currentPassword = 'Current password is required';
        if (!passwordData.newPassword) errors.newPassword = 'New password is required';
        else if (passwordData.newPassword.length < 6) errors.newPassword = 'Password must be at least 6 characters';
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }

        if (Object.keys(errors).length > 0) {
            setPasswordErrors(errors);
            return;
        }

        setPasswordLoading(true);
        setPasswordErrors({});

        try {
            await authAPI.changePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
            });
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            window.showToast?.('Password changed successfully', 'success');
        } catch (error) {
            window.showToast?.(error.response?.data?.message || 'Failed to change password', 'error');
        } finally {
            setPasswordLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Profile Settings
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Manage your account settings and preferences
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-6 border-b border-gray-200 dark:border-gray-700">
                    {['profile', 'password'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 font-medium capitalize transition-colors ${activeTab === tab
                                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Profile Tab */}
                {activeTab === 'profile' && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                        {/* Profile Image */}
                        <div className="mb-8">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                                Profile Image
                            </label>
                            <div className="flex items-center gap-6">
                                {imagePreview ? (
                                    <img
                                        src={imagePreview}
                                        alt="Profile"
                                        className="w-24 h-24 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl font-semibold">
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <div className="flex-1">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900/30 dark:file:text-blue-400"
                                    />
                                    {imageFile && (
                                        <Button
                                            onClick={handleImageUpload}
                                            loading={imageLoading}
                                            size="small"
                                            className="mt-2"
                                        >
                                            Upload Image
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Profile Form */}
                        <form onSubmit={handleProfileUpdate}>
                            <Input
                                label="Name"
                                value={profileData.name}
                                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                placeholder="Your name"
                            />

                            <Input
                                label="Bio"
                                type="textarea"
                                value={profileData.bio}
                                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                                placeholder="Tell us about yourself..."
                                className="min-h-[100px]"
                            />

                            <Input
                                label="Email"
                                value={user?.email || ''}
                                disabled
                                containerClassName="opacity-60"
                            />

                            <Button type="submit" loading={profileLoading}>
                                Update Profile
                            </Button>
                        </form>
                    </div>
                )}

                {/* Password Tab */}
                {activeTab === 'password' && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                        <form onSubmit={handlePasswordChange}>
                            <Input
                                label="Current Password"
                                type="password"
                                value={passwordData.currentPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                error={passwordErrors.currentPassword}
                                placeholder="Enter current password"
                            />

                            <Input
                                label="New Password"
                                type="password"
                                value={passwordData.newPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                error={passwordErrors.newPassword}
                                placeholder="Enter new password"
                            />

                            <Input
                                label="Confirm New Password"
                                type="password"
                                value={passwordData.confirmPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                error={passwordErrors.confirmPassword}
                                placeholder="Confirm new password"
                            />

                            <Button type="submit" loading={passwordLoading}>
                                Change Password
                            </Button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;

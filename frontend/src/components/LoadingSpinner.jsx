import React from 'react';

const LoadingSpinner = ({ size = 'medium', className = '' }) => {
    const sizeClasses = {
        small: 'w-4 h-4 border-2',
        medium: 'w-8 h-8 border-3',
        large: 'w-12 h-12 border-4',
    };

    return (
        <div
            className={`${sizeClasses[size]} border-blue-500 border-t-transparent rounded-full animate-spin ${className}`}
            role="status"
            aria-label="Loading"
        />
    );
};

export default LoadingSpinner;

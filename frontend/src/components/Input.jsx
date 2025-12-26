import React from 'react';

const Input = ({
    label,
    error,
    type = 'text',
    className = '',
    containerClassName = '',
    ...props
}) => {
    const inputClasses = `w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${error ? 'border-red-500 focus:ring-red-500' : ''
        } ${className}`;

    const InputElement = type === 'textarea' ? 'textarea' : 'input';

    return (
        <div className={`mb-4 ${containerClassName}`}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {label}
                </label>
            )}
            <InputElement
                type={type === 'textarea' ? undefined : type}
                className={inputClasses}
                {...props}
            />
            {error && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
            )}
        </div>
    );
};

export default Input;

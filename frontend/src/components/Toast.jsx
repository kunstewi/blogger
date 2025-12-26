import React, { useState, useEffect } from 'react';

let toastId = 0;

const Toast = ({ message, type = 'info', duration = 3000, onClose }) => {
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsExiting(true);
            setTimeout(onClose, 300);
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const typeStyles = {
        success: 'bg-green-500 text-white',
        error: 'bg-red-500 text-white',
        info: 'bg-blue-500 text-white',
        warning: 'bg-yellow-500 text-white',
    };

    const icons = {
        success: '✓',
        error: '✕',
        info: 'ℹ',
        warning: '⚠',
    };

    return (
        <div
            className={`${typeStyles[type]} px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px] ${isExiting ? 'animate-toast-out' : 'animate-toast-in'
                }`}
        >
            <span className="text-xl font-bold">{icons[type]}</span>
            <p className="flex-1">{message}</p>
            <button
                onClick={() => {
                    setIsExiting(true);
                    setTimeout(onClose, 300);
                }}
                className="text-white/80 hover:text-white"
            >
                ✕
            </button>
        </div>
    );
};

export const ToastContainer = () => {
    const [toasts, setToasts] = useState([]);

    useEffect(() => {
        window.showToast = (message, type = 'info', duration = 3000) => {
            const id = toastId++;
            setToasts((prev) => [...prev, { id, message, type, duration }]);
        };

        return () => {
            delete window.showToast;
        };
    }, []);

    const removeToast = (id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    return (
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    duration={toast.duration}
                    onClose={() => removeToast(toast.id)}
                />
            ))}
        </div>
    );
};

export default Toast;

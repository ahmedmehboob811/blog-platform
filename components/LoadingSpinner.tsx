
import React from 'react';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md' }) => {
    const sizeClasses = {
        sm: 'h-5 w-5 border-2',
        md: 'h-8 w-8 border-4',
        lg: 'h-16 w-16 border-4',
    };

    return (
        <div 
            className={`animate-spin rounded-full border-gray-300 border-t-indigo-600 ${sizeClasses[size]}`}
            role="status"
            aria-live="polite"
        >
             <span className="sr-only">Loading...</span>
        </div>
    );
};

export default LoadingSpinner;

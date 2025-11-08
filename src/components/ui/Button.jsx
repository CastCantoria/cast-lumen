import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className = '',
  loading = false,
  ...props 
}) => {
  const baseClasses = 'font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center';
  
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-blue-500 bg-white',
  };
  
  const sizes = {
    xs: 'px-2 py-1 text-xs min-h-6',
    sm: 'px-3 py-1.5 text-sm min-h-8',
    md: 'px-4 py-2 text-sm min-h-10 sm:px-5 sm:py-2.5',
    lg: 'px-5 py-2.5 text-base min-h-12 sm:px-6 sm:py-3',
    xl: 'px-6 py-3 text-lg min-h-14 sm:px-8 sm:py-4',
  };
  
  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Chargement...
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
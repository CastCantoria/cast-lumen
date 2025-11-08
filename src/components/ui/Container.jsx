import React from 'react';

const Container = ({ children, className = '', fluid = false }) => {
  if (fluid) {
    return (
      <div className={`w-full ${className}`}>
        {children}
      </div>
    );
  }

  return (
    <div className={`w-full px-responsive ${className}`}>
      <div className="w-full mx-auto">
        {children}
      </div>
    </div>
  );
};

export default Container;
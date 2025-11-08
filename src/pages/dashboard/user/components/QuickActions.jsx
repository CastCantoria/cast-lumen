// src/pages/dashboard/user/components/QuickActions.jsx
import React from 'react';

const QuickActions = ({ userRole }) => {
  const userActions = [
    { icon: '📅', label: 'Calendrier', color: 'blue', path: '/calendar' },
    { icon: '🎵', label: 'Découvrir', color: 'green', path: '/discover' },
    { icon: '👥', label: 'Communauté', color: 'purple', path: '/community' },
    { icon: 'ℹ️', label: 'Infos', color: 'gray', path: '/info' }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {userActions.map((action, index) => (
        <button
          key={index}
          className={`bg-${action.color}-500 hover:bg-${action.color}-600 text-white p-4 rounded-lg text-center transition-all duration-300 transform hover:scale-105 shadow-md`}
        >
          <div className="text-2xl mb-2">{action.icon}</div>
          <div className="text-sm font-medium">{action.label}</div>
        </button>
      ))}
    </div>
  );
};

export default QuickActions;
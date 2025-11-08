// src/pages/dashboard/member/components/QuickActions.jsx
import React from 'react';

const QuickActions = ({ userRole }) => {
  const memberActions = [
    { icon: '📅', label: 'Mes Répétitions', color: 'green', path: '/rehearsals' },
    { icon: '🎵', label: 'Partitions', color: 'blue', path: '/partitions' },
    { icon: '👥', label: 'Événements', color: 'purple', path: '/events' },
    { icon: '📊', label: 'Ma Voix', color: 'orange', path: '/vocal' }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {memberActions.map((action, index) => (
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
// src/pages/chat/components/OnlineUsers.jsx
import React from 'react';

const OnlineUsers = ({ users, currentUser }) => {
  const allUsers = [currentUser, ...users];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
        <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
        👥 Membres en ligne ({allUsers.length})
      </h3>
      
      <div className="space-y-2">
        {allUsers.map((user) => (
          <div
            key={user.id}
            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="relative">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                user.role === 'admin' ? 'bg-red-500' : 
                user.role === 'member' ? 'bg-green-500' : 'bg-blue-500'
              }`}>
                {user.displayName?.charAt(0)}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.displayName}
                {user.id === currentUser.id && (
                  <span className="text-blue-600 ml-1">(Vous)</span>
                )}
              </p>
              <div className="flex items-center space-x-2">
                {user.vocalRange && (
                  <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                    {user.vocalRange}
                  </span>
                )}
                {user.role === 'admin' && (
                  <span className="text-xs text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                    Admin
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Statut de connexion */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Statut de connexion :</span>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>En ligne</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnlineUsers;
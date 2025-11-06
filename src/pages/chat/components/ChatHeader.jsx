// src/pages/chat/components/ChatHeader.jsx
import React from 'react';

const ChatHeader = ({ userProfile, messageCount, onlineCount }) => {
  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">💬 Chat CAST Cantoria</h1>
            <p className="text-gray-600">Espace de discussion communautaire</p>
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">{messageCount}</div>
              <div className="text-xs text-gray-500">Messages</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">{onlineCount}</div>
              <div className="text-xs text-gray-500">En ligne</div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="font-medium text-gray-900">{userProfile?.displayName}</p>
                <p className="text-sm text-gray-500">
                  {userProfile?.vocalRange} • {userProfile?.role}
                </p>
              </div>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                userProfile?.role === 'admin' ? 'bg-red-500' : 
                userProfile?.role === 'member' ? 'bg-green-500' : 'bg-blue-500'
              }`}>
                {userProfile?.displayName?.charAt(0)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
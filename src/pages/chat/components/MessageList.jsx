// src/pages/chat/components/MessageList.jsx
import React, { useEffect, useRef } from 'react';

const MessageList = ({ messages, currentUserId, loading }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    try {
      return new Date(timestamp.toDate()).toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return '';
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Chargement des messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
      {messages.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">💬</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun message</h3>
          <p className="text-gray-600">Soyez le premier à démarrer la conversation !</p>
        </div>
      ) : (
        messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.authorId === currentUserId ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                message.authorId === currentUserId
                  ? 'bg-blue-500 text-white rounded-br-none'
                  : 'bg-white text-gray-900 rounded-bl-none border border-gray-200'
              } shadow-sm`}
            >
              {/* En-tête du message */}
              {message.authorId !== currentUserId && (
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium text-sm text-blue-600">
                    {message.authorName}
                  </span>
                  {message.vocalRange && (
                    <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                      {message.vocalRange}
                    </span>
                  )}
                </div>
              )}

              {/* Contenu du message */}
              <p className="text-sm leading-relaxed">{message.text}</p>

              {/* Pied du message */}
              <div className={`flex items-center justify-between mt-1 ${
                message.authorId === currentUserId ? 'text-blue-100' : 'text-gray-500'
              }`}>
                <span className="text-xs">
                  {formatTime(message.createdAt)}
                </span>
                
                {/* Badges */}
                <div className="flex space-x-1">
                  {message.authorRole === 'admin' && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                      👑
                    </span>
                  )}
                  {message.authorRole === 'member' && message.authorId !== currentUserId && (
                    <span className="text-xs">🎵</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
// src/pages/ChatPage.jsx
import React from 'react';
import ChatInterface from '../components/chat/ChatInterface';

const ChatPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">💬 Chat Communautaire</h1>
          <p className="text-gray-600">Discutez en temps réel avec les membres de la chorale</p>
        </div>
        
        <ChatInterface />
      </div>
    </div>
  );
};

export default ChatPage;
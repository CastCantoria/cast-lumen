// src/pages/chat/components/MessageInput.jsx
import React, { useState } from 'react';

const MessageInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const quickReplies = [
    "Bonjour à tous ! 👋",
    "Qui est disponible pour répéter ? 🎵",
    "J'ai une question sur la partition ❓",
    "Super répétition aujourd'hui ! 🎉",
    "Quelqu'un peut m'aider avec ma voix ? 🎤"
  ];

  return (
    <div className="border-t border-gray-200 p-4 bg-white rounded-b-xl">
      {/* Réponses rapides */}
      <div className="flex flex-wrap gap-2 mb-3">
        {quickReplies.map((reply, index) => (
          <button
            key={index}
            onClick={() => onSendMessage(reply)}
            className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-full transition-colors"
          >
            {reply}
          </button>
        ))}
      </div>

      {/* Zone de saisie */}
      <form onSubmit={handleSubmit} className="flex space-x-3">
        <div className="flex-1">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Tapez votre message... (Entrée pour envoyer)"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            maxLength={500}
          />
          <div className="text-xs text-gray-500 mt-1 text-right">
            {message.length}/500
          </div>
        </div>
        <button
          type="submit"
          disabled={!message.trim()}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center space-x-2"
        >
          <span>📤</span>
          <span className="hidden sm:inline">Envoyer</span>
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
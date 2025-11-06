// src/components/chat/ChatInterface.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const ChatInterface = () => {
  const { currentUser, userProfile } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  // Messages initiaux de démonstration
  const initialMessages = [
    {
      id: 1,
      userId: 'marie-123',
      userName: 'Marie',
      text: 'Bonjour tout le monde ! Quelqu\'un sait à quelle heure commence la répétition demain ?',
      timestamp: '19:38:08',
      isCurrentUser: false
    },
    {
      id: 2,
      userId: 'pierre-456',
      userName: 'Pierre',
      text: '19h comme d\'habitude !',
      timestamp: '20:38:08',
      isCurrentUser: false
    }
  ];

  useEffect(() => {
    setMessages(initialMessages);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now(),
      userId: currentUser.uid,
      userName: userProfile?.displayName || 'Moi',
      text: newMessage,
      timestamp: new Date().toLocaleTimeString('fr-FR', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      }),
      isCurrentUser: true
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const formatTime = (timestamp) => {
    return timestamp;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* En-tête du chat */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-300 rounded-full animate-pulse"></div>
            <h2 className="text-white font-bold text-lg">Chat en direct</h2>
          </div>
          <div className="text-green-100 text-sm">
            {messages.length} messages
          </div>
        </div>
      </div>

      {/* Zone des messages */}
      <div className="h-96 overflow-y-auto p-4 bg-gray-50">
        <div className="space-y-4">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${message.isCurrentUser ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                message.isCurrentUser 
                  ? 'bg-blue-500 text-white rounded-br-none' 
                  : 'bg-white text-gray-800 rounded-bl-none shadow-sm border border-gray-200'
              }`}>
                
                {/* Nom de l'utilisateur */}
                <div className={`font-medium text-sm mb-1 ${
                  message.isCurrentUser ? 'text-blue-100' : 'text-green-600'
                }`}>
                  {message.isCurrentUser ? 'Moi' : message.userName}
                </div>
                
                {/* Message */}
                <div className="text-sm leading-relaxed">
                  {message.text}
                </div>
                
                {/* Timestamp */}
                <div className={`text-xs mt-2 ${
                  message.isCurrentUser ? 'text-blue-200' : 'text-gray-500'
                }`}>
                  {formatTime(message.timestamp)}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Zone de saisie */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <form onSubmit={handleSendMessage} className="flex space-x-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Tapez votre message..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            maxLength={500}
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-full transition-colors duration-200 font-medium flex items-center space-x-2"
          >
            <span>Envoyer</span>
            <span>➤</span>
          </button>
        </form>
        
        {/* Indicateur de caractères */}
        <div className="text-xs text-gray-500 text-center mt-2">
          {newMessage.length}/500 caractères
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
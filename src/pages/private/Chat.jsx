// src/pages/private/Chat.jsx
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const Chat = () => {
  const { userProfile } = useAuth();
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implémenter l'envoi du message
    setMessage('');
  };

  // Messages exemple
  const messages = [
    {
      id: 1,
      author: 'Marie',
      message: 'Bonjour tout le monde ! Quelqu\'un sait à quelle heure commence la répétition demain ?',
      timestamp: new Date().setHours(new Date().getHours() - 2),
      avatar: '/images/membres/avatar1.jpg'
    },
    {
      id: 2,
      author: 'Pierre',
      message: '19h comme d\'habitude !',
      timestamp: new Date().setHours(new Date().getHours() - 1),
      avatar: '/images/membres/avatar2.jpg'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow">
          {/* En-tête */}
          <div className="border-b border-gray-200 px-6 py-4">
            <h1 className="text-xl font-semibold text-gray-900">Chat Communautaire</h1>
          </div>

          {/* Zone de messages */}
          <div className="h-[500px] overflow-y-auto px-6 py-4">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className="flex space-x-3">
                  <img
                    className="h-10 w-10 rounded-full"
                    src={msg.avatar}
                    alt={msg.author}
                  />
                  <div>
                    <div className="flex space-x-2">
                      <span className="font-medium text-gray-900">{msg.author}</span>
                      <span className="text-gray-500">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-gray-500">{msg.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Zone de saisie */}
          <div className="border-t border-gray-200 px-6 py-4">
            <form onSubmit={handleSubmit}>
              <div className="flex space-x-3">
                <div className="flex-1">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="block w-full rounded-full border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Écrivez votre message..."
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center rounded-full border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Envoyer
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Liste des utilisateurs en ligne */}
        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Utilisateurs en ligne</h2>
          </div>
          <div className="px-6 py-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <img
                    className="h-10 w-10 rounded-full"
                    src="/images/membres/avatar1.jpg"
                    alt="Marie"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">Marie</p>
                  <p className="text-sm text-gray-500 truncate">Soprano</p>
                </div>
                <div>
                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-green-400"></span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <img
                    className="h-10 w-10 rounded-full"
                    src="/images/membres/avatar2.jpg"
                    alt="Pierre"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">Pierre</p>
                  <p className="text-sm text-gray-500 truncate">Ténor</p>
                </div>
                <div>
                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-green-400"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
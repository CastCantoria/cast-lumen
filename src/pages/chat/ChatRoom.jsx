// src/pages/chat/ChatRoom.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';

const ChatRoom = () => {
  const { userProfile } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Charger les messages
  useEffect(() => {
    const q = query(
      collection(db, 'chat_messages'),
      orderBy('createdAt', 'asc')
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(messagesData);
    });

    return () => unsubscribe();
  }, []);

  // Scroll automatique
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setLoading(true);
    try {
      await addDoc(collection(db, 'chat_messages'), {
        text: newMessage,
        authorId: userProfile.id,
        authorName: userProfile.displayName,
        authorRole: userProfile.role,
        vocalRange: userProfile.vocalRange,
        createdAt: serverTimestamp(),
        type: 'text'
      });
      setNewMessage('');
    } catch (error) {
      console.error('Erreur envoi message:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp.toDate()).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">💬 Chat Communautaire</h1>
              <p className="text-gray-600">Échangez avec les membres de CAST</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="font-medium text-gray-900">{userProfile?.displayName}</p>
                <p className="text-sm text-gray-500">{userProfile?.vocalRange} • {messages.length} messages</p>
              </div>
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                {userProfile?.displayName?.charAt(0)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Zone de messages */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 h-[600px] flex flex-col">
          
          {/* En-tête du chat */}
          <div className="border-b border-gray-200 p-4 bg-gray-50 rounded-t-xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-gray-900">CAST Cantoria - Discussions</h2>
                <p className="text-sm text-gray-600">
                  {messages.length} messages • {new Set(messages.map(m => m.authorId)).size} participants
                </p>
              </div>
              <div className="flex space-x-2">
                <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">
                  🔊 24
                </button>
                <button className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
                  🎵 18
                </button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">💬</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Soyez le premier à parler !</h3>
                <p className="text-gray-600">Envoyez un message pour démarrer la conversation.</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.authorId === userProfile.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                      message.authorId === userProfile.id
                        ? 'bg-blue-500 text-white rounded-br-none'
                        : 'bg-gray-100 text-gray-900 rounded-bl-none'
                    }`}
                  >
                    {/* En-tête du message */}
                    <div className={`flex items-center space-x-2 mb-1 ${
                      message.authorId === userProfile.id ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      <span className="font-medium text-sm">
                        {message.authorId === userProfile.id ? 'Vous' : message.authorName}
                      </span>
                      <span className="text-xs">
                        {message.vocalRange && `• ${message.vocalRange}`}
                      </span>
                      <span className="text-xs">
                        {formatTime(message.createdAt)}
                      </span>
                    </div>

                    {/* Contenu du message */}
                    <p className="text-sm leading-relaxed">{message.text}</p>

                    {/* Badge rôle */}
                    {message.authorRole === 'admin' && (
                      <div className="mt-1">
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                          👑 Admin
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Zone de saisie */}
          <div className="border-t border-gray-200 p-4 bg-white rounded-b-xl">
            <form onSubmit={sendMessage} className="flex space-x-3">
              <div className="flex-1">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Tapez votre message... (Appuyez sur Entrée pour envoyer)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  disabled={loading}
                />
              </div>
              <button
                type="submit"
                disabled={loading || !newMessage.trim()}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  '📤 Envoyer'
                )}
              </button>
            </form>
            
            {/* Actions rapides */}
            <div className="flex space-x-2 mt-3">
              <button className="text-sm text-gray-500 hover:text-gray-700 flex items-center space-x-1">
                <span>🎵</span>
                <span>Partition</span>
              </button>
              <button className="text-sm text-gray-500 hover:text-gray-700 flex items-center space-x-1">
                <span>📅</span>
                <span>Répétition</span>
              </button>
              <button className="text-sm text-gray-500 hover:text-gray-700 flex items-center space-x-1">
                <span>❓</span>
                <span>Question</span>
              </button>
            </div>
          </div>
        </div>

        {/* Participants en ligne */}
        <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <h3 className="font-medium text-gray-900 mb-3">👥 Membres en ligne</h3>
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center space-x-2 bg-green-50 px-3 py-2 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium">Volatiana (Alto)</span>
            </div>
            <div className="flex items-center space-x-2 bg-green-50 px-3 py-2 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium">Jean (Ténor)</span>
            </div>
            <div className="flex items-center space-x-2 bg-green-50 px-3 py-2 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium">Marie (Soprano)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
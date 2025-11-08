// src/pages/private/Chat.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  limit
} from 'firebase/firestore';
import { db } from '../../lib/firebase';

const Chat = () => {
  const { currentUser, userProfile } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  // 🔥 Écouter les messages en temps réel depuis Firestore
  useEffect(() => {
    if (!currentUser) {
      setIsLoading(false);
      return;
    }

    console.log('🎯 Connexion au chat Firestore pour:', currentUser.email);
    
    try {
      const messagesRef = collection(db, 'messages');
      const q = query(
        messagesRef, 
        orderBy('createdAt', 'asc'),
        limit(100)
      );

      const unsubscribe = onSnapshot(q, 
        (snapshot) => {
          console.log('📨 Messages chargés:', snapshot.docs.length);
          
          const messagesData = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              ...data,
              createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
              isCurrentUser: data.userId === currentUser.uid
            };
          });

          setMessages(messagesData);
          setIsLoading(false);
          setError('');
        },
        (error) => {
          console.error('❌ Erreur Firestore:', error);
          setError('Impossible de charger les messages');
          setIsLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (error) {
      console.error('❌ Erreur initialisation chat:', error);
      setError('Erreur de connexion au chat');
      setIsLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !currentUser) return;

    setIsSending(true);
    setError('');

    try {
      const messageData = {
        text: newMessage.trim(),
        userId: currentUser.uid,
        userName: userProfile?.displayName || currentUser.email?.split('@')[0] || 'Membre',
        userEmail: currentUser.email,
        userRole: userProfile?.role || 'user',
        vocalRange: userProfile?.vocalRange || '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      // 🔥 SAUVEGARDER DANS FIRESTORE
      await addDoc(collection(db, 'messages'), messageData);
      
      setNewMessage('');
      setError('');

    } catch (error) {
      console.error('❌ Erreur envoi message:', error);
      setError('Erreur lors de l\'envoi du message');
    } finally {
      setIsSending(false);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '--:--';
    
    try {
      if (timestamp instanceof Date) {
        return timestamp.toLocaleTimeString('fr-FR', { 
          hour: '2-digit', 
          minute: '2-digit'
        });
      }
      return timestamp;
    } catch {
      return '--:--';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">💬 Chat Communautaire</h1>
          <p className="text-gray-600">Discutez en temps réel avec les membres de la chorale</p>
        </div>

        {/* Affichage des erreurs */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <span className="text-red-500 mr-2">⚠️</span>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}
        
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* En-tête du chat */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-300 rounded-full animate-pulse"></div>
                <h2 className="text-white font-bold text-lg">Chat en direct</h2>
              </div>
              <div className="text-green-100 text-sm">
                {messages.length} message{messages.length > 1 ? 's' : ''}
              </div>
            </div>
          </div>

          {/* Zone des messages */}
          <div className="h-96 overflow-y-auto p-4 bg-gray-50">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin text-2xl mb-2">⏳</div>
                  <p className="text-gray-600">Chargement des messages...</p>
                </div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-500">
                  <div className="text-4xl mb-2">💬</div>
                  <p className="font-medium text-gray-900 mb-1">Aucun message pour le moment</p>
                  <p className="text-sm">Soyez le premier à envoyer un message !</p>
                </div>
              </div>
            ) : (
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
                      
                      {/* En-tête du message */}
                      <div className="flex items-center justify-between mb-1">
                        <div className={`font-medium text-sm ${
                          message.isCurrentUser ? 'text-blue-100' : 'text-green-600'
                        }`}>
                          {message.isCurrentUser ? 'Moi' : message.userName}
                        </div>
                        {message.userRole !== 'user' && (
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            message.userRole === 'admin' ? 'bg-red-100 text-red-800' :
                            message.userRole === 'super-admin' ? 'bg-purple-100 text-purple-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {message.userRole}
                          </span>
                        )}
                      </div>
                      
                      {/* Contenu du message */}
                      <div className="text-sm leading-relaxed break-words">
                        {message.text}
                      </div>
                      
                      {/* Pied du message */}
                      <div className="flex items-center justify-between mt-2">
                        <div className={`text-xs ${
                          message.isCurrentUser ? 'text-blue-200' : 'text-gray-500'
                        }`}>
                          {formatTime(message.createdAt)}
                        </div>
                        {message.vocalRange && (
                          <div className={`text-xs ${
                            message.isCurrentUser ? 'text-blue-200' : 'text-gray-400'
                          }`}>
                            {message.vocalRange}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
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
                disabled={isSending}
              />
              <button
                type="submit"
                disabled={!newMessage.trim() || isSending}
                className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-full transition-colors duration-200 font-medium flex items-center space-x-2 disabled:cursor-not-allowed"
              >
                {isSending ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    <span>Envoi...</span>
                  </>
                ) : (
                  <>
                    <span>Envoyer</span>
                    <span>➤</span>
                  </>
                )}
              </button>
            </form>
            
            {/* Indicateur de caractères */}
            <div className="text-xs text-gray-500 text-center mt-2">
              {newMessage.length}/500 caractères
            </div>
          </div>
        </div>

        {/* Informations */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl mb-2">💾</div>
            <h3 className="font-medium text-gray-900">Messages sauvegardés</h3>
            <p className="text-sm text-gray-600">Tous vos messages sont conservés</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl mb-2">⚡</div>
            <h3 className="font-medium text-gray-900">Temps réel</h3>
            <p className="text-sm text-gray-600">Messages instantanés</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl mb-2">🔒</div>
            <h3 className="font-medium text-gray-900">Sécurisé</h3>
            <p className="text-sm text-gray-600">Réservé aux membres</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
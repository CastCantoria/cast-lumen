import React, { useState } from 'react';
import { collection, getDocs, addDoc, query, where, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../../../lib/firebase';

const MessageCenter = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedTopic, setSelectedTopic] = useState('general');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const topics = [
    { id: 'general', label: 'Information Générale' },
    { id: 'event', label: 'Événement' },
    { id: 'rehearsal', label: 'Répétition' },
    { id: 'urgent', label: 'Urgent' }
  ];

  const roles = [
    { id: 'all', label: 'Tous les membres' },
    { id: 'member', label: 'Membres' },
    { id: 'admin', label: 'Administrateurs' },
    { id: 'super-admin', label: 'Super-Admins' }
  ];

  const sendMessage = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    
    if (!message.trim()) {
      setError('Le message ne peut pas être vide');
      return;
    }

    try {
      setLoading(true);

      // Récupérer les destinataires selon le rôle sélectionné
      const usersRef = collection(db, 'users');
      const q = selectedRole === 'all' 
        ? query(usersRef, where('isActive', '==', true))
        : query(usersRef, where('role', '==', selectedRole), where('isActive', '==', true));
      
      const usersSnapshot = await getDocs(q);
      const recipientIds = usersSnapshot.docs.map(doc => doc.id);

      // Créer le message
      const messageRef = collection(db, 'messages');
      await addDoc(messageRef, {
        content: message,
        topic: selectedTopic,
        targetRole: selectedRole,
        recipients: recipientIds,
        createdAt: serverTimestamp(),
        status: 'sent'
      });

      setSuccess(true);
      setMessage('');
    } catch (err) {
      console.error('Erreur envoi message:', err);
      setError("Une erreur est survenue lors de l'envoi du message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Messagerie</h1>

      <form onSubmit={sendMessage} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Destinataires
          </label>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            {roles.map(role => (
              <option key={role.id} value={role.id}>
                {role.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Type de message
          </label>
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            {topics.map(topic => (
              <option key={topic.id} value={topic.id}>
                {topic.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Message
          </label>
          <div className="mt-1">
            <textarea
              rows={4}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
              placeholder="Écrivez votre message ici..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        {success && (
          <div className="rounded-md bg-green-50 p-4">
            <div className="text-sm text-green-700">
              Message envoyé avec succès !
            </div>
          </div>
        )}

        <div className="flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={() => {
              setMessage('');
              setError(null);
              setSuccess(false);
            }}
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Effacer
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Envoi...' : 'Envoyer'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MessageCenter;
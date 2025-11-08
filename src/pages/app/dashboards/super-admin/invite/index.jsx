import React, { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../../../lib/firebase';

const MemberInvite = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [invites, setInvites] = useState([{
    email: '',
    role: 'member',
    voiceType: 'soprano'
  }]);

  const roles = [
    { id: 'member', name: 'Membre' },
    { id: 'admin', name: 'Administrateur' },
    { id: 'super_admin', name: 'Super Admin' }
  ];

  const voiceTypes = [
    { id: 'soprano', name: 'Soprano' },
    { id: 'alto', name: 'Alto' },
    { id: 'tenor', name: 'Ténor' },
    { id: 'bass', name: 'Basse' }
  ];

  const handleAddInvite = () => {
    setInvites([
      ...invites,
      {
        email: '',
        role: 'member',
        voiceType: 'soprano'
      }
    ]);
  };

  const handleRemoveInvite = (index) => {
    setInvites(invites.filter((_, i) => i !== index));
  };

  const handleInviteChange = (index, field, value) => {
    const updatedInvites = [...invites];
    updatedInvites[index] = {
      ...updatedInvites[index],
      [field]: value
    };
    setInvites(updatedInvites);
  };

  const validateEmails = (emails) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emails.every(invite => emailRegex.test(invite.email));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Vérifier les emails
    if (!validateEmails(invites)) {
      setError('Veuillez vérifier que tous les emails sont valides');
      return;
    }

    // Vérifier les doublons
    const emails = invites.map(invite => invite.email);
    if (new Set(emails).size !== emails.length) {
      setError('Des adresses email sont en double');
      return;
    }

    setLoading(true);

    try {
      // Créer les invitations dans Firestore
      await Promise.all(
        invites.map(invite =>
          addDoc(collection(db, 'invitations'), {
            ...invite,
            status: 'pending',
            createdAt: serverTimestamp(),
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 jours
            createdBy: 'TODO: Add creator ID from context' // À implémenter avec le contexte d'auth
          })
        )
      );

      // TODO: Implémenter l'envoi d'emails via un service
      // emailService.sendInvitations(invites);

      setSuccess(true);
      setInvites([{
        email: '',
        role: 'member',
        voiceType: 'soprano'
      }]);
    } catch (err) {
      console.error('Erreur création invitations:', err);
      setError("Une erreur s'est produite lors de l'envoi des invitations");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Inviter des membres</h1>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-600">Les invitations ont été envoyées avec succès !</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {invites.map((invite, index) => (
                <li key={index} className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900">
                        Invitation {index + 1}
                      </h4>
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveInvite(index)}
                          className="text-sm text-red-600 hover:text-red-800"
                        >
                          Supprimer
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Email
                        </label>
                        <input
                          type="email"
                          value={invite.email}
                          onChange={(e) => handleInviteChange(index, 'email', e.target.value)}
                          required
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Rôle
                        </label>
                        <select
                          value={invite.role}
                          onChange={(e) => handleInviteChange(index, 'role', e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        >
                          {roles.map(role => (
                            <option key={role.id} value={role.id}>
                              {role.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Pupitre
                        </label>
                        <select
                          value={invite.voiceType}
                          onChange={(e) => handleInviteChange(index, 'voiceType', e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        >
                          {voiceTypes.map(voice => (
                            <option key={voice.id} value={voice.id}>
                              {voice.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleAddInvite}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              + Ajouter une invitation
            </button>

            <div className="flex space-x-3">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                onClick={() => window.history.back()}
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Envoi...' : 'Envoyer les invitations'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MemberInvite;
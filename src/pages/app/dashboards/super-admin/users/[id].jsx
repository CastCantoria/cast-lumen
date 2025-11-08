import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../../../lib/firebase';

const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [user, setUser] = useState(null);

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

  const membershipStatus = [
    { id: 'active', name: 'Actif', color: 'green' },
    { id: 'inactive', name: 'Inactif', color: 'gray' },
    { id: 'suspended', name: 'Suspendu', color: 'yellow' },
    { id: 'blocked', name: 'Bloqué', color: 'red' }
  ];

  useEffect(() => {
    loadUserProfile();
  }, [id]);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      const userDoc = await getDoc(doc(db, 'users', id));
      
      if (!userDoc.exists()) {
        setError('Utilisateur non trouvé');
        return;
      }

      setUser({
        id: userDoc.id,
        ...userDoc.data()
      });
    } catch (err) {
      console.error('Erreur chargement profil:', err);
      setError('Erreur lors du chargement du profil');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setUser(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      await updateDoc(doc(db, 'users', id), {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        voiceType: user.voiceType,
        status: user.status,
        phone: user.phone,
        updatedAt: new Date()
      });

      setSuccess(true);
    } catch (err) {
      console.error('Erreur mise à jour profil:', err);
      setError('Erreur lors de la mise à jour du profil');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !user) {
    return <div className="p-6">Chargement du profil...</div>;
  }

  if (error && !user) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Profil Utilisateur</h1>
          <button
            onClick={() => navigate('/dashboard/super-admin/users')}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            ← Retour à la liste
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-600">Profil mis à jour avec succès !</p>
          </div>
        )}

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <div className="flex items-center space-x-4">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-2xl text-gray-500">
                    {user.firstName?.[0]}{user.lastName?.[0]}
                  </span>
                </div>
              )}
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-sm text-gray-500">
                  Membre depuis {new Date(user.createdAt?.seconds * 1000).toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200">
            <form onSubmit={handleSubmit}>
              <dl>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Prénom</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                    <input
                      type="text"
                      value={user.firstName || ''}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </dd>
                </div>

                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Nom</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                    <input
                      type="text"
                      value={user.lastName || ''}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </dd>
                </div>

                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                    <input
                      type="email"
                      value={user.email || ''}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </dd>
                </div>

                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Téléphone</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                    <input
                      type="tel"
                      value={user.phone || ''}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </dd>
                </div>

                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Rôle</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                    <select
                      value={user.role || 'member'}
                      onChange={(e) => handleInputChange('role', e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      {roles.map(role => (
                        <option key={role.id} value={role.id}>
                          {role.name}
                        </option>
                      ))}
                    </select>
                  </dd>
                </div>

                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Pupitre</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                    <select
                      value={user.voiceType || 'soprano'}
                      onChange={(e) => handleInputChange('voiceType', e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      {voiceTypes.map(voice => (
                        <option key={voice.id} value={voice.id}>
                          {voice.name}
                        </option>
                      ))}
                    </select>
                  </dd>
                </div>

                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Statut</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                    <select
                      value={user.status || 'active'}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      {membershipStatus.map(status => (
                        <option key={status.id} value={status.id}>
                          {status.name}
                        </option>
                      ))}
                    </select>
                  </dd>
                </div>

                <div className="bg-white px-4 py-5 sm:px-6">
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => navigate('/dashboard/super-admin/users')}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
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
                      {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
                    </button>
                  </div>
                </div>
              </dl>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
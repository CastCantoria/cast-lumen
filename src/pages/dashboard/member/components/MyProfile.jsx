import React, { useState } from 'react';
import { usePermissions } from '../../../../services/permissionService';

const MyProfile = () => {
  const { hasPermission, userProfile } = usePermissions();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    displayName: userProfile?.displayName || 'Jean Dupont',
    email: userProfile?.email || 'jean.dupont@cast.com',
    voice: userProfile?.voice || 'Ténor',
    phone: userProfile?.phone || '+33 6 12 34 56 78',
    joinDate: userProfile?.joinDate || '2023-05-15',
    bio: userProfile?.bio || 'Membre passionné de la chorale C.A.S.T. depuis 2023. Amateur de musique sacrée et classique.',
    notifications: {
      email: true,
      events: true,
      announcements: false,
      practice: true
    }
  });

  const handleSave = () => {
    // Implémentation Firebase à ajouter
    console.log('Sauvegarde du profil:', profile);
    setIsEditing(false);
    alert('Profil mis à jour avec succès !');
  };

  const handleNotificationChange = (key, value) => {
    setProfile({
      ...profile,
      notifications: {
        ...profile.notifications,
        [key]: value
      }
    });
  };

  if (!hasPermission('profile:update')) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">👤 Mon Profil</h3>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`py-2 px-4 rounded-md transition-colors ${
            isEditing 
              ? 'bg-gray-500 text-white hover:bg-gray-600' 
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isEditing ? 'Annuler' : 'Modifier'}
        </button>
      </div>

      {isEditing ? (
        <div className="space-y-6">
          {/* Informations personnelles */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-4">Informations Personnelles</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom complet
                </label>
                <input
                  type="text"
                  value={profile.displayName}
                  onChange={(e) => setProfile({...profile, displayName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({...profile, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone
                </label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({...profile, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type de voix
                </label>
                <select
                  value={profile.voice}
                  onChange={(e) => setProfile({...profile, voice: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Soprano">Soprano</option>
                  <option value="Alto">Alto</option>
                  <option value="Ténor">Ténor</option>
                  <option value="Basse">Basse</option>
                </select>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio / Présentation
            </label>
            <textarea
              value={profile.bio}
              onChange={(e) => setProfile({...profile, bio: e.target.value})}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Parlez-nous un peu de vous..."
            />
          </div>

          {/* Notifications */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-4">Préférences de notifications</h4>
            <div className="space-y-3">
              {Object.entries(profile.notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      {key === 'email' && 'Emails généraux'}
                      {key === 'events' && 'Nouveaux événements'}
                      {key === 'announcements' && 'Annonces importantes'}
                      {key === 'practice' && 'Rappels de pratique'}
                    </label>
                    <p className="text-xs text-gray-500">
                      {key === 'email' && 'Recevoir les newsletters et communications générales'}
                      {key === 'events' && 'Être notifié des nouveaux événements et répétitions'}
                      {key === 'announcements' && 'Recevoir les annonces urgentes de la chorale'}
                      {key === 'practice' && 'Rappels pour les séances de pratique personnelle'}
                    </p>
                  </div>
                  <button
                    onClick={() => handleNotificationChange(key, !value)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                      value ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      value ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-500 text-white py-2 px-6 rounded-md hover:bg-gray-600 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors"
            >
              Sauvegarder
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Vue du profil */}
          <div className="flex items-start space-x-6">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-2xl text-blue-600 font-medium">
                {profile.displayName.charAt(0)}
              </span>
            </div>
            <div className="flex-1">
              <h4 className="text-xl font-bold text-gray-900">{profile.displayName}</h4>
              <p className="text-gray-600">{profile.email}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  🎵 {profile.voice}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  📅 Membre depuis {profile.joinDate}
                </span>
              </div>
            </div>
          </div>

          {/* Informations de contact */}
          <div>
            <h5 className="text-sm font-medium text-gray-900 mb-2">Contact</h5>
            <div className="space-y-1">
              <p className="text-sm text-gray-600 flex items-center">
                <span className="mr-2">📧</span>
                {profile.email}
              </p>
              <p className="text-sm text-gray-600 flex items-center">
                <span className="mr-2">📱</span>
                {profile.phone}
              </p>
            </div>
          </div>

          {/* Bio */}
          <div>
            <h5 className="text-sm font-medium text-gray-900 mb-2">À propos</h5>
            <p className="text-sm text-gray-600 leading-relaxed">
              {profile.bio}
            </p>
          </div>

          {/* Statistiques du membre */}
          <div className="border-t pt-4">
            <h5 className="text-sm font-medium text-gray-900 mb-3">Mon activité</h5>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-lg font-bold text-blue-600">12</div>
                <div className="text-xs text-blue-800">Événements participés</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-lg font-bold text-green-600">85%</div>
                <div className="text-xs text-green-800">Taux de présence</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProfile;
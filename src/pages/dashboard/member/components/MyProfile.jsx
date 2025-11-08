// src/pages/dashboard/member/components/MyProfile.jsx
import React, { useState, useEffect } from 'react';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';
import { useAuth } from '../../../../contexts/AuthContext';

const MyProfile = () => {
  const { userProfile, currentUser, refreshUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [profile, setProfile] = useState({
    displayName: '',
    email: '',
    voice: '',
    phone: '',
    joinDate: '',
    bio: '',
    specialite: '',
    section: ''
  });

  // Charger les données du profil
  useEffect(() => {
    const loadProfile = async () => {
      if (!currentUser) return;

      try {
        // 🔥 CORRECTION : Toujours utiliser 'users'
        const userRef = doc(db, 'users', currentUser.uid);
        const userSnapshot = await getDoc(userRef);
        
        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          setProfile({
            displayName: userData.displayName || '',
            email: userData.email || '',
            voice: userData.vocalRange || userData.voicePart || '',
            phone: userData.phone || '',
            joinDate: userData.joinDate || '',
            bio: userData.bio || '',
            specialite: userData.specialite || '',
            section: userData.section || ''
          });
        }
      } catch (error) {
        console.error('Erreur chargement profil:', error);
      }
    };

    loadProfile();
  }, [currentUser]);

  const handleSave = async () => {
    if (!currentUser) return;

    setLoading(true);
    setMessage('');

    try {
      // 🔥 CORRECTION : Toujours utiliser 'users'
      const userRef = doc(db, 'users', currentUser.uid);
      
      await updateDoc(userRef, {
        displayName: profile.displayName,
        phone: profile.phone,
        vocalRange: profile.voice,
        voicePart: profile.voice,
        bio: profile.bio,
        specialite: profile.specialite,
        section: profile.section,
        joinDate: profile.joinDate,
        updatedAt: new Date().toISOString()
      });

      // Rafraîchir le profil
      await refreshUserProfile?.();

      setMessage('✅ Profil mis à jour avec succès !');
      setIsEditing(false);
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Erreur sauvegarde profil:', error);
      setMessage('❌ Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">👤 Mon Profil Membre</h3>
        <button
          onClick={() => setIsEditing(!isEditing)}
          disabled={loading}
          className={`py-2 px-4 rounded-md transition-colors ${
            isEditing 
              ? 'bg-gray-500 text-white hover:bg-gray-600' 
              : 'bg-blue-600 text-white hover:bg-blue-700'
          } disabled:opacity-50`}
        >
          {isEditing ? 'Annuler' : 'Modifier'}
        </button>
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded ${
          message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message}
        </div>
      )}

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
                  onChange={(e) => handleInputChange('displayName', e.target.value)}
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
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">L'email ne peut pas être modifié</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone
                </label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+33 1 23 45 67 89"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type de voix
                </label>
                <select
                  value={profile.voice}
                  onChange={(e) => handleInputChange('voice', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Sélectionnez votre voix</option>
                  <option value="soprano">Soprano</option>
                  <option value="mezzo-soprano">Mezzo-Soprano</option>
                  <option value="alto">Alto</option>
                  <option value="contralto">Contralto</option>
                  <option value="tenor">Ténor</option>
                  <option value="baritone">Baryton</option>
                  <option value="bass">Basse</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Section
                </label>
                <select
                  value={profile.section}
                  onChange={(e) => handleInputChange('section', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Sélectionnez votre section</option>
                  <option value="soprano1">Soprano 1</option>
                  <option value="soprano2">Soprano 2</option>
                  <option value="alto1">Alto 1</option>
                  <option value="alto2">Alto 2</option>
                  <option value="tenor1">Ténor 1</option>
                  <option value="tenor2">Ténor 2</option>
                  <option value="bass1">Basse 1</option>
                  <option value="bass2">Basse 2</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Spécialité
                </label>
                <input
                  type="text"
                  value={profile.specialite}
                  onChange={(e) => handleInputChange('specialite', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Chant, Piano, Direction..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date d'adhésion
                </label>
                <input
                  type="date"
                  value={profile.joinDate}
                  onChange={(e) => handleInputChange('joinDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
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
              onChange={(e) => handleInputChange('bio', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Parlez-nous un peu de vous, votre parcours musical, vos passions..."
            />
          </div>

          {/* Boutons d'action */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => setIsEditing(false)}
              disabled={loading}
              className="bg-gray-500 text-white py-2 px-6 rounded-md hover:bg-gray-600 transition-colors disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sauvegarde...
                </>
              ) : (
                '💾 Sauvegarder'
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Vue du profil */}
          <div className="flex items-start space-x-6">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-2xl text-blue-600 font-medium">
                {profile.displayName?.charAt(0) || 'U'}
              </span>
            </div>
            <div className="flex-1">
              <h4 className="text-xl font-bold text-gray-900">{profile.displayName || 'Utilisateur'}</h4>
              <p className="text-gray-600">{profile.email}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  🎵 {profile.voice || 'Non définie'}
                </span>
                {profile.section && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    🎼 {profile.section}
                  </span>
                )}
                {profile.joinDate && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    📅 Membre depuis {new Date(profile.joinDate).toLocaleDateString('fr-FR')}
                  </span>
                )}
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
              {profile.phone && (
                <p className="text-sm text-gray-600 flex items-center">
                  <span className="mr-2">📱</span>
                  {profile.phone}
                </p>
              )}
              {profile.specialite && (
                <p className="text-sm text-gray-600 flex items-center">
                  <span className="mr-2">🎵</span>
                  Spécialité: {profile.specialite}
                </p>
              )}
            </div>
          </div>

          {/* Bio */}
          {profile.bio && (
            <div>
              <h5 className="text-sm font-medium text-gray-900 mb-2">À propos</h5>
              <p className="text-sm text-gray-600 leading-relaxed">
                {profile.bio}
              </p>
            </div>
          )}

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
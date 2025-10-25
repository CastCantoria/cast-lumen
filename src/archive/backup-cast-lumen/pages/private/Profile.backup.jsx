import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/NewAuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import {
  updateProfile,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider
} from 'firebase/auth';

const Profile = () => {
  const { currentUser, userProfile, logout } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useState('profile');

  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    specialite: '',
    bio: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // 🔐 Sécurité : redirection si non connecté
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  // Charger les données actuelles
  useEffect(() => {
    if (userProfile) {
      setFormData(prev => ({
        ...prev,
        displayName: userProfile.displayName || '',
        email: userProfile.email || currentUser?.email || '',
        specialite: userProfile.specialite || '',
        bio: userProfile.bio || ''
      }));
    }
  }, [userProfile, currentUser]);

  // ✅ Mettre à jour le profil
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      if (!currentUser) throw new Error("Utilisateur non connecté.");

      // Mettre à jour le profil Firebase Auth
      if (formData.displayName !== userProfile?.displayName) {
        await updateProfile(currentUser, { displayName: formData.displayName });
      }

      // Mettre à jour Firestore
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        displayName: formData.displayName,
        specialite: formData.specialite,
        bio: formData.bio,
        updatedAt: new Date()
      });

      setMessage('✅ Profil mis à jour avec succès !');
      setTimeout(() => window.location.reload(), 1200);
    } catch (err) {
      console.error('Erreur mise à jour profil:', err);
      setError('❌ Erreur lors de la mise à jour : ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔑 Changer le mot de passe
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      if (formData.newPassword !== formData.confirmPassword)
        throw new Error('Les mots de passe ne correspondent pas.');

      if (formData.newPassword.length < 6)
        throw new Error('Le mot de passe doit contenir au moins 6 caractères.');

      const credential = EmailAuthProvider.credential(
        currentUser.email,
        formData.currentPassword
      );
      await reauthenticateWithCredential(currentUser, credential);
      await updatePassword(currentUser, formData.newPassword);

      setMessage('✅ Mot de passe changé avec succès !');
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (err) {
      console.error('Erreur changement mot de passe:', err);
      if (err.code === 'auth/wrong-password') {
        setError('❌ Mot de passe actuel incorrect.');
      } else if (err.code === 'auth/requires-recent-login') {
        setError('❌ Veuillez vous reconnecter pour changer votre mot de passe.');
      } else {
        setError('❌ ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!currentUser || !userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-gray-600 text-lg font-medium">
          Chargement du profil utilisateur...
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">👤 Mon Profil</h2>

      {message && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6">
          {message}
        </div>
      )}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne gauche */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4 flex space-x-4">
            <button
              onClick={() => setActiveSection('profile')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeSection === 'profile'
                  ? 'bg-green-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              📝 Informations personnelles
            </button>
            <button
              onClick={() => setActiveSection('password')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeSection === 'password'
                  ? 'bg-green-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              🔑 Mot de passe
            </button>
          </div>

          {activeSection === 'profile' && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Informations Personnelles
              </h3>

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="Votre nom complet"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    readOnly
                    className="w-full px-3 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    L'email ne peut pas être modifié.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Spécialité
                  </label>
                  <input
                    type="text"
                    name="specialite"
                    value={formData.specialite}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="Ex: Chant, Piano..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="Parlez-nous de vous..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Mise à jour...' : 'Sauvegarder les modifications'}
                </button>
              </form>
            </div>
          )}

          {activeSection === 'password' && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Changer le mot de passe
              </h3>

              <form onSubmit={handleChangePassword} className="space-y-4">
                <input
                  type="password"
                  name="currentPassword"
                  placeholder="Mot de passe actuel"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="password"
                  name="newPassword"
                  placeholder="Nouveau mot de passe"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirmer le nouveau mot de passe"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Changement...' : 'Changer le mot de passe'}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Colonne droite */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Informations du Compte
            </h3>
            <div className="space-y-3">
              <p>
                <span className="text-sm text-gray-500">Rôle : </span>
                <span className="font-medium capitalize">
                  {userProfile?.role || 'public'}
                </span>
              </p>
              <p>
                <span className="text-sm text-gray-500">Email vérifié : </span>
                {currentUser?.emailVerified ? (
                  <span className="text-green-600">✅ Oui</span>
                ) : (
                  <span className="text-red-600">❌ Non</span>
                )}
              </p>
              <p>
                <span className="text-sm text-gray-500">UID : </span>
                <span className="font-mono text-xs bg-gray-100 p-1 rounded">
                  {currentUser?.uid}
                </span>
              </p>
            </div>
          </div>

          <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-6">
            <h3 className="text-lg font-semibold text-yellow-800 mb-3">
              Actions Rapides
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => setActiveSection('password')}
                className="w-full text-left text-sm text-yellow-700 hover:text-yellow-800 py-2"
              >
                🔑 Changer le mot de passe
              </button>
              <button
                onClick={logout}
                className="w-full text-left text-sm text-red-600 hover:text-red-700 py-2"
              >
                🚪 Se déconnecter
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

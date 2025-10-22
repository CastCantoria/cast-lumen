import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { updateProfile, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';

const Profile = () => {
  const { currentUser, userProfile, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // États du formulaire
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    specialite: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Charger les données actuelles
  useEffect(() => {
    if (userProfile) {
      setFormData(prev => ({
        ...prev,
        displayName: userProfile.displayName || '',
        email: userProfile.email || currentUser?.email || '',
        specialite: userProfile.specialite || ''
      }));
    }
  }, [userProfile, currentUser]);

  // Mettre à jour le profil
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      // Mettre à jour Firebase Auth
      if (formData.displayName !== userProfile?.displayName) {
        await updateProfile(currentUser, {
          displayName: formData.displayName
        });
      }

      // Mettre à jour Firestore
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        displayName: formData.displayName,
        specialite: formData.specialite,
        updatedAt: new Date()
      });

      setMessage('✅ Profil mis à jour avec succès !');
      
      // Recharger la page pour voir les changements
      setTimeout(() => window.location.reload(), 1500);

    } catch (error) {
      console.error('Erreur mise à jour profil:', error);
      setError('❌ Erreur lors de la mise à jour du profil: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Changer le mot de passe
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      if (formData.newPassword !== formData.confirmPassword) {
        throw new Error('Les mots de passe ne correspondent pas');
      }

      if (formData.newPassword.length < 6) {
        throw new Error('Le mot de passe doit contenir au moins 6 caractères');
      }

      // Ré-authentifier l'utilisateur
      const credential = EmailAuthProvider.credential(
        currentUser.email, 
        formData.currentPassword
      );
      
      await reauthenticateWithCredential(currentUser, credential);
      
      // Changer le mot de passe
      await updatePassword(currentUser, formData.newPassword);
      
      setMessage('✅ Mot de passe changé avec succès !');
      
      // Réinitialiser les champs mot de passe
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));

    } catch (error) {
      console.error('Erreur changement mot de passe:', error);
      
      if (error.code === 'auth/wrong-password') {
        setError('❌ Mot de passe actuel incorrect');
      } else if (error.code === 'auth/requires-recent-login') {
        setError('❌ Veuillez vous reconnecter pour changer votre mot de passe');
      } else {
        setError('❌ Erreur lors du changement de mot de passe: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-cast-green">Mon Profil</h1>
          <p className="text-gray-600 mt-2">
            Gérez vos informations personnelles et votre mot de passe
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Informations du compte */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-cast-green mb-4">
              Informations du compte
            </h2>
            
            <div className="space-y-3 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Rôle</label>
                <div className="mt-1 px-3 py-2 bg-gray-100 rounded-lg">
                  <span className="text-cast-green font-medium capitalize">
                    {userProfile?.role || 'Non défini'}
                  </span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">UID</label>
                <div className="mt-1 px-3 py-2 bg-gray-100 rounded-lg font-mono text-sm">
                  {currentUser?.uid}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Date de création</label>
                <div className="mt-1 px-3 py-2 bg-gray-100 rounded-lg">
                  {userProfile?.createdAt ? new Date(userProfile.createdAt.seconds * 1000).toLocaleDateString('fr-FR') : 'Non disponible'}
                </div>
              </div>
            </div>

            <button
              onClick={logout}
              className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors duration-300"
            >
              Se déconnecter
            </button>
          </div>

          {/* Formulaire de modification */}
          <div className="space-y-6">
            {/* Formulaire profil */}
            <form onSubmit={handleUpdateProfile} className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-cast-green mb-4">
                Modifier le profil
              </h2>

              {message && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4">
                  {message}
                </div>
              )}

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1">
                    Nom complet
                  </label>
                  <input
                    id="displayName"
                    name="displayName"
                    type="text"
                    value={formData.displayName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-cast-gold focus:border-cast-gold"
                    placeholder="Votre nom complet"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    L'email ne peut pas être modifié pour le moment
                  </p>
                </div>

                <div>
                  <label htmlFor="specialite" className="block text-sm font-medium text-gray-700 mb-1">
                    Spécialité
                  </label>
                  <input
                    id="specialite"
                    name="specialite"
                    type="text"
                    value={formData.specialite}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-cast-gold focus:border-cast-gold"
                    placeholder="Votre spécialité"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-cast-green text-white py-2 px-4 rounded-lg hover:bg-cast-gold transition-colors duration-300 disabled:opacity-50"
                >
                  {loading ? 'Mise à jour...' : 'Mettre à jour le profil'}
                </button>
              </div>
            </form>

            {/* Formulaire mot de passe */}
            <form onSubmit={handleChangePassword} className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-cast-green mb-4">
                Changer le mot de passe
              </h2>

              <div className="space-y-4">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Mot de passe actuel
                  </label>
                  <input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-cast-gold focus:border-cast-gold"
                    placeholder="Votre mot de passe actuel"
                  />
                </div>

                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Nouveau mot de passe
                  </label>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-cast-gold focus:border-cast-gold"
                    placeholder="Nouveau mot de passe"
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirmer le nouveau mot de passe
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-cast-gold focus:border-cast-gold"
                    placeholder="Confirmer le nouveau mot de passe"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-cast-green text-white py-2 px-4 rounded-lg hover:bg-cast-gold transition-colors duration-300 disabled:opacity-50"
                >
                  {loading ? 'Changement...' : 'Changer le mot de passe'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
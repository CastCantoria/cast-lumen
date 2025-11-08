import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Profile = () => {
  const { currentUser, userProfile, setUserProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    displayName: '',
    email: '',
    userType: 'user',
    role: '',
    vocalRange: '',
    bio: '',
    phone: '',
    address: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [requiresCompletion, setRequiresCompletion] = useState(false);

  // Récupérer le message de redirection
  useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message);
    }
    if (location.state?.requiresProfileCompletion) {
      setRequiresCompletion(true);
    }
  }, [location]);

  // Charger les données du profil
  useEffect(() => {
    if (userProfile) {
      setFormData({
        firstName: userProfile.firstName || '',
        lastName: userProfile.lastName || '',
        displayName: userProfile.displayName || '',
        email: userProfile.email || currentUser?.email || '',
        userType: userProfile.userType || 'user',
        role: userProfile.role || '',
        vocalRange: userProfile.vocalRange || '',
        bio: userProfile.bio || '',
        phone: userProfile.phone || '',
        address: userProfile.address || ''
      });
    }
  }, [userProfile, currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Ici vous devrez implémenter la mise à jour du profil dans Firestore
      // Pour l'instant, simulation
      console.log('Mise à jour du profil:', formData);
      
      // Simuler un délai
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessage('Profil mis à jour avec succès !');
      setRequiresCompletion(false);
      
    } catch (error) {
      setError('Erreur lors de la mise à jour du profil');
      console.error('Erreur profil:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUserTypeChange = (type) => {
    setFormData(prev => ({
      ...prev,
      userType: type,
      role: type === 'user' ? '' : prev.role
    }));
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Non connecté</h2>
          <p>Veuillez vous connecter pour accéder à votre profil.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête avec message */}
        {(message || requiresCompletion) && (
          <div className="mb-8">
            {message && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4">
                {message}
              </div>
            )}
            {requiresCompletion && (
              <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg">
                <strong>Complétez votre profil</strong> pour finaliser votre inscription.
              </div>
            )}
          </div>
        )}

        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* En-tête du profil */}
          <div className="bg-gradient-to-r from-cast-green to-cast-gold px-6 py-8">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-2xl font-bold text-cast-green">
                {userProfile?.displayName?.charAt(0) || currentUser.email?.charAt(0) || 'U'}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {userProfile?.displayName || 'Mon Profil'}
                </h1>
                <p className="text-green-100">
                  {userProfile?.userType === 'member' ? '🎵 Membre Choriste' : '👤 Utilisateur'}
                  {userProfile?.role && ` • ${userProfile.role}`}
                </p>
              </div>
            </div>
          </div>

          {/* Formulaire de profil */}
          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Type d'utilisateur */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Type de compte</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => handleUserTypeChange('user')}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    formData.userType === 'user' 
                      ? 'border-cast-green bg-green-50 text-cast-green' 
                      : 'border-gray-300 bg-white text-gray-700 hover:border-cast-gold'
                  }`}
                >
                  <div className="text-lg font-semibold">👤 Utilisateur</div>
                  <div className="text-sm mt-1">Commenter et participer au blog</div>
                </button>
                
                <button
                  type="button"
                  onClick={() => handleUserTypeChange('member')}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    formData.userType === 'member' 
                      ? 'border-cast-green bg-green-50 text-cast-green' 
                      : 'border-gray-300 bg-white text-gray-700 hover:border-cast-gold'
                  }`}
                >
                  <div className="text-lg font-semibold">🎵 Membre Choriste</div>
                  <div className="text-sm mt-1">Participer aux concerts et répétitions</div>
                </button>
              </div>
            </div>

            {/* Informations personnelles */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Informations personnelles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    Prénom *
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-cast-gold focus:border-cast-gold"
                  />
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Nom *
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-cast-gold focus:border-cast-gold"
                  />
                </div>

                <div>
                  <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1">
                    Nom d'affichage
                  </label>
                  <input
                    id="displayName"
                    name="displayName"
                    type="text"
                    value={formData.displayName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-cast-gold focus:border-cast-gold"
                    placeholder="Comment souhaitez-vous être appelé ?"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-cast-gold focus:border-cast-gold"
                  />
                </div>
              </div>
            </div>

            {/* Informations pour les membres */}
            {formData.userType === 'member' && (
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Informations choriste</h3>
                <div className="space-y-6">
                  <div>
                    <label htmlFor="vocalRange" className="block text-sm font-medium text-gray-700 mb-1">
                      Rôle vocal *
                    </label>
                    <select
                      id="vocalRange"
                      name="vocalRange"
                      required
                      value={formData.vocalRange}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-cast-gold focus:border-cast-gold"
                    >
                      <option value="">Sélectionnez votre voix</option>
                      <option value="Soprano">Soprano</option>
                      <option value="Alto">Alto</option>
                      <option value="Ténor">Ténor</option>
                      <option value="Basse">Basse</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                      Expérience musicale
                    </label>
                    <textarea
                      id="bio"
                      name="bio"
                      rows={4}
                      value={formData.bio}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-cast-gold focus:border-cast-gold"
                      placeholder="Parlez-nous de votre expérience musicale, des instruments que vous jouez, etc."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Informations de contact */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Informations de contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Téléphone
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-cast-gold focus:border-cast-gold"
                  />
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Adresse
                  </label>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-cast-gold focus:border-cast-gold"
                    placeholder="Ville, région"
                  />
                </div>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Retour au tableau de bord
              </button>
              
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-cast-green text-white rounded-lg hover:bg-cast-gold hover:text-cast-green transition-colors disabled:opacity-50"
              >
                {loading ? 'Mise à jour...' : 'Mettre à jour le profil'}
              </button>
            </div>
          </form>
        </div>

        {/* Informations du compte */}
        <div className="mt-8 bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Informations du compte</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">ID utilisateur:</span>
              <p className="text-gray-600 truncate">{currentUser.uid}</p>
            </div>
            <div>
              <span className="font-medium">Date de création:</span>
              <p className="text-gray-600">
                {userProfile?.createdAt ? new Date(userProfile.createdAt).toLocaleDateString('fr-FR') : 'Non disponible'}
              </p>
            </div>
            <div>
              <span className="font-medium">Statut:</span>
              <p className="text-gray-600 capitalize">
                {userProfile?.status === 'pending' ? '⏳ En attente' : '✅ Actif'}
              </p>
            </div>
            <div>
              <span className="font-medium">Email vérifié:</span>
              <p className="text-gray-600">
                {currentUser.emailVerified ? '✅ Oui' : '❌ Non'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
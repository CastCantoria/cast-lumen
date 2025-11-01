import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { doc, updateDoc, getDoc, collection } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';
import {
  updateProfile as updateAuthProfile,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider
} from 'firebase/auth';

const Profile = () => {
  const { currentUser, userProfile, logout, refreshUserProfile } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useState('profile');
  const [userRole, setUserRole] = useState('user');

  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    phone: '',
    specialite: '',
    bio: '',
    voicePart: '',
    section: '',
    joinDate: '',
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
    const loadUserData = async () => {
      if (!currentUser) return;

      try {
          setLoading(true);
          setError('');

          // Vérifier la collection users
          const userDocRef = doc(collection(db, 'users'), currentUser.uid);
          const userSnapshot = await getDoc(userDocRef);
      
          if (userSnapshot.exists()) {
            const userData = userSnapshot.data();
            // S'assurer que les champs requis existent
            const cleanedData = {
              displayName: userData.displayName || currentUser.displayName || '',
              email: userData.email || currentUser.email || '',
              phone: userData.phone || '',
              specialite: userData.specialite || '',
              bio: userData.bio || '',
              voicePart: userData.voicePart || '',
              section: userData.section || '',
              joinDate: userData.joinDate || new Date().toISOString()
            };
            setUserRole(userData.role || 'user');
            populateForm(cleanedData);
        } else {
            // Créer un profil par défaut si aucun n'existe
            const defaultProfile = {
              displayName: currentUser.displayName || '',
              email: currentUser.email || '',
              phone: '',
              specialite: '',
              bio: '',
              voicePart: '',
              section: '',
              joinDate: new Date().toISOString(),
              role: 'user'
            };
            await updateDoc(userDocRef, defaultProfile);
            setUserRole('user');
            populateForm(defaultProfile);
        }
      } catch (err) {
          console.error('Erreur lors du chargement du profil:', err);
          setError(
            `Impossible de charger le profil. Erreur: ${
              err.message || 'Erreur inconnue'
            }. Veuillez réessayer plus tard.`
          );
        } finally {
          setLoading(false);
      }
    };

    loadUserData();
  }, [currentUser, userProfile]);

  const populateForm = (userData) => {
    setFormData(prev => ({
      ...prev,
      displayName: userData.displayName || '',
      email: userData.email || currentUser?.email || '',
      phone: userData.phone || '',
      specialite: userData.specialite || '',
      bio: userData.bio || '',
      voicePart: userData.voicePart || '',
      section: userData.section || '',
      joinDate: userData.joinDate || ''
    }));
  };

  // ✅ Mettre à jour le profil
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      if (!currentUser) throw new Error("Utilisateur non connecté.");

      // Mettre à jour le profil Firebase Auth
      if (formData.displayName !== currentUser.displayName) {
        await updateAuthProfile(currentUser, { 
          displayName: formData.displayName 
        });
      }

      // Déterminer la collection en fonction du rôle
      const collectionName = userRole === 'member' ? 'members' : 'users';
      const userRef = doc(db, collectionName, currentUser.uid);

      // Préparer les données de mise à jour
      const updateData = {
        displayName: formData.displayName.trim(),
        phone: formData.phone.trim(),
        specialite: formData.specialite.trim(),
        bio: formData.bio.trim(),
        updatedAt: new Date(),
        lastModifiedBy: currentUser.uid
      };

      // Ajouter les champs spécifiques aux membres
      if (userRole === 'member') {
        updateData.voicePart = formData.voicePart;
        updateData.section = formData.section;
        updateData.joinDate = formData.joinDate;
      }

      // Mettre à jour Firestore
      await updateDoc(userRef, updateData);

      // Rafraîchir les données utilisateur
      await refreshUserProfile?.();

      setMessage('✅ Profil mis à jour avec succès !');
      
      // Recharger après un délai
      setTimeout(() => {
        window.location.reload();
      }, 1500);

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
      if (!formData.currentPassword) {
        throw new Error('Le mot de passe actuel est requis.');
      }

      if (formData.newPassword !== formData.confirmPassword) {
        throw new Error('Les mots de passe ne correspondent pas.');
      }

      if (formData.newPassword.length < 6) {
        throw new Error('Le mot de passe doit contenir au moins 6 caractères.');
      }

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

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-gray-600 text-lg font-medium">
            Chargement du profil utilisateur...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            👤 Mon Profil
          </h1>
          <p className="text-lg text-gray-600">
            Gérez vos informations personnelles et vos paramètres de compte
          </p>
        </div>

        {/* Messages d'alerte */}
        {message && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-xl mb-6 shadow-sm">
            <div className="flex items-center">
              <span className="text-green-500 text-lg mr-3">✅</span>
              <span className="font-medium">{message}</span>
            </div>
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-6 shadow-sm">
            <div className="flex items-center">
              <span className="text-red-500 text-lg mr-3">❌</span>
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Colonne gauche - Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Navigation
              </h3>
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveSection('profile')}
                  className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    activeSection === 'profile'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                  }`}
                >
                  📝 Informations personnelles
                </button>
                <button
                  onClick={() => setActiveSection('password')}
                  className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    activeSection === 'password'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                  }`}
                >
                  🔑 Mot de passe
                </button>
                <Link
                  to="/profile/edit"
                  className="block w-full text-left px-4 py-3 rounded-xl font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-all duration-200"
                >
                  ✏️ Éditer le profil complet
                </Link>
              </nav>

              {/* Informations du compte */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="text-md font-semibold text-gray-900 mb-3">
                  Informations du Compte
                </h4>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-500">Rôle : </span>
                    <span className="font-medium capitalize text-blue-600">
                      {userRole || 'user'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Email vérifié : </span>
                    {currentUser?.emailVerified ? (
                      <span className="text-green-600 font-medium">✅ Oui</span>
                    ) : (
                      <span className="text-red-600 font-medium">❌ Non</span>
                    )}
                  </div>
                  <div>
                    <span className="text-gray-500">UID : </span>
                    <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded text-gray-700">
                      {currentUser?.uid}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions rapides */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-md font-semibold text-gray-900 mb-3">
                  Actions Rapides
                </h4>
                <div className="space-y-2">
                  <button
                    onClick={() => setActiveSection('password')}
                    className="w-full text-left text-sm text-blue-600 hover:text-blue-700 py-2 px-3 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    🔑 Changer le mot de passe
                  </button>
                  <button
                    onClick={logout}
                    className="w-full text-left text-sm text-red-600 hover:text-red-700 py-2 px-3 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    🚪 Se déconnecter
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Colonne droite - Contenu */}
          <div className="lg:col-span-3">
            {activeSection === 'profile' && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Informations Personnelles
                  </h2>
                  <Link
                    to="/profile/edit"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    ✏️ Éditer complet
                  </Link>
                </div>

                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom complet *
                      </label>
                      <input
                        type="text"
                        name="displayName"
                        value={formData.displayName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="Votre nom complet"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        readOnly
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 cursor-not-allowed"
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        L'email ne peut pas être modifié.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Téléphone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="+33 1 23 45 67 89"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Spécialité
                      </label>
                      <input
                        type="text"
                        name="specialite"
                        value={formData.specialite}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="Ex: Chant, Piano, Direction..."
                      />
                    </div>
                  </div>

                  {/* Champs spécifiques aux membres */}
                  {userRole === 'member' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-200">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Voix *
                        </label>
                        <select
                          name="voicePart"
                          value={formData.voicePart}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          required
                        >
                          <option value="">Sélectionnez votre voix</option>
                          <option value="soprano">Soprano</option>
                          <option value="alto">Alto</option>
                          <option value="tenor">Ténor</option>
                          <option value="basse">Basse</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Section
                        </label>
                        <select
                          name="section"
                          value={formData.section}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        >
                          <option value="">Sélectionnez votre section</option>
                          <option value="soprano1">Soprano 1</option>
                          <option value="soprano2">Soprano 2</option>
                          <option value="alto1">Alto 1</option>
                          <option value="alto2">Alto 2</option>
                          <option value="tenor1">Ténor 1</option>
                          <option value="tenor2">Ténor 2</option>
                          <option value="basse1">Basse 1</option>
                          <option value="basse2">Basse 2</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date d'adhésion
                        </label>
                        <input
                          type="date"
                          name="joinDate"
                          value={formData.joinDate}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows="4"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="Parlez-nous de vous, de votre parcours musical, de vos passions..."
                    />
                  </div>

                  <div className="flex justify-end pt-4 border-t border-gray-200">
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-blue-600 text-white py-3 px-8 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm"
                    >
                      {loading ? (
                        <span className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Mise à jour...
                        </span>
                      ) : (
                        '💾 Sauvegarder les modifications'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeSection === 'password' && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Changer le mot de passe
                </h2>

                <form onSubmit={handleChangePassword} className="space-y-6 max-w-2xl">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mot de passe actuel *
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      placeholder="Entrez votre mot de passe actuel"
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nouveau mot de passe *
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      placeholder="Au moins 6 caractères"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      required
                      minLength="6"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirmer le nouveau mot de passe *
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirmez votre nouveau mot de passe"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      required
                    />
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-blue-600 text-white py-3 px-8 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm"
                    >
                      {loading ? (
                        <span className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Changement...
                        </span>
                      ) : (
                        '🔑 Changer le mot de passe'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
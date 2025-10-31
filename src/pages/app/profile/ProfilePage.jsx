import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../../config/firebase';
import { updateProfile, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';

const ProfilePage = () => {
  const { userProfile, currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [specialite, setSpecialite] = useState('');
  const [bio, setBio] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdMessage, setPwdMessage] = useState(null);
  const [pwdError, setPwdError] = useState(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (userProfile) {
      setDisplayName(userProfile.displayName || '');
      setPhotoURL(userProfile.photoURL || '');
      setSpecialite(userProfile.specialite || '');
      setBio(userProfile.bio || '');
    }
  }, [userProfile]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!userProfile || !userProfile.uid) return;
    setSaving(true);
    setMessage(null);

    try {
      const userRef = doc(db, 'users', userProfile.uid);
      await updateDoc(userRef, {
        displayName: displayName || userProfile.email.split('@')[0],
        photoURL: photoURL || null,
        specialite: specialite || null,
        bio: bio || null,
        updatedAt: serverTimestamp()
      });

      // Mettre à jour aussi le profil Firebase Auth si nécessaire
      if (currentUser && displayName && currentUser.displayName !== displayName) {
        try {
          await updateProfile(currentUser, { displayName });
        } catch (err) {
          console.warn('Impossible de mettre à jour displayName dans Firebase Auth:', err);
        }
      }

      setMessage({ type: 'success', text: 'Profil mis à jour avec succès.' });

      // Rafraîchir l'application pour recharger le contexte utilisateur.
      setTimeout(() => {
        window.location.reload();
      }, 900);
    } catch (err) {
      console.error('Erreur mise à jour profil:', err);
      setMessage({ type: 'error', text: 'Erreur lors de la sauvegarde. Réessayez.' });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwdError(null);
    setPwdMessage(null);
    if (!currentUser) return setPwdError('Utilisateur non connecté');

    if (newPassword !== confirmPassword) return setPwdError('Les mots de passe ne correspondent pas');
    if (newPassword.length < 6) return setPwdError('Le mot de passe doit contenir au moins 6 caractères');

    setPwdLoading(true);
    try {
      const cred = EmailAuthProvider.credential(currentUser.email, currentPassword);
      await reauthenticateWithCredential(currentUser, cred);
      await updatePassword(currentUser, newPassword);
      setPwdMessage('Mot de passe changé avec succès.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error('Erreur changement mot de passe:', err);
      if (err.code === 'auth/wrong-password') setPwdError('Mot de passe actuel incorrect');
      else if (err.code === 'auth/requires-recent-login') setPwdError('Veuillez vous reconnecter puis réessayer');
      else setPwdError(err.message || 'Erreur lors du changement de mot de passe');
    } finally {
      setPwdLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Mon profil</h1>

        <div className="bg-white rounded-lg shadow p-6">
          {!userProfile ? (
            <p>Chargement du profil...</p>
          ) : (
            <form onSubmit={handleSave} className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                  {photoURL ? (
                    // eslint-disable-next-line jsx-a11y/img-redundant-alt
                    <img src={photoURL} alt="photo" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-gray-400">Aucune photo</span>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{userProfile.email}</p>
                  <p className="text-sm text-gray-500">Rôle: {userProfile.role}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom affiché</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full border border-gray-200 rounded px-3 py-2"
                  placeholder="Nom affiché"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL de la photo</label>
                <input
                  type="url"
                  value={photoURL}
                  onChange={(e) => setPhotoURL(e.target.value)}
                  className="w-full border border-gray-200 rounded px-3 py-2"
                  placeholder="https://..."
                />
              </div>

              {message && (
                <div className={`p-3 rounded ${message.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>
                  {message.text}
                </div>
              )}

              <div className="flex items-center space-x-3">
                <button
                  type="submit"
                  disabled={saving}
                  className={`px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {saving ? 'Enregistrement...' : 'Enregistrer'}
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="px-4 py-2 rounded border border-gray-200 bg-white"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={() => logout && logout()}
                  className="px-4 py-2 rounded border border-red-200 text-red-600 bg-white hover:bg-red-50"
                >
                  Se déconnecter
                </button>
              </div>
            </form>
          )}
        </div>
        {/* Section changement de mot de passe */}
        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">Changer le mot de passe</h2>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <input
              type="password"
              placeholder="Mot de passe actuel"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
            <input
              type="password"
              placeholder="Nouveau mot de passe"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
            <input
              type="password"
              placeholder="Confirmer le nouveau mot de passe"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />

            {pwdError && <div className="text-red-700 bg-red-50 p-2 rounded">{pwdError}</div>}
            {pwdMessage && <div className="text-green-700 bg-green-50 p-2 rounded">{pwdMessage}</div>}

            <div className="flex items-center gap-3">
              <button type="submit" disabled={pwdLoading} className={`px-4 py-2 rounded bg-indigo-600 text-white ${pwdLoading ? 'opacity-70' : ''}`}>
                {pwdLoading ? 'Traitement...' : 'Changer le mot de passe'}
              </button>
              <button type="button" onClick={() => { setCurrentPassword(''); setNewPassword(''); setConfirmPassword(''); setPwdError(null); setPwdMessage(null); }} className="px-4 py-2 rounded border">Annuler</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
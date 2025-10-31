import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import './EditProfile.css';

const EditProfile = () => {
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [profileNotFound, setProfileNotFound] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [userRole, setUserRole] = useState('user');
  const [currentUserId, setCurrentUserId] = useState('');
  const [currentUserEmail, setCurrentUserEmail] = useState('');

  const [formData, setFormData] = useState({
    displayName: '',
    phone: '',
    voicePart: '',
    section: '',
    joinDate: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    loadCurrentUserProfile();
  }, []);

  const loadCurrentUserProfile = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        navigate('/login');
        return;
      }

      setCurrentUserId(user.uid);
      setCurrentUserEmail(user.email || '');
      setLoading(true);

      // Chercher d'abord dans 'users'
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);
      
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        setUserRole(userData.role || 'user');
        populateForm(userData);
      } else {
        // Chercher dans 'members'
        const memberDocRef = doc(db, 'members', user.uid);
        const memberDocSnap = await getDoc(memberDocRef);
        
        if (memberDocSnap.exists()) {
          const memberData = memberDocSnap.data();
          setUserRole('member');
          populateForm(memberData);
        } else {
          setProfileNotFound(true);
        }
      }
    } catch (error) {
      console.error('Erreur chargement profil:', error);
      setErrorMessage('Erreur lors du chargement du profil');
    } finally {
      setLoading(false);
    }
  };

  const populateForm = (userData) => {
    setFormData({
      displayName: userData.displayName || '',
      phone: userData.phone || '',
      voicePart: userData.voicePart || '',
      section: userData.section || '',
      joinDate: userData.joinDate || ''
    });
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('Utilisateur non connecté');
      }

      // Déterminer la collection en fonction du rôle
      const collectionName = userRole === 'member' ? 'members' : 'users';
      const userRef = doc(db, collectionName, user.uid);

      // Préparer les données de mise à jour
      const updateData = {
        displayName: formData.displayName.trim(),
        phone: formData.phone.trim(),
        updatedAt: new Date(),
        lastModifiedBy: user.uid
      };

      // Ajouter les champs spécifiques aux membres
      if (userRole === 'member') {
        updateData.voicePart = formData.voicePart;
        updateData.section = formData.section;
        updateData.joinDate = formData.joinDate;
      }

      // Vérifier si le document existe avant de mettre à jour
      const docSnap = await getDoc(userRef);
      if (!docSnap.exists()) {
        // Créer le document s'il n'existe pas
        await setDoc(userRef, {
          ...updateData,
          email: user.email,
          uid: user.uid,
          createdAt: new Date(),
          role: userRole,
          isActive: true
        });
      } else {
        // Mettre à jour le document existant
        await updateDoc(userRef, updateData);
      }

      setSuccessMessage('✅ Profil mis à jour avec succès!');
      
      // Rediriger après un délai
      setTimeout(() => {
        navigate('/profile');
      }, 1500);

    } catch (error) {
      console.error('Erreur mise à jour profil:', error);
      setErrorMessage(`❌ Erreur: ${error.message}`);
    } finally {
      setUpdateLoading(false);
    }
  };

  const createProfile = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      // Par défaut, créer dans 'users'
      const userRef = doc(db, 'users', user.uid);
      
      await setDoc(userRef, {
        displayName: user.displayName || user.email?.split('@')[0] || 'Utilisateur',
        email: user.email,
        uid: user.uid,
        role: 'user',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      setProfileNotFound(false);
      await loadCurrentUserProfile();
      
    } catch (error) {
      console.error('Erreur création profil:', error);
      setErrorMessage('Erreur lors de la création du profil');
    }
  };

  if (loading) {
    return (
      <div className="edit-profile">
        <div className="container">
          <div className="loading">
            <p>Chargement de votre profil...</p>
          </div>
        </div>
      </div>
    );
  }

  if (profileNotFound) {
    return (
      <div className="edit-profile">
        <div className="container">
          <div className="error-state">
            <h2>Profil non trouvé</h2>
            <p>Votre profil n'existe pas dans la base de données.</p>
            <button onClick={createProfile} className="btn btn-primary">
              Créer mon profil
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-profile">
      <div className="container">
        {/* En-tête */}
        <div className="profile-header">
          <h1>Modifier mon profil</h1>
          <p className="user-info">UID: {currentUserId}</p>
        </div>

        {/* Formulaire */}
        <div className="profile-form">
          <form onSubmit={updateProfile}>
            {/* Messages */}
            {successMessage && (
              <div className="alert alert-success">
                {successMessage}
              </div>
            )}
            {errorMessage && (
              <div className="alert alert-error">
                {errorMessage}
              </div>
            )}

            {/* Informations de base */}
            <div className="form-section">
              <h2>Informations personnelles</h2>
              
              <div className="form-group">
                <label htmlFor="displayName">Nom d'affichage *</label>
                <input
                  id="displayName"
                  value={formData.displayName}
                  onChange={handleInputChange}
                  type="text"
                  required
                  placeholder="Votre nom complet"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  value={currentUserEmail}
                  type="email"
                  disabled
                  className="disabled-field"
                />
                <small className="text-muted">L'email est géré via l'authentification</small>
              </div>

              <div className="form-group">
                <label htmlFor="phone">Téléphone</label>
                <input
                  id="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  type="tel"
                  placeholder="+33 1 23 45 67 89"
                />
              </div>
            </div>

            {/* Informations chorale (si membre) */}
            {userRole === 'member' && (
              <div className="form-section">
                <h2>Informations chorales</h2>
                
                <div className="form-group">
                  <label htmlFor="voicePart">Voix *</label>
                  <select 
                    id="voicePart" 
                    value={formData.voicePart} 
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Sélectionnez votre voix</option>
                    <option value="soprano">Soprano</option>
                    <option value="alto">Alto</option>
                    <option value="tenor">Ténor</option>
                    <option value="basse">Basse</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="section">Section</label>
                  <select 
                    id="section" 
                    value={formData.section} 
                    onChange={handleInputChange}
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

                <div className="form-group">
                  <label htmlFor="joinDate">Date d'adhésion</label>
                  <input
                    id="joinDate"
                    value={formData.joinDate}
                    onChange={handleInputChange}
                    type="date"
                  />
                </div>
              </div>
            )}

            {/* Boutons d'action */}
            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/profile')}
              >
                Annuler
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={updateLoading}
              >
                {updateLoading ? 'Mise à jour...' : '💾 Enregistrer les modifications'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
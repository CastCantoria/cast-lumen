import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from "../lib/firebase";

const FixSuperAdmin = () => {
  const { currentUser, userProfile } = useAuth();
  const [fixing, setFixing] = useState(false);
  const [message, setMessage] = useState('');

  const fixSuperAdminRole = async () => {
    if (!currentUser) return;
    
    setFixing(true);
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      
      // Vérifier d'abord si l'utilisateur existe
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        setMessage('❌ Utilisateur non trouvé dans Firestore');
        return;
      }

      // Mettre à jour le rôle
      await updateDoc(userRef, {
        role: 'super-admin',
        permissions: ['all'],
        displayName: 'Administrateur CANTORIA',
        updatedAt: new Date()
      });

      setMessage('✅ Rôle super-admin appliqué ! Redémarrage...');
      
      // Redémarrer après 2 secondes
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (error) {
      console.error('Erreur:', error);
      setMessage('❌ Erreur: ' + error.message);
    } finally {
      setFixing(false);
    }
  };

  // Afficher seulement si l'utilisateur est le super-admin mais a le mauvais rôle
  if (!currentUser || currentUser.email !== 'ad-castcantoria@outlook.fr') {
    return null;
  }

  if (userProfile?.role === 'super-admin') {
    return (
      <div className="fixed bottom-4 right-4 bg-green-600 text-white p-4 rounded-lg shadow-lg z-50">
        <p>✅ Rôle super-admin correct</p>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-red-600 text-white p-4 rounded-lg shadow-lg z-50 max-w-md">
      <p className="font-bold">⚠️ Rôle Incorrect</p>
      <p className="text-sm mt-1">
        Email: {currentUser.email}<br/>
        Rôle actuel: <strong>{userProfile?.role || 'non défini'}</strong><br/>
        Rôle attendu: <strong>super-admin</strong>
      </p>
      <button 
        onClick={fixSuperAdminRole}
        disabled={fixing}
        className="mt-3 bg-white text-red-600 px-4 py-2 rounded font-bold disabled:opacity-50 w-full"
      >
        {fixing ? '🔄 Correction...' : '🛠️ Corriger mon Rôle'}
      </button>
      {message && <p className="mt-2 text-sm">{message}</p>}
    </div>
  );
};

export default FixSuperAdmin;
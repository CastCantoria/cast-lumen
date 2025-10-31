import React, { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, doc, query, where } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuthorization } from '../../hooks/useAuthorization';

const UserStatusManager = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isSuperAdmin, isAdmin } = useAuthorization();

  const loadUsers = async () => {
    try {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersData = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersData);
    } catch (error) {
      console.error('Erreur chargement utilisateurs:', error);
    } finally {
      setLoading(false);
    }
  };

  const activateUser = async (userId) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        isActive: true,
        status: 'active',
        lastActive: new Date(),
        updatedAt: new Date()
      });
      
      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, isActive: true, status: 'active' }
          : user
      ));
      
      console.log(`✅ Utilisateur ${userId} activé`);
    } catch (error) {
      console.error('Erreur activation:', error);
    }
  };

  const activateAllUsers = async () => {
    try {
      setLoading(true);
      const updates = users.map(user => 
        updateDoc(doc(db, 'users', user.id), {
          isActive: true,
          status: 'active',
          lastActive: new Date(),
          updatedAt: new Date()
        })
      );
      
      await Promise.all(updates);
      await loadUsers(); // Recharger les données
      console.log(`✅ Tous les utilisateurs activés`);
    } catch (error) {
      console.error('Erreur activation massive:', error);
    }
  };

  const deactivateUser = async (userId) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        isActive: false,
        status: 'inactive',
        updatedAt: new Date()
      });
      
      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, isActive: false, status: 'inactive' }
          : user
      ));
    } catch (error) {
      console.error('Erreur désactivation:', error);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  if (!isSuperAdmin && !isAdmin) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-red-800 font-semibold">Accès refusé</h3>
        <p className="text-red-600">Vous n'avez pas les permissions nécessaires.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">Chargement des utilisateurs...</div>
      </div>
    );
  }

  const activeUsers = users.filter(user => user.isActive);
  const inactiveUsers = users.filter(user => !user.isActive);

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Gestion des Statuts Utilisateurs</h2>
        <div className="flex gap-4">
          <button
            onClick={activateAllUsers}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            ✅ Activer Tous
          </button>
          <button
            onClick={loadUsers}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            🔄 Actualiser
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="text-2xl font-bold text-blue-800">{users.length}</div>
          <div className="text-blue-600">Total Utilisateurs</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="text-2xl font-bold text-green-800">{activeUsers.length}</div>
          <div className="text-green-600">Utilisateurs Actifs</div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <div className="text-2xl font-bold text-red-800">{inactiveUsers.length}</div>
          <div className="text-red-600">Utilisateurs Inactifs</div>
        </div>
      </div>

      {/* Liste des utilisateurs */}
      <div className="space-y-4">
        {users.map(user => (
          <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="Avatar" className="w-10 h-10 rounded-full" />
                  ) : (
                    <span className="font-semibold text-gray-600">
                      {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                    </span>
                  )}
                </div>
                <div>
                  <div className="font-semibold">{user.displayName || 'Non renseigné'}</div>
                  <div className="text-sm text-gray-600">{user.email}</div>
                  <div className="flex gap-2 mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.isActive ? 'Actif' : 'Inactif'}
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      {user.role || 'user'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              {!user.isActive ? (
                <button
                  onClick={() => activateUser(user.id)}
                  className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                >
                  Activer
                </button>
              ) : (
                <button
                  onClick={() => deactivateUser(user.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                >
                  Désactiver
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserStatusManager;
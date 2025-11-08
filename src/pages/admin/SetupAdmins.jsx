import React, { useState } from 'react';
import { auth, db } from '../../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const SetupAdmins = () => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState('');
  const [results, setResults] = useState([]);

  const adminAccounts = [
    {
      email: 'ad-castcantoria@outlook.fr',
      password: 'CastCantoria2024!',
      displayName: 'Super Administrateur CAST',
      role: 'super-admin',
      mission: 'Supervision générale de la plateforme'
    },
    {
      email: 'livaramanalinarivo16@gmail.com',
      password: 'CastCantoria2024!',
      displayName: 'Liva Ramanalinarivo',
      role: 'admin',
      mission: 'Président fondateur'
    },
    {
      email: 'eric.rasamimanana@gmail.com',
      password: 'CastCantoria2024!',
      displayName: 'Eric Rasamimanana',
      role: 'admin',
      mission: 'Programmation Artistique'
    },
    {
      email: 'tena.solution@gmail.com',
      password: 'CastCantoria2024!',
      displayName: 'Sandiniaina Alain RAMAROSON',
      role: 'admin',
      mission: 'Communication & Contenu'
    },
    {
      email: 'julesrandriamanantsoa@gmail.com',
      password: 'CastCantoria2024!',
      displayName: 'Jules Randriamanantsoa',
      role: 'admin',
      mission: 'Gestion des Membres'
    },
    {
      email: 'positifaid@live.fr',
      password: 'CastCantoria2024!',
      displayName: 'Tovoniaina Rahendrison',
      role: 'admin',
      mission: 'Support Technique'
    }
  ];

  const createAdminAccount = async (account) => {
    try {
      setProgress(`Création de ${account.email}...`);
      
      // Créer l'utilisateur avec Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        account.email, 
        account.password
      );
      
      const user = userCredential.user;
      
      // Créer le profil dans Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: account.email,
        displayName: account.displayName,
        firstName: account.displayName.split(' ')[0],
        lastName: account.displayName.split(' ').slice(1).join(' '),
        userType: 'admin',
        role: account.role,
        mission: account.mission,
        status: 'active',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastLogin: null
      });
      
      return { success: true, email: account.email, message: '✅ Compte créé avec succès' };
      
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        return { success: true, email: account.email, message: 'ℹ️ Compte déjà existant' };
      } else {
        return { success: false, email: account.email, message: `❌ Erreur: ${error.message}` };
      }
    }
  };

  const handleCreateAdmins = async () => {
    setLoading(true);
    setResults([]);
    
    const newResults = [];
    
    for (const account of adminAccounts) {
      const result = await createAdminAccount(account);
      newResults.push(result);
      setResults([...newResults]);
      
      // Petit délai pour éviter les rate limits
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    setLoading(false);
    setProgress('Terminé !');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Configuration des Comptes Administrateurs
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Cette page permet de créer tous les comptes administrateurs de la plateforme C.A.S.T.
          </p>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800 font-medium">
              ⚠️ Cette page est temporaire et devrait être supprimée après utilisation.
            </p>
          </div>
        </div>

        {/* Liste des comptes à créer */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Comptes Administrateurs à Créer
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {adminAccounts.map((account, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    account.role === 'super-admin' 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {account.role === 'super-admin' ? '👑 Super Admin' : '⚙️ Admin'}
                  </span>
                </div>
                <p className="font-medium text-gray-900">{account.displayName}</p>
                <p className="text-sm text-gray-600">{account.email}</p>
                <p className="text-xs text-gray-500 mt-1">{account.mission}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Mot de passe: {account.password}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bouton de création */}
        <div className="text-center mb-8">
          <button
            onClick={handleCreateAdmins}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200"
          >
            {loading ? 'Création en cours...' : 'Créer tous les comptes administrateurs'}
          </button>
        </div>

        {/* Progression */}
        {loading && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-blue-800 font-medium">{progress}</p>
          </div>
        )}

        {/* Résultats */}
        {results.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Résultats de la création
            </h2>
            <div className="space-y-3">
              {results.map((result, index) => (
                <div 
                  key={index} 
                  className={`p-3 rounded-lg border ${
                    result.success 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{result.email}</span>
                    <span className={`text-sm ${
                      result.success ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {result.message}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            {!loading && results.some(r => r.success) && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 font-medium text-center">
                  ✅ Comptes créés avec succès ! Vous pouvez maintenant vous connecter.
                </p>
                <div className="text-center mt-4">
                  <a 
                    href="/login" 
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Aller à la page de connexion
                  </a>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Instructions d'utilisation
          </h3>
          <ul className="text-gray-600 space-y-2">
            <li>• Cliquez sur le bouton "Créer tous les comptes administrateurs"</li>
            <li>• Attendez que tous les comptes soient créés (environ 30 secondes)</li>
            <li>• Une fois terminé, vous pourrez vous connecter avec n'importe quel compte</li>
            <li>• Supprimez cette page après utilisation pour des raisons de sécurité</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SetupAdmins;
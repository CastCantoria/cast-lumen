#!/bin/bash

# Script de création de la structure React avec Firebase Auth
# À exécuter à la racine du projet (où se trouve le dossier src)

echo "🎯 Création de la structure React/Firebase..."

# Création des dossiers
mkdir -p src/contexts
mkdir -p src/components/auth
mkdir -p src/components/ui
mkdir -p src/components/dashboard
mkdir -p src/components/layout
mkdir -p src/pages/auth
mkdir -p src/pages/dashboard/user
mkdir -p src/pages/dashboard/member
mkdir -p src/pages/dashboard/admin
mkdir -p src/pages/dashboard/super-admin
mkdir -p src/pages/public

echo "✅ Dossiers créés"

# 1. contexts/AuthContext.jsx
cat > src/contexts/AuthContext.jsx << 'EOF'
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  console.log('🔄 Initialisation AuthProvider...');

  const createDefaultProfile = (user) => {
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || user.email.split('@')[0],
      role: 'user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  };

  useEffect(() => {
    console.log('🔍 AuthProvider - Début écoute Firebase Auth');
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('👤 AuthStateChanged - User:', user?.email);
      
      if (user) {
        console.log('✅ Utilisateur Firebase trouvé:', user.email);
        setCurrentUser(user);
        
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            console.log('✅ Profil utilisateur trouvé:', userDoc.data());
            setUserProfile(userDoc.data());
          } else {
            console.log('🆕 Création profil par défaut');
            const defaultProfile = createDefaultProfile(user);
            await setDoc(doc(db, 'users', user.uid), defaultProfile);
            setUserProfile(defaultProfile);
          }
        } catch (error) {
          console.error('❌ Erreur chargement profil:', error);
          const defaultProfile = createDefaultProfile(user);
          setUserProfile(defaultProfile);
        }
      } else {
        console.log('👤 Aucun utilisateur connecté');
        setCurrentUser(null);
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return () => {
      console.log('🧹 Nettoyage AuthProvider');
      unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    console.log('🔐 Tentative de connexion avec:', email);
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result;
  };

  const logout = () => {
    return signOut(auth);
  };

  const value = {
    currentUser,
    userProfile,
    loading,
    login,
    logout,
    setUserProfile
  };

  console.log('🎯 AuthProvider rendu - loading:', loading, 'user:', currentUser?.email);

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
EOF
echo "✅ AuthContext.jsx créé"

# 2. components/auth/RequireAuth.jsx
cat > src/components/auth/RequireAuth.jsx << 'EOF'
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../ui/LoadingSpinner';

const RequireAuth = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  console.log('🔐 RequireAuth - Loading:', loading);
  console.log('🔐 RequireAuth - CurrentUser:', currentUser?.email);
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (!currentUser) {
    console.log('🚫 RequireAuth - Non authentifié, redirection vers /login');
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

export default RequireAuth;
EOF
echo "✅ RequireAuth.jsx créé"

# 3. components/auth/RequireRole.jsx
cat > src/components/auth/RequireRole.jsx << 'EOF'
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../ui/LoadingSpinner';

const RequireRole = ({ children, role }) => {
  const { currentUser, userProfile, loading } = useAuth();
  
  console.log('🎭 RequireRole - Rôle requis:', role);
  console.log('🎭 RequireRole - UserProfile:', userProfile);
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (!currentUser) {
    console.log('🚫 RequireRole - Non connecté, redirection login');
    return <Navigate to="/login" replace />;
  }
  
  if (!userProfile) {
    console.log('⏳ RequireRole - Profil en chargement');
    return <LoadingSpinner />;
  }
  
  if (userProfile.role !== role) {
    console.log('🚫 RequireRole - Rôle insuffisant, redirection unauthorized');
    return <Navigate to="/unauthorized" replace />;
  }
  
  return children;
};

export default RequireRole;
EOF
echo "✅ RequireRole.jsx créé"

# 4. components/ui/LoadingSpinner.jsx
cat > src/components/ui/LoadingSpinner.jsx << 'EOF'
import React from 'react';

const LoadingSpinner = ({ size = 'medium', text = 'Chargement...' }) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };
  
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className={`animate-spin rounded-full border-4 border-gray-300 border-t-blue-600 ${sizeClasses[size]}`}></div>
      {text && <p className="mt-4 text-gray-600">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
EOF
echo "✅ LoadingSpinner.jsx créé"

# 5. components/dashboard/Dashboard.jsx (Composant de routage)
cat > src/components/dashboard/Dashboard.jsx << 'EOF'
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../ui/LoadingSpinner';

const Dashboard = () => {
  const { currentUser, userProfile, loading } = useAuth();
  
  console.log('📊 Dashboard - Loading:', loading);
  console.log('📊 Dashboard - CurrentUser:', currentUser?.email);
  console.log('📊 Dashboard - UserProfile:', userProfile);
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (!currentUser) {
    console.log('🚫 Dashboard - Non connecté, redirection login');
    return <Navigate to="/login" replace />;
  }
  
  if (!userProfile) {
    console.log('⏳ Dashboard - Profil en cours de chargement');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600">Chargement de votre profil...</p>
        </div>
      </div>
    );
  }
  
  console.log('🎯 Dashboard - Redirection selon rôle:', userProfile.role);
  
  switch (userProfile.role) {
    case 'super-admin':
      return <Navigate to="/dashboard/super-admin" replace />;
    case 'admin':
      return <Navigate to="/dashboard/admin" replace />;
    case 'member':
      return <Navigate to="/dashboard/member" replace />;
    case 'user':
      return <Navigate to="/dashboard/user" replace />;
    default:
      console.warn('⚠️ Rôle inconnu, redirection vers user:', userProfile.role);
      return <Navigate to="/dashboard/user" replace />;
  }
};

export default Dashboard;
EOF
echo "✅ Dashboard.jsx (routage) créé"

# 6. pages/auth/Login.jsx
cat > src/pages/auth/Login.jsx << 'EOF'
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setError('');
      setLoading(true);
      console.log('🔐 Tentative de connexion avec:', email);
      
      await login(email, password);
      console.log('✅ Connexion réussie!');
      navigate('/dashboard');
    } catch (error) {
      console.error('❌ Erreur de connexion:', error);
      setError('Échec de la connexion: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Connexion à votre compte
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Adresse email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </div>

          <div className="text-center">
            <Link to="/register" className="text-blue-600 hover:text-blue-500">
              Créer un nouveau compte
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
EOF
echo "✅ Login.jsx créé"

# 7. pages/auth/Register.jsx
cat > src/pages/auth/Register.jsx << 'EOF'
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return setError('Les mots de passe ne correspondent pas');
    }
    
    try {
      setError('');
      setLoading(true);
      console.log('📝 Tentative d\'inscription avec:', email);
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Mettre à jour le profil avec le displayName
      if (displayName) {
        await updateProfile(user, { displayName });
      }
      
      // Créer le profil dans Firestore
      const userProfile = {
        uid: user.uid,
        email: user.email,
        displayName: displayName || user.email.split('@')[0],
        role: 'user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      await setDoc(doc(db, 'users', user.uid), userProfile);
      
      console.log('✅ Inscription réussie!');
      navigate('/dashboard');
    } catch (error) {
      console.error('❌ Erreur d\'inscription:', error);
      setError('Échec de l\'inscription: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Créer un compte
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                type="text"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Nom d'affichage (optionnel)"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>
            <div>
              <input
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Adresse email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <input
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Confirmer le mot de passe"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Inscription...' : 'S\'inscrire'}
            </button>
          </div>

          <div className="text-center">
            <Link to="/login" className="text-blue-600 hover:text-blue-500">
              Déjà un compte ? Se connecter
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
EOF
echo "✅ Register.jsx créé"

# 8. pages/dashboard/user/UserDashboard.jsx
cat > src/pages/dashboard/user/UserDashboard.jsx << 'EOF'
import React from 'react';
import { useAuth } from '../../../contexts/AuthContext';

const UserDashboard = () => {
  const { currentUser, userProfile, logout } = useAuth();
  
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord Utilisateur</h1>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
            >
              Déconnexion
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 text-blue-900">Informations Personnelles</h2>
              <div className="space-y-2">
                <p><strong>Email:</strong> {currentUser?.email}</p>
                <p><strong>Nom:</strong> {userProfile?.displayName || 'Non défini'}</p>
                <p><strong>Rôle:</strong> <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">{userProfile?.role}</span></p>
              </div>
            </div>
            
            <div className="bg-green-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 text-green-900">Actions Disponibles</h2>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Voir les événements à venir
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Explorer le répertoire musical
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Mettre à jour le profil
                </li>
              </ul>
            </div>
            
            <div className="bg-purple-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 text-purple-900">Statut</h2>
              <div className="space-y-2">
                <p className="text-green-600">✓ Compte actif</p>
                <p className="text-gray-600">Membre depuis: {userProfile?.createdAt ? new Date(userProfile.createdAt).toLocaleDateString('fr-FR') : 'Date inconnue'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
EOF
echo "✅ UserDashboard.jsx créé"

# 9. pages/dashboard/member/MemberDashboard.jsx
cat > src/pages/dashboard/member/MemberDashboard.jsx << 'EOF'
import React from 'react';
import { useAuth } from '../../../contexts/AuthContext';

const MemberDashboard = () => {
  const { userProfile } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Tableau de Bord Membre</h1>
          <p className="text-lg mb-4">Bienvenue dans l'équipe, <strong>{userProfile?.displayName}</strong>!</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 text-green-900">Répertoire</h2>
              <ul className="space-y-2">
                <li>• Partitions disponibles</li>
                <li>• Enregistrements audio</li>
                <li>• Notes de pratique</li>
              </ul>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 text-blue-900">Événements</h2>
              <ul className="space-y-2">
                <li>• Prochaines répétitions</li>
                <li>• Concerts programmés</li>
                <li>• Présence à confirmer</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;
EOF
echo "✅ MemberDashboard.jsx créé"

# 10. pages/dashboard/admin/AdminDashboard.jsx
cat > src/pages/dashboard/admin/AdminDashboard.jsx << 'EOF'
import React from 'react';
import { useAuth } from '../../../contexts/AuthContext';

const AdminDashboard = () => {
  const { userProfile } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Tableau de Bord Administrateur</h1>
          <p className="text-lg mb-4">Bienvenue, administrateur <strong>{userProfile?.displayName}</strong>!</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-yellow-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 text-yellow-900">Gestion Utilisateurs</h2>
              <ul className="space-y-2">
                <li>• Voir tous les utilisateurs</li>
                <li>• Modifier les rôles</li>
                <li>• Gérer les permissions</li>
              </ul>
            </div>
            
            <div className="bg-red-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 text-red-900">Gestion Contenu</h2>
              <ul className="space-y-2">
                <li>• Créer des événements</li>
                <li>• Modifier le répertoire</li>
                <li>• Gérer les médias</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
EOF
echo "✅ AdminDashboard.jsx créé"

# 11. pages/public/Home.jsx
cat > src/pages/public/Home.jsx << 'EOF'
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-8">
          Bienvenue sur Cantoria
        </h1>
        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
          La plateforme de gestion pour votre chorale et ensemble musical
        </p>
        
        <div className="space-x-4">
          <Link 
            to="/login" 
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Se connecter
          </Link>
          <Link 
            to="/register" 
            className="bg-white text-blue-600 px-8 py-3 rounded-lg border border-blue-600 hover:bg-blue-50 transition"
          >
            Créer un compte
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
EOF
echo "✅ Home.jsx créé"

# 12. pages/public/Unauthorized.jsx
cat > src/pages/public/Unauthorized.jsx << 'EOF'
import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-600 mb-4">403</h1>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Accès non autorisé</h2>
        <p className="text-gray-600 mb-8">
          Vous n'avez pas les permissions nécessaires pour accéder à cette page.
        </p>
        <Link 
          to="/dashboard" 
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Retour au tableau de bord
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
EOF
echo "✅ Unauthorized.jsx créé"

# 13. App.jsx (racine src)
cat > src/App.jsx << 'EOF'
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Composants d'authentification
import RequireAuth from './components/auth/RequireAuth';
import RequireRole from './components/auth/RequireRole';

// Pages
import Home from './pages/public/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Unauthorized from './pages/public/Unauthorized';

// Dashboard et sous-pages
import Dashboard from './components/dashboard/Dashboard';
import UserDashboard from './pages/dashboard/user/UserDashboard';
import MemberDashboard from './pages/dashboard/member/MemberDashboard';
import AdminDashboard from './pages/dashboard/admin/AdminDashboard';

// Layout (à créer manuellement après)
// import Header from './components/layout/Header';
// import Footer from './components/layout/Footer';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App min-h-screen flex flex-col">
          {/* <Header /> */}
          <main className="flex-grow">
            <Routes>
              {/* Routes publiques */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/unauthorized" element={<Unauthorized />} />

              {/* Route dashboard principal - Redirige vers le bon dashboard */}
              <Route 
                path="/dashboard" 
                element={
                  <RequireAuth>
                    <Dashboard />
                  </RequireAuth>
                } 
              />

              {/* Dashboards spécifiques */}
              <Route 
                path="/dashboard/user" 
                element={
                  <RequireAuth>
                    <UserDashboard />
                  </RequireAuth>
                } 
              />
              
              <Route 
                path="/dashboard/member" 
                element={
                  <RequireRole role="member">
                    <MemberDashboard />
                  </RequireRole>
                } 
              />
              
              <Route 
                path="/dashboard/admin" 
                element={
                  <RequireRole role="admin">
                    <AdminDashboard />
                  </RequireRole>
                } 
              />

              {/* Route 404 */}
              <Route path="*" element={
                <div className="container mx-auto p-8 text-center">
                  <h1 className="text-4xl font-bold mb-4">404</h1>
                  <p className="text-xl">Page non trouvée</p>
                </div>
              } />
            </Routes>
          </main>
          {/* <Footer /> */}
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
EOF
echo "✅ App.jsx créé"

echo ""
echo "🎉 Structure créée avec succès !"
echo ""
echo "📁 Structure finale:"
echo "src/"
echo "├── components/"
echo "│   ├── auth/"
echo "│   │   ├── RequireAuth.jsx"
echo "│   │   └── RequireRole.jsx"
echo "│   ├── dashboard/"
echo "│   │   └── Dashboard.jsx"
echo "│   └── ui/"
echo "│       └── LoadingSpinner.jsx"
echo "├── contexts/"
echo "│   └── AuthContext.jsx"
echo "├── pages/"
echo "│   ├── auth/"
echo "│   │   ├── Login.jsx"
echo "│   │   └── Register.jsx"
echo "│   ├── dashboard/"
echo "│   │   ├── user/"
echo "│   │   │   └── UserDashboard.jsx"
echo "│   │   ├── member/"
echo "│   │   │   └── MemberDashboard.jsx"
echo "│   │   └── admin/"
echo "│   │       └── AdminDashboard.jsx"
echo "│   └── public/"
echo "│       ├── Home.jsx"
echo "│       └── Unauthorized.jsx"
echo "└── App.jsx"
echo ""
echo "🚀 Prochaines étapes:"
echo "1. Créer manuellement Header.jsx et Footer.jsx dans components/layout/"
echo "2. Vérifier que lib/firebase.js existe avec votre configuration Firebase"
echo "3. Lancer l'application: npm run dev"
echo "4. Tester la connexion avec /login"
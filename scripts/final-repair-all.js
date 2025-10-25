import fs from 'fs';
import path from 'path';

console.log('🔧 RÉPARATION FINALE DE TOUS LES FICHIERS...\n');

// Réparer tous les fichiers problématiques
const filesToRepair = [
  {
    path: 'src/auth/components/PermissionGuard.jsx',
    content: `import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthorization } from '../../hooks/useAuthorization';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Guard de permission pour protéger les routes et composants selon les rôles
 */
const PermissionGuard = ({
  children,
  requiredRole,
  minRequiredRole,
  requiredPermissions = []
}) => {
  const { userProfile, loading } = useAuth();
  const { hasRole, hasMinRole, hasPermissions } = useAuthorization();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Vérifier le rôle requis
  if (requiredRole && !hasRole(requiredRole)) {
    console.warn('Permission denied: Role required', { requiredRole, userRole: userProfile?.role });
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  // Vérifier le rôle minimum
  if (minRequiredRole && !hasMinRole(minRequiredRole)) {
    console.warn('Permission denied: Min role required', { minRequiredRole, userRole: userProfile?.role });
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  // Vérifier les permissions spécifiques
  if (requiredPermissions.length > 0 && !hasPermissions(requiredPermissions)) {
    console.warn('Permission denied: Permissions required', { requiredPermissions });
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  return children;
};

export default PermissionGuard;`
  },
  {
    path: 'src/auth/components/ProtectedRoute.jsx',
    content: `import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ 
  children, 
  requiredRole, 
  minRequiredRole 
}) => {
  const { userProfile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Si non connecté, rediriger vers login
  if (!userProfile) {
    return <Navigate to="/login" replace />;
  }

  // Vérification par rôle spécifique
  if (requiredRole && userProfile.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Vérification par rôle minimum
  const roleHierarchy = {
    'registered-user': 1,
    'membre': 2,
    'admin': 3,
    'super-admin': 4
  };

  if (minRequiredRole) {
    const userLevel = roleHierarchy[userProfile.role] || 0;
    const requiredLevel = roleHierarchy[minRequiredRole] || 0;
    
    if (userLevel < requiredLevel) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;`
  },
  {
    path: 'src/hooks/useAuthorization.js',
    content: `import { useAuth } from '../contexts/AuthContext';

export const useAuthorization = () => {
  const { userProfile } = useAuth();

  const hasRole = (role) => {
    return userProfile?.role === role;
  };

  const hasMinRole = (minRole) => {
    const roleHierarchy = {
      'registered-user': 1,
      'membre': 2,
      'admin': 3,
      'super-admin': 4
    };

    const userLevel = roleHierarchy[userProfile?.role] || 0;
    const requiredLevel = roleHierarchy[minRole] || 0;

    return userLevel >= requiredLevel;
  };

  const hasPermissions = (permissions) => {
    if (!userProfile?.permissions) return false;
    return permissions.every(permission => 
      userProfile.permissions.includes(permission)
    );
  };

  return {
    hasRole,
    hasMinRole,
    hasPermissions,
    userRole: userProfile?.role,
    userPermissions: userProfile?.permissions || []
  };
};`
  },
  {
    path: 'src/auth/Login.jsx',
    content: `import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login attempt:', email);
    // Implémentation de connexion à ajouter
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-center mb-6">Connexion</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;`
  },
  {
    path: 'src/auth/Register.jsx',
    content: `import React, { useState } from 'react';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Register attempt:', email);
    // Implémentation d'inscription à ajouter
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-center mb-6">Inscription</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            S'inscrire
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;`
  }
];

// Réparer chaque fichier
filesToRepair.forEach(fileConfig => {
  const dir = path.dirname(fileConfig.path);
  
  // Créer le dossier si nécessaire
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Dossier créé: ${dir}`);
  }
  
  // Écrire le fichier corrigé
  fs.writeFileSync(fileConfig.path, fileConfig.content);
  console.log(`✅ ${fileConfig.path} réparé`);
});

console.log('\n🎉 Tous les fichiers ont été réparés !');
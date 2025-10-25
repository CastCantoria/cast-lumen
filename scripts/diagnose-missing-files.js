import fs from 'fs';
import path from 'path';

console.log('🔍 Diagnostic des fichiers manquants...\n');

// Liste des fichiers critiques à vérifier
const criticalFiles = [
  'src/components/layout/Header.jsx',
  'src/pages/public/Join.jsx', 
  'src/pages/auth/LoginPage.jsx',
  'src/pages/auth/RegisterPage.jsx',
  'src/pages/app/dashboards/super-admin/SuperAdminDashboard.jsx',
  'src/pages/app/dashboards/admin/AdminDashboard.jsx',
  'src/pages/app/dashboards/user/UserDashboard.jsx',
  'src/pages/app/profile/ProfilePage.jsx',
  'src/auth/components/ProtectedRoute.jsx'
];

// Vérifier l'existence des fichiers
criticalFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ MANQUANT: ${file}`);
    
    // Créer les fichiers manquants essentiels
    createMissingFile(file);
  }
});

function createMissingFile(filePath) {
  const dir = path.dirname(filePath);
  
  // Créer le dossier si nécessaire
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`   📁 Dossier créé: ${dir}`);
  }
  
  // Contenu par défaut selon le type de fichier
  let content = '';
  
  switch(path.basename(filePath)) {
    case 'Header.jsx':
      content = `import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            C.A.S.T. Cantoria
          </Link>
          <nav className="flex space-x-4">
            <Link to="/" className="text-gray-700 hover:text-blue-600">Accueil</Link>
            <Link to="/about" className="text-gray-700 hover:text-blue-600">À Propos</Link>
            <Link to="/login" className="text-gray-700 hover:text-blue-600">Connexion</Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;`;
      break;
      
    case 'LoginPage.jsx':
      content = `import React from 'react';
import Login from '../../auth/Login';

const LoginPage = () => {
  return <Login />;
};

export default LoginPage;`;
      break;
      
    case 'RegisterPage.jsx':
      content = `import React from 'react';
import Register from '../../auth/Register';

const RegisterPage = () => {
  return <Register />;
};

export default RegisterPage;`;
      break;
      
    case 'Join.jsx':
      content = `import React from 'react';

const Join = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">Rejoindre C.A.S.T.</h1>
        <div className="bg-white rounded-lg shadow-lg p-8">
          <p className="text-lg text-gray-700 mb-6">
            Page de recrutement - En construction
          </p>
        </div>
      </div>
    </div>
  );
};

export default Join;`;
      break;
      
    case 'SuperAdminDashboard.jsx':
      content = `import React from 'react';

const SuperAdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-blue-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Super Admin Dashboard</h1>
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
          <p>Tableau de bord Super Admin - En construction</p>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;`;
      break;
      
    case 'AdminDashboard.jsx':
      content = `import React from 'react';

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-600 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
          <p>Tableau de bord Administrateur - En construction</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;`;
      break;
      
    case 'UserDashboard.jsx':
      content = `import React from 'react';

const UserDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Mon Tableau de Bord</h1>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p>Tableau de bord utilisateur - En construction</p>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;`;
      break;
      
    case 'ProfilePage.jsx':
      content = `import React from 'react';

const ProfilePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Mon Profil</h1>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p>Page de profil - En construction</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;`;
      break;
      
    case 'ProtectedRoute.jsx':
      content = `import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole, minRequiredRole }) => {
  const { userProfile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!userProfile) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && userProfile.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

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

export default ProtectedRoute;`;
      break;
      
    default:
      content = `import React from 'react';

const ${path.basename(filePath, '.jsx')} = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">${path.basename(filePath, '.jsx')}</h1>
        <p className="text-gray-600">Composant en construction</p>
      </div>
    </div>
  );
};

export default ${path.basename(filePath, '.jsx')};`;
  }
  
  fs.writeFileSync(filePath, content);
  console.log(`   ✅ Fichier créé: ${filePath}`);
}

console.log('\n🎉 Diagnostic terminé !');
import fs from 'fs';
import path from 'path';

console.log('🔧 RÉPARATION DES FICHIERS CORROMPUS...\n');

// Liste des fichiers à réparer avec leur contenu correct
const filesToRepair = [
  {
    path: 'src/pages/app/profile/ProfilePage.jsx',
    content: `import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';

const ProfilePage = () => {
  const { userProfile } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Mon Profil</h1>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-lg text-gray-700">
            Page de profil - En construction
          </p>
          {userProfile && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p><strong>Email:</strong> {userProfile.email}</p>
              <p><strong>Rôle:</strong> {userProfile.role}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;`
  },
  {
    path: 'src/pages/auth/LoginPage.jsx',
    content: `import React from 'react';
import Login from '../../auth/Login';

const LoginPage = () => {
  return <Login />;
};

export default LoginPage;`
  },
  {
    path: 'src/pages/auth/RegisterPage.jsx', 
    content: `import React from 'react';
import Register from '../../auth/Register';

const RegisterPage = () => {
  return <Register />;
};

export default RegisterPage;`
  },
  {
    path: 'src/pages/public/Join.jsx',
    content: `import React from 'react';

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

export default Join;`
  },
  {
    path: 'src/pages/app/dashboards/super-admin/SuperAdminDashboard.jsx',
    content: `import React from 'react';
import { useAuth } from '../../../../contexts/AuthContext';

const SuperAdminDashboard = () => {
  const { userProfile } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-blue-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Super Admin Dashboard</h1>
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
          <p>Tableau de bord Super Admin - En construction</p>
          {userProfile && (
            <p className="mt-4">Connecté en tant que: {userProfile.email}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;`
  },
  {
    path: 'src/pages/app/dashboards/admin/AdminDashboard.jsx',
    content: `import React from 'react';
import { useAuth } from '../../../../contexts/AuthContext';

const AdminDashboard = () => {
  const { userProfile } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-600 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
          <p>Tableau de bord Administrateur - En construction</p>
          {userProfile && (
            <p className="mt-4">Connecté en tant que: {userProfile.email}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;`
  },
  {
    path: 'src/pages/app/dashboards/member/MemberDashboard.jsx',
    content: `import React from 'react';
import { useAuth } from '../../../../contexts/AuthContext';

const MemberDashboard = () => {
  const { userProfile } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 to-green-600 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Member Dashboard</h1>
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
          <p>Tableau de bord Membre - En construction</p>
          {userProfile && (
            <p className="mt-4">Connecté en tant que: {userProfile.email}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;`
  },
  {
    path: 'src/pages/app/dashboards/user/UserDashboard.jsx',
    content: `import React from 'react';
import { useAuth } from '../../../../contexts/AuthContext';

const UserDashboard = () => {
  const { userProfile } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Mon Tableau de Bord</h1>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p>Tableau de bord utilisateur - En construction</p>
          {userProfile && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p><strong>Email:</strong> {userProfile.email}</p>
              <p><strong>Rôle:</strong> {userProfile.role}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;`
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
import fs from 'fs';
import path from 'path';

console.log('🚀 Réorganisation de la structure...');

// Structure simplifiée
const createStructure = () => {
  const directories = [
    'src/auth/components',
    'src/components/ui',
    'src/pages/auth',
    'src/pages/app/profile',
    'src/pages/app/dashboards/user',
    'src/pages/app/dashboards/member',
    'src/pages/app/dashboards/admin',
    'src/pages/app/dashboards/super-admin'
  ];

  directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`✅ Créé: ${dir}`);
    }
  });
};

// Fonction pour déplacer les fichiers
const moveFiles = async () => {
  const moves = [
    // Déplacer les composants auth
    { from: 'src/components/auth/ProtectedRoute.jsx', to: 'src/auth/components/ProtectedRoute.jsx' },
    { from: 'src/components/auth/PermissionGuard.jsx', to: 'src/auth/components/PermissionGuard.jsx' },
    
    // Déplacer les dashboards
    { from: 'src/pages/dashboard/admin/AdminDashboard.jsx', to: 'src/pages/app/dashboards/admin/AdminDashboard.jsx' },
    { from: 'src/pages/dashboard/super-admin/SuperAdminDashboard.jsx', to: 'src/pages/app/dashboards/super-admin/SuperAdminDashboard.jsx' },
    { from: 'src/pages/dashboard/member/MemberDashboard.jsx', to: 'src/pages/app/dashboards/member/MemberDashboard.jsx' },
    { from: 'src/components/Dashboard/Dashboard.jsx', to: 'src/pages/app/dashboards/user/UserDashboard.jsx' },
    
    // Déplacer le profil
    { from: 'src/pages/private/Profile.jsx', to: 'src/pages/app/profile/ProfilePage.jsx' }
  ];

  for (const move of moves) {
    if (fs.existsSync(move.from)) {
      // Créer le dossier de destination
      const dir = path.dirname(move.to);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      // Lire et mettre à jour le contenu
      let content = fs.readFileSync(move.from, 'utf8');
      
      // Écrire à la nouvelle destination
      fs.writeFileSync(move.to, content);
      console.log(`✅ Déplacé: ${move.from} → ${move.to}`);
    }
  }
};

createStructure();
moveFiles().then(() => {
  console.log('🎉 Réorganisation terminée !');
});
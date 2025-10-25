import fs from 'fs';
import path from 'path';

console.log('🔍 Vérification de la structure...');

const expectedFiles = [
  'src/auth/Login.jsx',
  'src/auth/Register.jsx',
  'src/auth/components/ProtectedRoute.jsx',
  'src/contexts/AuthContext.jsx',
  'src/components/layout/Header.jsx',
  'src/components/layout/Footer.jsx',
  'src/config/firebase.js',
  'src/pages/app/dashboards/admin/AdminDashboard.jsx',
  'src/pages/app/dashboards/user/UserDashboard.jsx',
  'src/pages/public/Home.jsx'
];

let allGood = true;

expectedFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ MANQUANT: ${file}`);
    allGood = false;
  }
});

console.log(allGood ? '\n🎉 Tous les fichiers sont en place !' : '\n⚠️  Certains fichiers sont manquants.');
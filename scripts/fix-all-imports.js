import fs from 'fs';
import path from 'path';

console.log('🔧 Correction de tous les imports...\n');

// Fichiers à vérifier et corriger
const filesToFix = [
  'src/App.jsx',
  'src/components/layout/Header.jsx',
  'src/pages/auth/LoginPage.jsx',
  'src/pages/auth/RegisterPage.jsx'
];

filesToFix.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    console.log(`📝 Correction de: ${filePath}`);
    fixFileImports(filePath);
  } else {
    console.log(`❌ Fichier non trouvé: ${filePath}`);
  }
});

function fixFileImports(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  
  // Corrections spécifiques selon le fichier
  switch(path.basename(filePath)) {
    case 'App.jsx':
      // Corriger les imports dans App.jsx
      content = content
        .replace(/from\s+['"]\.\/auth\/Login['"]/g, "from './pages/auth/LoginPage'")
        .replace(/from\s+['"]\.\/pages\/public\/Register['"]/g, "from './pages/auth/RegisterPage'")
        .replace(/from\s+['"]\.\/components\/Dashboard\/Dashboard['"]/g, "from './pages/app/dashboards/user/UserDashboard'")
        .replace(/from\s+['"]\.\/pages\/private\/Profile['"]/g, "from './pages/app/profile/ProfilePage'")
        .replace(/from\s+['"]\.\/pages\/dashboard\/super-admin\/SuperAdminDashboard['"]/g, "from './pages/app/dashboards/super-admin/SuperAdminDashboard'")
        .replace(/from\s+['"]\.\/pages\/dashboard\/admin\/AdminDashboard['"]/g, "from './pages/app/dashboards/admin/AdminDashboard'")
        .replace(/from\s+['"]\.\/pages\/dashboard\/member\/MemberDashboard['"]/g, "from './pages/app/dashboards/member/MemberDashboard'")
        .replace(/from\s+['"]\.\/components\/auth\/ProtectedRoute['"]/g, "from './auth/components/ProtectedRoute'")
        .replace(/from\s+['"]\.\/components\/RequireAuth['"]/g, "from './auth/components/ProtectedRoute'");
      break;
      
    case 'Header.jsx':
      // S'assurer que Header.jsx importe correctement
      content = content
        .replace(/from\s+['"]\.\.\/\.\.\/contexts\/AuthContext['"]/g, "from '../../contexts/AuthContext'")
        .replace(/from\s+['"]\.\.\/contexts\/AuthContext['"]/g, "from '../../contexts/AuthContext'");
      break;
      
    case 'LoginPage.jsx':
      // S'assurer que LoginPage.jsx importe correctement
      content = content
        .replace(/from\s+['"]\.\.\/\.\.\/auth\/Login['"]/g, "from '../../auth/Login'")
        .replace(/from\s+['"]\.\.\/auth\/Login['"]/g, "from '../../auth/Login'");
      break;
      
    case 'RegisterPage.jsx':
      // S'assurer que RegisterPage.jsx importe correctement
      content = content
        .replace(/from\s+['"]\.\.\/\.\.\/auth\/Register['"]/g, "from '../../auth/Register'")
        .replace(/from\s+['"]\.\.\/auth\/Register['"]/g, "from '../../auth/Register'");
      break;
  }
  
  // Écrire seulement si des changements ont été faits
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ ${filePath} corrigé`);
    
    // Afficher les changements
    const originalLines = originalContent.split('\n');
    const newLines = content.split('\n');
    
    console.log('   Changements:');
    originalLines.forEach((line, index) => {
      if (line !== newLines[index] && line.includes('from')) {
        console.log(`   - ${line.trim()}`);
        console.log(`   + ${newLines[index].trim()}`);
      }
    });
  } else {
    console.log(`ℹ️  ${filePath} - Aucune correction nécessaire`);
  }
}

console.log('\n🎉 Correction des imports terminée !');
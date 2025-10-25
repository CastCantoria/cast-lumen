import fs from 'fs';
import path from 'path';

console.log('🔧 CORRECTION FINALE DES IMPORTS...\n');

// Vérifier l'existence des fichiers critiques
const criticalFiles = [
  'src/contexts/AuthContext.jsx',
  'src/config/firebase.js'
];

console.log('📁 Vérification des fichiers critiques:');
criticalFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ MANQUANT: ${file}`);
  }
});

// Liste de tous les fichiers avec leurs imports corrects
const filesToFix = [
  {
    path: 'src/pages/app/dashboards/super-admin/SuperAdminDashboard.jsx',
    fixes: [
      { from: /from\s+['"][^'"]*\/contexts\/[^'"]*['"]/, to: "import { useAuth } from '../../../../contexts/AuthContext';" },
      { from: /import\s+\{[^}]*\}\s+from\s+['"][^'"]*\/contexts\/[^'"]*['"]/, to: "import { useAuth } from '../../../../contexts/AuthContext';" }
    ]
  },
  {
    path: 'src/pages/app/dashboards/admin/AdminDashboard.jsx', 
    fixes: [
      { from: /from\s+['"][^'"]*\/contexts\/[^'"]*['"]/, to: "import { useAuth } from '../../../../contexts/AuthContext';" },
      { from: /from\s+['"][^'"]*\/config\/firebase['"]/, to: "import { db } from '../../../../config/firebase';" }
    ]
  },
  {
    path: 'src/pages/app/dashboards/user/UserDashboard.jsx',
    fixes: [
      { from: /from\s+['"][^'"]*\/contexts\/[^'"]*['"]/, to: "import { useAuth } from '../../../../contexts/AuthContext';" }
    ]
  },
  {
    path: 'src/pages/app/dashboards/member/MemberDashboard.jsx',
    fixes: [
      { from: /from\s+['"][^'"]*\/contexts\/[^'"]*['"]/, to: "import { useAuth } from '../../../../contexts/AuthContext';" }
    ]
  },
  {
    path: 'src/pages/app/profile/ProfilePage.jsx',
    fixes: [
      { from: /from\s+['"][^'"]*\/contexts\/[^'"]*['"]/, to: "import { useAuth } from '../../../contexts/AuthContext';" },
      { from: /from\s+['"][^'"]*\/config\/firebase['"]/, to: "import { db } from '../../../config/firebase';" }
    ]
  },
  {
    path: 'src/pages/auth/LoginPage.jsx',
    fixes: [
      { from: /from\s+['"][^'"]*\/contexts\/[^'"]*['"]/, to: "import { useAuth } from '../../contexts/AuthContext';" }
    ]
  },
  {
    path: 'src/pages/auth/RegisterPage.jsx',
    fixes: [
      { from: /from\s+['"][^'"]*\/contexts\/[^'"]*['"]/, to: "import { useAuth } from '../../contexts/AuthContext';" }
    ]
  },
  {
    path: 'src/pages/public/Join.jsx',
    fixes: [
      { from: /from\s+['"][^'"]*\/contexts\/[^'"]*['"]/, to: "import { useAuth } from '../../contexts/AuthContext';" }
    ]
  },
  {
    path: 'src/auth/components/PermissionGuard.jsx',
    fixes: [
      { from: /from\s+['"][^'"]*\/contexts\/[^'"]*['"]/, to: "import { useAuth } from '../../contexts/AuthContext';" }
    ]
  }
];

// Appliquer les corrections
filesToFix.forEach(fileConfig => {
  if (fs.existsSync(fileConfig.path)) {
    console.log(`\n📝 Correction de: ${fileConfig.path}`);
    let content = fs.readFileSync(fileConfig.path, 'utf8');
    let changed = false;
    
    fileConfig.fixes.forEach(fix => {
      if (fix.from.test(content)) {
        content = content.replace(fix.from, fix.to);
        changed = true;
        console.log(`   ✅ Appliqué: ${fix.to}`);
      }
    });
    
    if (changed) {
      fs.writeFileSync(fileConfig.path, content);
    } else {
      console.log(`   ℹ️  Aucune correction nécessaire`);
    }
  } else {
    console.log(`\n❌ Fichier non trouvé: ${fileConfig.path}`);
  }
});

console.log('\n🎉 Correction finale terminée !');
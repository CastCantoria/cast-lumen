import fs from 'fs';
import path from 'path';

console.log('🔧 CORRECTION COMPLÈTE DE TOUS LES IMPORTS...\n');

// Liste de tous les fichiers qui ont des problèmes d'imports
const problematicFiles = [
  'src/pages/auth/LoginPage.jsx',
  'src/pages/auth/RegisterPage.jsx',
  'src/pages/public/Join.jsx',
  'src/pages/app/dashboards/super-admin/SuperAdminDashboard.jsx',
  'src/pages/app/dashboards/admin/AdminDashboard.jsx',
  'src/pages/app/dashboards/user/UserDashboard.jsx',
  'src/pages/app/dashboards/member/MemberDashboard.jsx',
  'src/pages/app/profile/ProfilePage.jsx',
  'src/auth/components/PermissionGuard.jsx',
  'src/auth/components/ProtectedRoute.jsx'
];

problematicFiles.forEach(filePath => {
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
  
  // Calculer le chemin relatif vers contexts/AuthContext
  const relativePathToContexts = calculateRelativePath(filePath, 'src/contexts/AuthContext.jsx');
  const relativePathToConfig = calculateRelativePath(filePath, 'src/config/firebase.js');
  
  // Remplacer tous les imports problématiques
  content = content
    // Corriger AuthContext imports
    .replace(/from\s+['"]\.\.\/contexts\/AuthContext['"]/g, `from '${relativePathToContexts}'`)
    .replace(/from\s+['"]\.\.\/\.\.\/contexts\/AuthContext['"]/g, `from '${relativePathToContexts}'`)
    .replace(/from\s+['"]\.\.\/\.\.\/\.\.\/contexts\/AuthContext['"]/g, `from '${relativePathToContexts}'`)
    .replace(/from\s+['"]\.\.\/\.\.\/\.\.\/\.\.\/contexts\/AuthContext['"]/g, `from '${relativePathToContexts}'`)
    
    // Corriger NewAuthContext imports (remplacer par AuthContext)
    .replace(/from\s+['"]\.\.\/contexts\/NewAuthContext['"]/g, `from '${relativePathToContexts}'`)
    .replace(/from\s+['"]\.\.\/\.\.\/contexts\/NewAuthContext['"]/g, `from '${relativePathToContexts}'`)
    
    // Corriger firebase config imports
    .replace(/from\s+['"]\.\.\/config\/firebase['"]/g, `from '${relativePathToConfig}'`)
    .replace(/from\s+['"]\.\.\/\.\.\/config\/firebase['"]/g, `from '${relativePathToConfig}'`)
    .replace(/from\s+['"]\.\.\/\.\.\/\.\.\/config\/firebase['"]/g, `from '${relativePathToConfig}'`);
  
  // Écrire seulement si des changements ont été faits
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ ${filePath} corrigé`);
    
    // Afficher un résumé des changements
    const changes = findImportChanges(originalContent, content);
    if (changes.length > 0) {
      console.log('   Modifications:');
      changes.forEach(change => {
        console.log(`   - ${change.old}`);
        console.log(`   + ${change.new}`);
      });
    }
  } else {
    console.log(`ℹ️  ${filePath} - Aucune correction nécessaire`);
  }
}

function calculateRelativePath(fromPath, toPath) {
  const fromDir = path.dirname(fromPath);
  const relativePath = path.relative(fromDir, toPath).replace(/\\/g, '/');
  
  // Si le chemin commence par "src", le rendre relatif
  if (relativePath.startsWith('src/')) {
    return './' + relativePath;
  }
  
  // Ajouter ./ si nécessaire
  return relativePath.startsWith('.') ? relativePath : './' + relativePath;
}

function findImportChanges(oldContent, newContent) {
  const oldLines = oldContent.split('\n');
  const newLines = newContent.split('\n');
  const changes = [];
  
  oldLines.forEach((oldLine, index) => {
    const newLine = newLines[index];
    if (oldLine !== newLine && oldLine.includes('from') && newLine.includes('from')) {
      changes.push({
        old: oldLine.trim(),
        new: newLine.trim()
      });
    }
  });
  
  return changes;
}

console.log('\n🎉 Correction complète des imports terminée !');
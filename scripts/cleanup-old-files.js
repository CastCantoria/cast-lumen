import fs from 'fs';
import path from 'path';

console.log('🧹 Liste des anciens fichiers à supprimer...');

const oldPaths = [
  'src/admin',
  'src/components/Dashboard',
  'src/pages/dashboard',
  'src/pages/private',
  'src/pages/member',
  'src/lib',
  'src/middleware',
  'src/scripts'
];

oldPaths.forEach(oldPath => {
  if (fs.existsSync(oldPath)) {
    console.log(`📁 ${oldPath}`);
  }
});

console.log('\n⚠️  Supprimez manuellement après vérification avec:');
console.log('rm -rf src/admin src/components/Dashboard src/pages/dashboard src/pages/private src/pages/member src/lib src/middleware src/scripts');
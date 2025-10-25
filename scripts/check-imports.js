import fs from 'fs';
import path from 'path';

console.log('🔍 Vérification des imports...');

function checkFileImports(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`❌ Fichier non trouvé: ${filePath}`);
    return;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const importRegex = /from\s+['"](\.\/[^'"]+)['"]/g;
  let match;
  const imports = [];

  while ((match = importRegex.exec(content)) !== null) {
    imports.push(match[1]);
  }

  imports.forEach(importPath => {
    const fullPath = path.join(path.dirname(filePath), importPath + '.jsx');
    if (!fs.existsSync(fullPath) && !fs.existsSync(fullPath.replace('.jsx', '.js'))) {
      console.log(`❌ ${filePath} → ${importPath} introuvable`);
    }
  });
}

// Vérifier les fichiers principaux
const filesToCheck = [
  'src/components/Dashboard.jsx',
  'src/App.jsx',
  'src/components/layout/Header.jsx'
];

filesToCheck.forEach(file => checkFileImports(file));

console.log('\n💡 Solutions:');
console.log('1. Exécutez: npm run reorganize');
console.log('2. Ou créez les fichiers manquants manuellement');
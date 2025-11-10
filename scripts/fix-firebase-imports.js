// scripts/fix-firebase-imports.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Chemins incorrects à remplacer
const incorrectImports = [
  { 
    old: /from ['"]\.\.\/config\/firebase['"]/g, 
    new: 'from "../lib/firebase"',
    description: 'services/ vers config/firebase'
  },
  { 
    old: /from ['"]\.\.\/\.\.\/config\/firebase['"]/g, 
    new: 'from "../lib/firebase"',
    description: 'composants/ vers config/firebase'
  },
  { 
    old: /from ['"]\.\.\/firebase['"]/g, 
    new: 'from "../lib/firebase"',
    description: 'src/ vers firebase (root)'
  }
];

// Dossiers à scanner
const foldersToScan = [
  path.join(__dirname, '../src/services'),
  path.join(__dirname, '../src/components'),
  path.join(__dirname, '../src/contexts'),
  path.join(__dirname, '../src/pages'),
  path.join(__dirname, '../src/layouts')
];

let totalFiles = 0;
let modifiedFiles = 0;

function scanDirectory(dir) {
  try {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        // Récursion dans les sous-dossiers
        scanDirectory(filePath);
      } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
        totalFiles++;
        fixImportsInFile(filePath);
      }
    });
  } catch (error) {
    console.error(`❌ Erreur lecture dossier ${dir}:`, error.message);
  }
}

function fixImportsInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    incorrectImports.forEach(({ old, new: replacement, description }) => {
      if (old.test(content)) {
        content = content.replace(old, replacement);
        modified = true;
        console.log(`✅ ${path.basename(filePath)} - ${description}`);
      }
    });
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      modifiedFiles++;
    }
  } catch (error) {
    console.error(`❌ Erreur traitement ${filePath}:`, error.message);
  }
}

// Exécution
console.log('🔍 Recherche des imports Firebase incorrects...\n');

foldersToScan.forEach(folder => {
  if (fs.existsSync(folder)) {
    console.log(`📁 Scan: ${folder}`);
    scanDirectory(folder);
  }
});

console.log('\n📊 RÉSUMÉ:');
console.log(`   Fichiers scannés: ${totalFiles}`);
console.log(`   Fichiers modifiés: ${modifiedFiles}`);
console.log('\n✅ Correction terminée!');

if (modifiedFiles > 0) {
  console.log('\n⚠️  IMPORTANT:');
  console.log('   1. Vérifiez que src/lib/firebase.js existe');
  console.log('   2. Redémarrez le serveur: npm run dev');
  console.log('   3. Testez l\'application');
}
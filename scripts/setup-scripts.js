import fs from 'fs';
import path from 'path';

console.log('🚀 Configuration des scripts...');

// Créer le dossier scripts s'il n'existe pas
if (!fs.existsSync('scripts')) {
  fs.mkdirSync('scripts');
  console.log('✅ Dossier scripts créé');
}

// Créer la structure de base
const structure = [
  'src/auth/components',
  'src/components/ui', 
  'src/pages/auth',
  'src/pages/app/profile',
  'src/pages/app/dashboards/user',
  'src/pages/app/dashboards/member',
  'src/pages/app/dashboards/admin',
  'src/pages/app/dashboards/super-admin'
];

structure.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✅ ${dir}`);
  }
});

console.log('🎉 Structure de base créée !');
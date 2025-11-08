import fs from 'fs';
import path from 'path';

class RouteValidator {
  constructor() {
    this.distPath = './dist';
  }

  getExpectedRoutes() {
    return [
      '/',
      '/login',
      '/register', 
      '/dashboard',
      '/dashboard/admin',
      '/dashboard/super-admin',
      '/dashboard/member',
      '/dashboard/user',
      '/events',
      '/gallery',
      '/repertoire',
      '/about',
      '/contact',
      '/spiritualite',
      '/videos',
      '/blog',
      '/partenaires',
      '/join',
      '/faq',
      '/unauthorized'
    ];
  }

  validateSPA() {
    console.log('🔍 Validating SPA build...\n');
    
    // Pour une SPA, on vérifie seulement les fichiers critiques
    const criticalFiles = [
      { name: 'index.html', path: './dist/index.html' },
      { name: 'CSS Bundle', pattern: /index-.*\.css/ },
      { name: 'JS Bundle', pattern: /index-.*\.js/ },
      { name: 'Vendor JS', pattern: /vendor-.*\.js/ }
    ];

    let allGood = true;
    const assetsDir = './dist/assets';

    criticalFiles.forEach(check => {
      if (check.path) {
        // Fichier spécifique
        if (fs.existsSync(check.path)) {
          console.log(`✅ ${check.name}`);
        } else {
          console.log(`❌ ${check.name}`);
          allGood = false;
        }
      } else if (fs.existsSync(assetsDir)) {
        // Pattern dans assets
        const files = fs.readdirSync(assetsDir);
        const exists = files.some(f => check.pattern.test(f));
        
        if (exists) {
          console.log(`✅ ${check.name}`);
        } else {
          console.log(`❌ ${check.name}`);
          allGood = false;
        }
      } else {
        console.log(`❌ ${check.name} (assets directory missing)`);
        allGood = false;
      }
    });

    return this.generateSPAReport(allGood);
  }

  generateSPAReport(allGood) {
    console.log('\n📊 SPA BUILD REPORT');
    console.log('='.repeat(50));

    if (allGood) {
      console.log('✅ SPA build successful!');
      console.log('💡 This is a Single Page Application - routing is handled by React Router');
    } else {
      console.log('❌ Build issues detected');
    }

    // Vérifier la taille des bundles
    try {
      const assetsDir = './dist/assets';
      if (fs.existsSync(assetsDir)) {
        const files = fs.readdirSync(assetsDir);
        console.log('\n📦 Bundle sizes:');
        
        files.forEach(file => {
          const filePath = path.join(assetsDir, file);
          const stats = fs.statSync(filePath);
          const size = (stats.size / 1024 / 1024).toFixed(2);
          console.log(`   ${file}: ${size} MB`);
        });
      }
    } catch (error) {
      console.log('   Could not analyze bundle sizes');
    }

    return allGood;
  }
}

try {
  const validator = new RouteValidator();
  const isValid = validator.validateSPA();
  process.exit(isValid ? 0 : 1);
} catch (error) {
  console.error('💥 Error:', error.message);
  process.exit(1);
}
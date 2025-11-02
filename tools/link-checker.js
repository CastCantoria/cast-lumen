import fs from 'fs';
import path from 'path';

console.log('🔍 Checking SPA build integrity...\n');

if (!fs.existsSync('./dist')) {
  console.log('❌ dist folder not found. Run npm run build first.');
  process.exit(1);
}

// Vérifications pour SPA
const checks = [
  { 
    name: 'index.html', 
    check: () => fs.existsSync('./dist/index.html'),
    fix: 'Build failed - check Vite configuration'
  },
  { 
    name: 'Assets directory', 
    check: () => fs.existsSync('./dist/assets'),
    fix: 'Assets not generated - check build process'
  },
  { 
    name: 'Main CSS', 
    check: () => {
      if (!fs.existsSync('./dist/assets')) return false;
      const files = fs.readdirSync('./dist/assets');
      return files.some(f => f.endsWith('.css') && f.includes('index-'));
    },
    fix: 'CSS not generated - check Tailwind configuration'
  },
  { 
    name: 'Main JS', 
    check: () => {
      if (!fs.existsSync('./dist/assets')) return false;
      const files = fs.readdirSync('./dist/assets');
      return files.some(f => f.endsWith('.js') && f.includes('index-'));
    },
    fix: 'JS bundles not generated - check React components'
  }
];

let allGood = true;
const issues = [];

checks.forEach(check => {
  if (check.check()) {
    console.log(`✅ ${check.name}`);
  } else {
    console.log(`❌ ${check.name}`);
    issues.push({ name: check.name, fix: check.fix });
    allGood = false;
  }
});

// Analyser index.html
try {
  const indexHtml = fs.readFileSync('./dist/index.html', 'utf8');
  
  // Vérifier les balises critiques
  const hasTitle = indexHtml.includes('<title>');
  const hasRootDiv = indexHtml.includes('id="root"') || indexHtml.includes('id="app"');
  const hasScripts = indexHtml.includes('<script') && indexHtml.includes('src=');
  const hasStyles = indexHtml.includes('<link') && indexHtml.includes('stylesheet');
  
  console.log('\n📄 HTML Structure:');
  console.log(hasTitle ? '   ✅ Title tag' : '   ❌ Missing title tag');
  console.log(hasRootDiv ? '   ✅ Root div' : '   ❌ Missing root div');
  console.log(hasScripts ? '   ✅ Script tags' : '   ❌ Missing script tags');
  console.log(hasStyles ? '   ✅ Style links' : '   ❌ Missing style links');
  
} catch (error) {
  console.log('❌ Cannot read index.html');
  allGood = false;
}

// Rapport final
console.log('\n📊 SPA LINK CHECK REPORT');
console.log('='.repeat(50));

if (allGood) {
  console.log('✅ SPA build is healthy!');
  console.log('🚀 Ready for deployment');
} else {
  console.log(`❌ Found ${issues.length} issues:\n`);
  issues.forEach(issue => {
    console.log(`   ${issue.name}:`);
    console.log(`   💡 Fix: ${issue.fix}`);
  });
}

process.exit(allGood ? 0 : 1);
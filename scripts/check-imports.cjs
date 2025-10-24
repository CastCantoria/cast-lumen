const fs = require('fs');
const path = require('path');

function checkImports() {
  const srcDir = path.join(__dirname, '..', 'src');
  let hasErrors = false;

  function checkFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const importRegex = /from\s+["']([^"']+)["']/g;
      let match;

      while ((match = importRegex.exec(content)) !== null) {
        const importPath = match[1];
        
        // Ignorer les imports de modules externes
        if (!importPath.startsWith('.')) {
          continue;
        }

        const resolvedPath = resolveImportPath(filePath, importPath);
        
        if (!resolvedPath) {
          console.log(`❌ ${path.relative(process.cwd(), filePath)} → ${importPath} introuvable`);
          hasErrors = true;
        }
      }
    } catch (error) {
      console.log(`⚠️  Erreur lecture: ${filePath}`, error.message);
    }
  }

  function resolveImportPath(fromFile, importPath) {
    const dir = path.dirname(fromFile);
    const absolutePath = path.resolve(dir, importPath);
    
    // Essayer différentes extensions
    const extensions = ['.jsx', '.js', '/index.jsx', '/index.js'];
    
    for (const ext of extensions) {
      const testPath = absolutePath + ext;
      if (fs.existsSync(testPath)) {
        return testPath;
      }
    }
    
    // Vérifier si c'est un dossier
    if (fs.existsSync(absolutePath) && fs.statSync(absolutePath).isDirectory()) {
      return absolutePath;
    }
    
    // Vérifier sans extension
    if (fs.existsSync(absolutePath)) {
      return absolutePath;
    }
    
    return null;
  }

  function traverseDirectory(dir) {
    try {
      const files = fs.readdirSync(dir);
      
      for (const file of files) {
        const fullPath = path.join(dir, file);
        
        try {
          const stat = fs.statSync(fullPath);
          
          if (stat.isDirectory()) {
            traverseDirectory(fullPath);
          } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
            checkFile(fullPath);
          }
        } catch (error) {
          console.log(`⚠️  Accès refusé: ${fullPath}`);
        }
      }
    } catch (error) {
      console.log(`⚠️  Dossier inaccessible: ${dir}`);
    }
  }

  console.log('🔍 Vérification des imports...');
  traverseDirectory(srcDir);
  
  if (!hasErrors) {
    console.log('✅ Tous les imports sont valides !');
  } else {
    console.log('\n💡 Solutions:');
    console.log('1. Créer les fichiers manquants');
    console.log('2. Corriger les chemins d\'import');
    console.log('3. Supprimer les imports inutiles');
  }
  
  return hasErrors;
}

// Exécuter la vérification
const hasErrors = checkImports();
process.exit(hasErrors ? 1 : 0);
import fs from 'fs';
import path from 'path';

console.log('🔧 Correction des imports Dashboard.jsx...');

const dashboardPath = 'src/components/Dashboard.jsx';

if (fs.existsSync(dashboardPath)) {
  let content = fs.readFileSync(dashboardPath, 'utf8');
  
  console.log('📝 Correction des imports problématiques...');
  
  // Remplacer les imports manquants par les nouveaux chemins
  content = content
    .replace(/from\s+['"]\.\/admin\/SuperAdminDashboard['"]/g, "from '../../pages/app/dashboards/super-admin/SuperAdminDashboard'")
    .replace(/from\s+['"]\.\/admin\/AdminDashboard['"]/g, "from '../../pages/app/dashboards/admin/AdminDashboard'")
    .replace(/from\s+['"]\.\/CoreTeamDashboard['"]/g, "// from './CoreTeamDashboard' // TODO: Créer ce composant si nécessaire")
    .replace(/from\s+['"]\.\/UserDashboard['"]/g, "from '../../pages/app/dashboards/user/UserDashboard'");
  
  fs.writeFileSync(dashboardPath, content);
  console.log('✅ Dashboard.jsx corrigé !');
} else {
  console.log('ℹ️  Dashboard.jsx non trouvé - peut-être déjà migré');
}

console.log('🎉 Corrections appliquées !');
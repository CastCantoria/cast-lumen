import fs from 'fs';
import path from 'path';

console.log('🚀 RÉORGANISATION COMPLÈTE DE LA STRUCTURE...\n');

// Nouvelle structure cible
const TARGET_STRUCTURE = {
  // Auth
  'src/auth': [
    'Login.jsx',
    'Register.jsx',
    'Logout.jsx',
    'Profile.jsx',
    'AuthGuard.jsx',
    'SimpleLogin.jsx',
    'components/ProtectedRoute.jsx',
    'components/PermissionGuard.jsx',
    'components/RequireAuth.jsx',
    'components/RequireRole.jsx'
  ],

  // Contexts
  'src/contexts': [
    'AuthContext.jsx',
    'GalleryContext.jsx'
  ],

  // Components organisés
  'src/components/layout': [
    'Header.jsx',
    'Footer.jsx',
    'AdminSidebar.jsx'
  ],

  'src/components/ui': [
    'Button.jsx',
    'Card.jsx',
    'LoadingSpinner.jsx',
    'TestTailwind.jsx'
  ],

  'src/components/events': [
    'EventBooking.jsx',
    'EventDetails.jsx',
    'EventsCalendar.jsx',
    'EventsList.jsx'
  ],

  'src/components/gallery': [
    'Gallery.jsx',
    'GalleryGrid.jsx',
    'PhotosGallery.jsx',
    'VideosGallery.jsx',
    'ConcertsGallery.jsx',
    'AudioPlayer.jsx',
    'VideoThumbnail.jsx',
    'MediaModal.jsx',
    'LazyImage.jsx',
    'FilterTags.jsx'
  ],

  'src/components/repertoire': [
    'RepertoireList.jsx',
    'RepertoireItem.jsx',
    'AddRepertoire.jsx',
    'RepertoireFilters.jsx'
  ],

  'src/components/admin': [
    'AdminNavigation.jsx',
    'AdminBookings.jsx',
    'AdminEventForm.jsx',
    'AdminEventList.jsx',
    'AdminEventBookings.jsx',
    'UserManagement.jsx',
    'AdmissionManagement.jsx',
    'EventCreation.jsx',
    'EventCalendar.jsx',
    'PartitionManager.jsx',
    'GalleryManager.jsx',
    'ArticlePublisher.jsx',
    'MemberInviter.jsx',
    'RoleManagement.jsx',
    'SystemSettings.jsx'
  ],

  'src/components/media': [
    'MediaUpload.jsx'
  ],

  'src/components/sections': [
    'HeroSlider.jsx'
  ],

  // Pages organisées
  'src/pages/public': [
    'Home.jsx',
    'About.jsx',
    'Contact.jsx',
    'Join.jsx',
    'JoinSuccess.jsx',
    'Blog.jsx',
    'Concerts.jsx',
    'Galerie.jsx',
    'Repertoire.jsx',
    'Spiritualite.jsx',
    'Partenaires.jsx'
  ],

  'src/pages/auth': [
    'LoginPage.jsx',
    'RegisterPage.jsx'
  ],

  'src/pages/app/profile': [
    'ProfilePage.jsx'
  ],

  'src/pages/app/dashboards': [
    'user/UserDashboard.jsx',
    'member/MemberDashboard.jsx',
    'admin/AdminDashboard.jsx',
    'super-admin/SuperAdminDashboard.jsx'
  ],

  'src/pages/app/admin': [
    'UserManagement.jsx',
    'EventManagement.jsx',
    'RepertoireManagement.jsx'
  ],

  // Config
  'src/config': [
    'firebase.js',
    'contacts.js',
    'emailConfig.js',
    'eventsSchema.js',
    'repertoireSchema.js',
    'roles.js'
  ],

  // Hooks
  'src/hooks': [
    'useAuth.js',
    'useAuthorization.js',
    'useRole.js'
  ],

  // Services
  'src/services': [
    'emailService.js',
    'eventsService.js',
    'repertoireService.js',
    'statsService.js',
    'reminderService.js',
    'deviceService.js'
  ],

  // Utils
  'src/utils': [
    'firestore.js'
  ],

  // Styles
  'src/styles': [
    'tailwind.css'
  ]
};

// Mapping des fichiers existants vers nouveaux chemins
const FILE_MAPPING = {
  // Auth
  'src/auth/Login.jsx': 'src/auth/Login.jsx',
  'src/auth/Register.jsx': 'src/auth/Register.jsx',
  'src/auth/Logout.jsx': 'src/auth/Logout.jsx',
  'src/auth/Profile.jsx': 'src/auth/Profile.jsx',
  'src/auth/AuthGuard.jsx': 'src/auth/AuthGuard.jsx',
  'src/auth/SimpleLogin.jsx': 'src/auth/SimpleLogin.jsx',

  // Components Auth
  'src/components/auth/ProtectedRoute.jsx': 'src/auth/components/ProtectedRoute.jsx',
  'src/components/auth/PermissionGuard.jsx': 'src/auth/components/PermissionGuard.jsx',
  'src/components/RequireAuth.jsx': 'src/auth/components/RequireAuth.jsx',
  'src/components/RequireRole.jsx': 'src/auth/components/RequireRole.jsx',

  // Contexts
  'src/contexts/AuthContext.jsx': 'src/contexts/AuthContext.jsx',
  'src/contexts/GalleryContext.jsx': 'src/contexts/GalleryContext.jsx',
  'src/contexts/NewAuthContext.jsx': 'src/contexts/AuthContext.jsx', // Fusion

  // Layout
  'src/components/layout/Header.jsx': 'src/components/layout/Header.jsx',
  'src/components/layout/Footer.jsx': 'src/components/layout/Footer.jsx',
  'src/components/layout/AdminSidebar.jsx': 'src/components/layout/AdminSidebar.jsx',

  // UI Components
  'src/components/TestTailwind.jsx': 'src/components/ui/TestTailwind.jsx',
  'src/components/ui/Button.jsx': 'src/components/ui/Button.jsx',
  'src/components/ui/Card.jsx': 'src/components/ui/Card.jsx',
  'src/components/ui/LoadingSpinner.jsx': 'src/components/ui/LoadingSpinner.jsx',

  // Events
  'src/components/events/EventBooking.jsx': 'src/components/events/EventBooking.jsx',
  'src/components/events/EventDetails.jsx': 'src/components/events/EventDetails.jsx',
  'src/components/events/EventsCalendar.jsx': 'src/components/events/EventsCalendar.jsx',
  'src/components/events/EventsList.jsx': 'src/components/events/EventsList.jsx',

  // Gallery
  'src/components/gallery/Gallery.jsx': 'src/components/gallery/Gallery.jsx',
  'src/components/gallery/GalleryGrid.jsx': 'src/components/gallery/GalleryGrid.jsx',
  'src/components/gallery/PhotosGallery.jsx': 'src/components/gallery/PhotosGallery.jsx',
  'src/components/gallery/VideosGallery.jsx': 'src/components/gallery/VideosGallery.jsx',
  'src/components/gallery/ConcertsGallery.jsx': 'src/components/gallery/ConcertsGallery.jsx',
  'src/components/gallery/AudioPlayer.jsx': 'src/components/gallery/AudioPlayer.jsx',
  'src/components/gallery/VideoThumbnail.jsx': 'src/components/gallery/VideoThumbnail.jsx',
  'src/components/gallery/MediaModal.jsx': 'src/components/gallery/MediaModal.jsx',
  'src/components/gallery/LazyImage.jsx': 'src/components/gallery/LazyImage.jsx',
  'src/components/gallery/FilterTags.jsx': 'src/components/gallery/FilterTags.jsx',

  // Repertoire
  'src/components/repertoire/RepertoireList.jsx': 'src/components/repertoire/RepertoireList.jsx',
  'src/components/repertoire/RepertoireItem.jsx': 'src/components/repertoire/RepertoireItem.jsx',
  'src/components/repertoire/AddRepertoire.jsx': 'src/components/repertoire/AddRepertoire.jsx',
  'src/components/repertoire/RepertoireFilters.jsx': 'src/components/repertoire/RepertoireFilters.jsx',

  // Admin Components
  'src/components/admin/AdminNavigation.jsx': 'src/components/admin/AdminNavigation.jsx',
  'src/components/admin/AdminBookings.jsx': 'src/components/admin/AdminBookings.jsx',
  'src/components/admin/AdminEventForm.jsx': 'src/components/admin/AdminEventForm.jsx',
  'src/components/admin/AdminEventList.jsx': 'src/components/admin/AdminEventList.jsx',
  'src/components/admin/AdminEventBookings.jsx': 'src/components/admin/AdminEventBookings.jsx',
  'src/components/admin/UserManagement.jsx': 'src/components/admin/UserManagement.jsx',
  'src/components/admin/AdmissionManagement.jsx': 'src/components/admin/AdmissionManagement.jsx',
  'src/components/admin/EventCreation.jsx': 'src/components/admin/EventCreation.jsx',
  'src/components/admin/EventCalendar.jsx': 'src/components/admin/EventCalendar.jsx',
  'src/components/admin/PartitionManager.jsx': 'src/components/admin/PartitionManager.jsx',
  'src/components/admin/GalleryManager.jsx': 'src/components/admin/GalleryManager.jsx',
  'src/components/admin/ArticlePublisher.jsx': 'src/components/admin/ArticlePublisher.jsx',
  'src/components/admin/MemberInviter.jsx': 'src/components/admin/MemberInviter.jsx',
  'src/components/admin/RoleManagement.jsx': 'src/components/admin/RoleManagement.jsx',
  'src/components/admin/SystemSettings.jsx': 'src/components/admin/SystemSettings.jsx',

  // Media
  'src/components/media/MediaUpload.jsx': 'src/components/media/MediaUpload.jsx',

  // Sections
  'src/components/sections/HeroSlider.jsx': 'src/components/sections/HeroSlider.jsx',

  // Pages Public
  'src/pages/public/Home.jsx': 'src/pages/public/Home.jsx',
  'src/pages/public/About.jsx': 'src/pages/public/About.jsx',
  'src/pages/public/Contact.jsx': 'src/pages/public/Contact.jsx',
  'src/pages/public/Join.jsx': 'src/pages/public/Join.jsx',
  'src/pages/public/JoinSuccess.jsx': 'src/pages/public/JoinSuccess.jsx',
  'src/pages/public/Blog.jsx': 'src/pages/public/Blog.jsx',
  'src/pages/public/Concerts.jsx': 'src/pages/public/Concerts.jsx',
  'src/pages/public/Galerie.jsx': 'src/pages/public/Galerie.jsx',
  'src/pages/public/Repertoire.jsx': 'src/pages/public/Repertoire.jsx',
  'src/pages/public/Spiritualite.jsx': 'src/pages/public/Spiritualite.jsx',
  'src/pages/public/Partenaires.jsx': 'src/pages/public/Partenaires.jsx',

  // Auth Pages
  'src/auth/Login.jsx': 'src/pages/auth/LoginPage.jsx',
  'src/auth/Register.jsx': 'src/pages/auth/RegisterPage.jsx',

  // Profile
  'src/auth/Profile.jsx': 'src/pages/app/profile/ProfilePage.jsx',
  'src/pages/private/Profile.jsx': 'src/pages/app/profile/ProfilePage.jsx',

  // Dashboards
  'src/pages/dashboard/user/UserDashboard.jsx': 'src/pages/app/dashboards/user/UserDashboard.jsx',
  'src/pages/dashboard/member/MemberDashboard.jsx': 'src/pages/app/dashboards/member/MemberDashboard.jsx',
  'src/pages/dashboard/admin/AdminDashboard.jsx': 'src/pages/app/dashboards/admin/AdminDashboard.jsx',
  'src/pages/dashboard/super-admin/SuperAdminDashboard.jsx': 'src/pages/app/dashboards/super-admin/SuperAdminDashboard.jsx',
  'src/pages/private/Dashboard.jsx': 'src/pages/app/dashboards/user/UserDashboard.jsx',
  'src/pages/private/SuperAdminDashboard.jsx': 'src/pages/app/dashboards/super-admin/SuperAdminDashboard.jsx',
  'src/components/Dashboard/Dashboard.jsx': 'src/pages/app/dashboards/user/UserDashboard.jsx',

  // Admin Pages
  'src/pages/admin/AdminDashboard.jsx': 'src/pages/app/admin/UserManagement.jsx',
  'src/pages/admin/UserManagement.jsx': 'src/pages/app/admin/UserManagement.jsx',
  'src/pages/admin/EventManagement.jsx': 'src/pages/app/admin/EventManagement.jsx',
  'src/pages/admin/RepertoireManagement.jsx': 'src/pages/app/admin/RepertoireManagement.jsx',

  // Config
  'src/config/contacts.js': 'src/config/contacts.js',
  'src/config/emailConfig.js': 'src/config/emailConfig.js',
  'src/config/eventsSchema.js': 'src/config/eventsSchema.js',
  'src/config/firebase.js': 'src/config/firebase.js',
  'src/config/repertoireSchema.js': 'src/config/repertoireSchema.js',
  'src/config/roles.js': 'src/config/roles.js',

  // Hooks
  'src/hooks/useAuth.js': 'src/hooks/useAuth.js',
  'src/hooks/useAuthorization.js': 'src/hooks/useAuthorization.js',
  'src/hooks/useRole.js': 'src/hooks/useRole.js',

  // Services
  'src/services/emailService.js': 'src/services/emailService.js',
  'src/services/eventsService.js': 'src/services/eventsService.js',
  'src/services/repertoireService.js': 'src/services/repertoireService.js',
  'src/services/statsService.js': 'src/services/statsService.js',
  'src/services/reminderService.js': 'src/services/reminderService.js',
  'src/services/deviceService.js': 'src/services/deviceService.js',

  // Utils
  'src/utils/firestore.js': 'src/utils/firestore.js',

  // Styles
  'src/styles/tailwind.css': 'src/styles/tailwind.css'
};

// Fonction pour créer les dossiers
function createDirectories() {
  console.log('📁 Création de la structure de dossiers...');
  
  Object.keys(TARGET_STRUCTURE).forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`✅ ${dir}`);
    }
  });
}

// Fonction pour déplacer les fichiers
async function moveFiles() {
  console.log('\n📦 Déplacement des fichiers...');
  let movedCount = 0;

  for (const [source, destination] of Object.entries(FILE_MAPPING)) {
    if (fs.existsSync(source)) {
      try {
        // Créer le dossier de destination
        const destDir = path.dirname(destination);
        if (!fs.existsSync(destDir)) {
          fs.mkdirSync(destDir, { recursive: true });
        }

        // Lire le contenu
        let content = fs.readFileSync(source, 'utf8');
        
        // Mettre à jour les imports (simplifié pour l'instant)
        content = updateImports(content, source, destination);
        
        // Écrire à la nouvelle destination
        fs.writeFileSync(destination, content);
        console.log(`✅ ${source} → ${destination}`);
        movedCount++;

      } catch (error) {
        console.log(`❌ Erreur avec ${source}: ${error.message}`);
      }
    }
  }

  console.log(`\n📊 ${movedCount} fichiers déplacés`);
}

// Fonction simplifiée pour mettre à jour les imports
function updateImports(content, oldPath, newPath) {
  // Mise à jour basique des imports communs
  const importUpdates = {
    '../auth/Login': '../pages/auth/LoginPage',
    '../auth/Register': '../pages/auth/RegisterPage',
    './components/auth/ProtectedRoute': './auth/components/ProtectedRoute',
    '../../contexts/AuthContext': '../../../contexts/AuthContext',
    '../../components/layout/Header': '../../../components/layout/Header'
  };

  let updatedContent = content;
  Object.entries(importUpdates).forEach(([oldImp, newImp]) => {
    const regex = new RegExp(oldImp.replace(/\//g, '\\/'), 'g');
    updatedContent = updatedContent.replace(regex, newImp);
  });

  return updatedContent;
}

// Fonction pour créer les fichiers manquants essentiels
function createEssentialFiles() {
  console.log('\n📄 Création des fichiers essentiels manquants...');
  
  const essentialFiles = {
    'src/pages/auth/LoginPage.jsx': `import React from 'react';
import Login from '../../auth/Login';

const LoginPage = () => {
  return <Login />;
};

export default LoginPage;
`,

    'src/pages/auth/RegisterPage.jsx': `import React from 'react';
import Register from '../../auth/Register';

const RegisterPage = () => {
  return <Register />;
};

export default RegisterPage;
`,

    'src/components/ui/Button.jsx': `import React from 'react';

const Button = ({ children, variant = 'primary', ...props }) => {
  const baseClasses = 'px-4 py-2 rounded-lg font-medium transition-colors';
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700',
    danger: 'bg-red-600 text-white hover:bg-red-700'
  };
  
  return (
    <button className={\`\${baseClasses} \${variants[variant]}\`} {...props}>
      {children}
    </button>
  );
};

export default Button;
`,

    'src/components/ui/Card.jsx': `import React from 'react';

const Card = ({ children, className = '' }) => {
  return (
    <div className={\`bg-white rounded-lg shadow-lg p-6 \${className}\`}>
      {children}
    </div>
  );
};

export default Card;
`,

    'src/components/ui/LoadingSpinner.jsx': `import React from 'react';

const LoadingSpinner = ({ size = 'medium' }) => {
  const sizes = {
    small: 'w-6 h-6',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };
  
  return (
    <div className="flex items-center justify-center">
      <div className={\`\${sizes[size]} border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin\`}></div>
    </div>
  );
};

export default LoadingSpinner;
`
  };

  Object.entries(essentialFiles).forEach(([filePath, content]) => {
    if (!fs.existsSync(filePath)) {
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(filePath, content);
      console.log(`✅ ${filePath}`);
    }
  });
}

// Fonction pour nettoyer les anciens dossiers
function listOldDirectories() {
  console.log('\n🧹 Anciens dossiers à supprimer (après vérification):');
  
  const oldDirs = [
    'src/admin',
    'src/components/Dashboard',
    'src/pages/dashboard',
    'src/pages/private',
    'src/pages/member',
    'src/lib',
    'src/middleware',
    'src/scripts'
  ];

  oldDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      console.log(`📁 ${dir}`);
    }
  });

  console.log('\n⚠️  Supprimez manuellement après vérification:');
  console.log('rm -rf src/admin src/components/Dashboard src/pages/dashboard src/pages/private src/pages/member src/lib src/middleware src/scripts');
}

// Exécution principale
async function main() {
  try {
    createDirectories();
    await moveFiles();
    createEssentialFiles();
    listOldDirectories();
    
    console.log('\n🎉 RÉORGANISATION TERMINÉE !');
    console.log('\n📋 Prochaines étapes:');
    console.log('1. Vérifiez que l\'application fonctionne');
    console.log('2. Testez les routes principales');
    console.log('3. Corrigez les imports manquants si nécessaire');
    console.log('4. Supprimez les anciens dossiers listés ci-dessus');
    
  } catch (error) {
    console.error('❌ Erreur lors de la réorganisation:', error);
  }
}

main();
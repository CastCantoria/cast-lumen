#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Configuration des composants à mettre à jour
const ADMIN_COMPONENTS_DIR = path.join(__dirname, '../src/components/admin');
const COMPONENTS_TO_UPDATE = [
  'AdmissionManagement.jsx',
  'ArticlePublisher.jsx', 
  'EventCalendar.jsx',
  'EventCreation.jsx',
  'GalleryManager.jsx',
  'MemberInviter.jsx',
  'PartitionManager.jsx',
  'RoleManagement.jsx',
  'SystemSettings.jsx',
  'UserManagement.jsx'
];

// Template pour les composants mis à jour
const COMPONENT_TEMPLATE = (componentName, displayName) => `import React from 'react';
import AdminNavigation from './AdminNavigation';
import '../admin/AdminLayout.css';

const ${componentName} = () => {
  return (
    <div className="admin-layout">
      <AdminNavigation />
      <div className="admin-content">
        <div className="content-header">
          <h1>${displayName}</h1>
          <p>Gestion ${getComponentDescription(componentName)}</p>
        </div>
        
        <div className="content-body">
          {/* Contenu spécifique au composant */}
          <div className="component-content">
            <h2>Fonctionnalités ${getComponentTitle(componentName)}</h2>
            <div className="feature-grid">
              ${getComponentFeatures(componentName)}
            </div>
            
            {/* Espace pour le contenu existant */}
            <div className="existing-content">
              {/* Le contenu original sera préservé ici */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ${componentName};
`;

// Fonctions utilitaires
function getComponentTitle(componentName) {
  const titles = {
    'AdmissionManagement': 'des Admissions',
    'ArticlePublisher': 'des Articles', 
    'EventCalendar': 'du Calendrier',
    'EventCreation': 'des Événements',
    'GalleryManager': 'de la Galerie',
    'MemberInviter': "d'Invitation",
    'PartitionManager': 'des Partitions',
    'RoleManagement': 'des Rôles',
    'SystemSettings': 'des Paramètres',
    'UserManagement': 'des Membres'
  };
  return titles[componentName] || 'Admin';
}

function getComponentDescription(componentName) {
  const descriptions = {
    'AdmissionManagement': 'des admissions et inscriptions des nouveaux membres',
    'ArticlePublisher': 'et publication des articles et actualités',
    'EventCalendar': 'du calendrier des événements et concerts', 
    'EventCreation': 'et création des événements culturels',
    'GalleryManager': 'de la galerie média et photos',
    'MemberInviter': "et invitation des nouveaux membres",
    'PartitionManager': 'des partitions musicales',
    'RoleManagement': 'des rôles et permissions',
    'SystemSettings': 'système et configuration',
    'UserManagement': 'des membres et utilisateurs'
  };
  return descriptions[componentName] || 'admin';
}

function getComponentFeatures(componentName) {
  const features = {
    'AdmissionManagement': `
              <div className="feature-card">
                <h3>✅ Admissions en attente</h3>
                <p>Gérer les demandes d'admission</p>
              </div>
              <div className="feature-card">
                <h3>👥 Validation des profils</h3>
                <p>Approuver les nouveaux membres</p>
              </div>
              <div className="feature-card">
                <h3>📊 Statistiques admissions</h3>
                <p>Suivre les inscriptions</p>
              </div>
    `,
    'ArticlePublisher': `
              <div className="feature-card">
                <h3>📝 Rédaction</h3>
                <p>Créer et éditer des articles</p>
              </div>
              <div className="feature-card">
                <h3>🖼️ Médiathèque</h3>
                <p>Gérer les images et médias</p>
              </div>
              <div className="feature-card">
                <h3>📰 Publication</h3>
                <p>Programmer et publier</p>
              </div>
    `,
    'EventCalendar': `
              <div className="feature-card">
                <h3>📅 Vue calendrier</h3>
                <p>Visualiser tous les événements</p>
              </div>
              <div className="feature-card">
                <h3>🎭 Gestion dates</h3>
                <p>Modifier les dates et horaires</p>
              </div>
              <div className="feature-card">
                <h3>👥 Participants</h3>
                <p>Voir les inscriptions</p>
              </div>
    `,
    'EventCreation': `
              <div className="feature-card">
                <h3>🎵 Création événements</h3>
                <p>Nouveaux concerts et répétitions</p>
              </div>
              <div className="feature-card">
                <h3>📋 Détails complets</h3>
                <p>Informations détaillées</p>
              </div>
              <div className="feature-card">
                <h3>🔔 Notifications</h3>
                <p>Alertes aux membres</p>
              </div>
    `,
    'GalleryManager': `
              <div className="feature-card">
                <h3>🖼️ Upload médias</h3>
                <p>Ajouter photos et vidéos</p>
              </div>
              <div className="feature-card">
                <h3>🏷️ Organisation</h3>
                <p>Catégoriser et taguer</p>
              </div>
              <div className="feature-card">
                <h3>👁️ Visibilité</h3>
                <p>Gérer les permissions</p>
              </div>
    `,
    'MemberInviter': `
              <div className="feature-card">
                <h3>📧 Invitations</h3>
                <p>Envoyer des invitations</p>
              </div>
              <div className="feature-card">
                <h3>👥 Rôles</h3>
                <p>Assigner des rôles</p>
              </div>
              <div className="feature-card">
                <h3>📊 Suivi</h3>
                <p>Statut des invitations</p>
              </div>
    `,
    'PartitionManager': `
              <div className="feature-card">
                <h3>🎼 Ajout partitions</h3>
                <p>Nouvelles partitions</p>
              </div>
              <div className="feature-card">
                <h3>📁 Organisation</h3>
                <p>Catégories et répertoire</p>
              </div>
              <div className="feature-card">
                <h3>👥 Accès</h3>
                <p>Gérer les permissions</p>
              </div>
    `,
    'RoleManagement': `
              <div className="feature-card">
                <h3>👑 Super-Admins</h3>
                <p>Gestion des super-administrateurs</p>
              </div>
              <div className="feature-card">
                <h3>⚙️ Admins</h3>
                <p>Administrateurs standards</p>
              </div>
              <div className="feature-card">
                <h3>🎵 Core Team</h3>
                <p>Équipe principale</p>
              </div>
    `,
    'SystemSettings': `
              <div className="feature-card">
                <h3>⚙️ Configuration</h3>
                <p>Paramètres système</p>
              </div>
              <div className="feature-card">
                <h3>🔐 Sécurité</h3>
                <p>Paramètres de sécurité</p>
              </div>
              <div className="feature-card">
                <h3>📊 Analytics</h3>
                <p>Statistiques et rapports</p>
              </div>
    `,
    'UserManagement': `
              <div className="feature-card">
                <h3>👥 Tous les membres</h3>
                <p>Liste complète des utilisateurs</p>
              </div>
              <div className="feature-card">
                <h3>📊 Statistiques</h3>
                <p>Analytics et activité</p>
              </div>
              <div className="feature-card">
                <h3>🔧 Gestion</h3>
                <p>Modifier profils et rôles</p>
              </div>
    `
  };
  return features[componentName] || '<p>Fonctionnalités en développement</p>';
}

// Fonction principale
async function updateAdminComponents() {
  console.log('🔄 Mise à jour des composants admin...\n');
  
  let updatedCount = 0;
  let errorCount = 0;

  for (const componentFile of COMPONENTS_TO_UPDATE) {
    try {
      const componentPath = path.join(ADMIN_COMPONENTS_DIR, componentFile);
      
      // Vérifier si le fichier existe
      if (!fs.existsSync(componentPath)) {
        console.log(`❌ Fichier non trouvé: ${componentFile}`);
        errorCount++;
        continue;
      }

      const componentName = componentFile.replace('.jsx', '');
      const displayName = getComponentTitle(componentName);
      
      // Lire le contenu original pour le préserver
      const originalContent = fs.readFileSync(componentPath, 'utf8');
      
      // Générer le nouveau contenu
      const newContent = COMPONENT_TEMPLATE(componentName, displayName);
      
      // Sauvegarder l'ancienne version
      const backupPath = componentPath + '.backup';
      fs.writeFileSync(backupPath, originalContent);
      
      // Écrire la nouvelle version
      fs.writeFileSync(componentPath, newContent);
      
      console.log(`✅ ${componentFile} mis à jour (backup: ${componentFile}.backup)`);
      updatedCount++;
      
    } catch (error) {
      console.log(`❌ Erreur avec ${componentFile}:`, error.message);
      errorCount++;
    }
  }

  console.log('\n📊 RÉSULTAT:');
  console.log(`✅ ${updatedCount} composants mis à jour`);
  console.log(`❌ ${errorCount} erreurs`);
  
  if (errorCount === 0) {
    console.log('\n🎉 Tous les composants admin ont été mis à jour avec succès!');
    console.log('\n📝 Prochaines étapes:');
    console.log('1. Vérifier les backups créés (*.backup)');
    console.log('2. Tester l\'application');
    console.log('3. Supprimer les backups si tout fonctionne');
  } else {
    console.log('\n⚠️  Certains composants n\'ont pas pu être mis à jour');
    console.log('Vérifiez les erreurs ci-dessus et exécutez à nouveau le script.');
  }
}

// Exécuter le script
updateAdminComponents().catch(console.error);
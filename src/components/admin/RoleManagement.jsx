import React, { useState } from 'react';

// Configuration des rôles et permissions (à déplacer dans config/roles.js si nécessaire)
const ROLES = {
  SUPER_ADMIN: 'super-admin',
  ADMIN: 'admin', 
  CORE_TEAM: 'core-team',
  REGISTERED_USER: 'membre'
};

const PERMISSIONS = {
  // Gouvernance
  MANAGE_POLICIES: 'manage_policies',
  MANAGE_ALL_ACCOUNTS: 'manage_all_accounts',
  SECURITY_CRITICAL: 'security_critical',
  CMS_DECISIONS: 'cms_decisions',
  EXTERNAL_RELATIONS: 'external_relations',
  
  // Opérations
  MANAGE_CONTENT: 'manage_content',
  MANAGE_USERS: 'manage_users',
  MODERATE_COMMUNITY: 'moderate_community',
  VIEW_ANALYTICS: 'view_analytics',
  TECHNICAL_COORDINATION: 'technical_coordination',
  
  // Médias
  PUBLISH_MEDIA: 'publish_media',
  MANAGE_RESOURCES: 'manage_resources',
  LIMITED_MODERATION: 'limited_moderation',
  TASK_MANAGEMENT: 'task_management',
  USER_SUPPORT: 'user_support',
  
  // Interaction
  ACCESS_PREMIUM_CONTENT: 'access_premium_content',
  INTERACT_CONTENT: 'interact_content',
  SUBMIT_CONTRIBUTIONS: 'submit_contributions',
  MANAGE_PROFILE: 'manage_profile'
};

const ROLE_PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: [
    PERMISSIONS.MANAGE_POLICIES,
    PERMISSIONS.MANAGE_ALL_ACCOUNTS,
    PERMISSIONS.SECURITY_CRITICAL,
    PERMISSIONS.CMS_DECISIONS,
    PERMISSIONS.EXTERNAL_RELATIONS,
    PERMISSIONS.MANAGE_CONTENT,
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.MODERATE_COMMUNITY,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.TECHNICAL_COORDINATION,
    PERMISSIONS.PUBLISH_MEDIA,
    PERMISSIONS.MANAGE_RESOURCES,
    PERMISSIONS.LIMITED_MODERATION,
    PERMISSIONS.TASK_MANAGEMENT,
    PERMISSIONS.USER_SUPPORT,
    PERMISSIONS.ACCESS_PREMIUM_CONTENT,
    PERMISSIONS.INTERACT_CONTENT,
    PERMISSIONS.SUBMIT_CONTRIBUTIONS,
    PERMISSIONS.MANAGE_PROFILE
  ],
  [ROLES.ADMIN]: [
    PERMISSIONS.MANAGE_CONTENT,
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.MODERATE_COMMUNITY,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.TECHNICAL_COORDINATION,
    PERMISSIONS.PUBLISH_MEDIA,
    PERMISSIONS.MANAGE_RESOURCES,
    PERMISSIONS.LIMITED_MODERATION,
    PERMISSIONS.TASK_MANAGEMENT,
    PERMISSIONS.USER_SUPPORT,
    PERMISSIONS.ACCESS_PREMIUM_CONTENT,
    PERMISSIONS.INTERACT_CONTENT,
    PERMISSIONS.SUBMIT_CONTRIBUTIONS,
    PERMISSIONS.MANAGE_PROFILE
  ],
  [ROLES.CORE_TEAM]: [
    PERMISSIONS.PUBLISH_MEDIA,
    PERMISSIONS.MANAGE_RESOURCES,
    PERMISSIONS.LIMITED_MODERATION,
    PERMISSIONS.TASK_MANAGEMENT,
    PERMISSIONS.USER_SUPPORT,
    PERMISSIONS.ACCESS_PREMIUM_CONTENT,
    PERMISSIONS.INTERACT_CONTENT,
    PERMISSIONS.SUBMIT_CONTRIBUTIONS,
    PERMISSIONS.MANAGE_PROFILE
  ],
  [ROLES.REGISTERED_USER]: [
    PERMISSIONS.ACCESS_PREMIUM_CONTENT,
    PERMISSIONS.INTERACT_CONTENT,
    PERMISSIONS.SUBMIT_CONTRIBUTIONS,
    PERMISSIONS.MANAGE_PROFILE
  ]
};

// Matrice RACI simplifiée
const RACI_MATRIX = {
  strategic_planning: {
    [ROLES.SUPER_ADMIN]: 'A',
    [ROLES.ADMIN]: 'R',
    [ROLES.CORE_TEAM]: 'C',
    [ROLES.REGISTERED_USER]: 'I'
  },
  content_management: {
    [ROLES.SUPER_ADMIN]: 'A',
    [ROLES.ADMIN]: 'R',
    [ROLES.CORE_TEAM]: 'R',
    [ROLES.REGISTERED_USER]: 'I'
  },
  user_management: {
    [ROLES.SUPER_ADMIN]: 'A',
    [ROLES.ADMIN]: 'R',
    [ROLES.CORE_TEAM]: 'C',
    [ROLES.REGISTERED_USER]: 'I'
  },
  media_publication: {
    [ROLES.SUPER_ADMIN]: 'A',
    [ROLES.ADMIN]: 'R',
    [ROLES.CORE_TEAM]: 'R',
    [ROLES.REGISTERED_USER]: 'I'
  },
  community_moderation: {
    [ROLES.SUPER_ADMIN]: 'A',
    [ROLES.ADMIN]: 'R',
    [ROLES.CORE_TEAM]: 'R',
    [ROLES.REGISTERED_USER]: 'I'
  },
  technical_maintenance: {
    [ROLES.SUPER_ADMIN]: 'A',
    [ROLES.ADMIN]: 'R',
    [ROLES.CORE_TEAM]: 'C',
    [ROLES.REGISTERED_USER]: 'I'
  }
};

const RoleManagement = () => {
  const [selectedRole, setSelectedRole] = useState(ROLES.SUPER_ADMIN);

  const roleDescriptions = {
    [ROLES.SUPER_ADMIN]: {
      title: "Super-Administrateur",
      description: "Gouvernance complète, sécurité critique et décisions stratégiques",
      responsibilities: [
        "Définition des politiques et conformité",
        "Gestion des comptes et permissions tous niveaux",
        "Sécurité critique (MFA, logs, incidents)",
        "Décisions majeures CMS et communications",
        "Suivi des rapports et relations externes"
      ]
    },
    [ROLES.ADMIN]: {
      title: "Administrateur",
      description: "Gestion opérationnelle et coordination technique",
      responsibilities: [
        "Gestion opérationnelle des contenus et utilisateurs",
        "Publication et validation de contenus clés",
        "Modération et règles communautaires",
        "Suivi des performances et reporting",
        "Coordination technique et support interne"
      ]
    },
    [ROLES.CORE_TEAM]: {
      title: "Membre Core Team",
      description: "Publication média et gestion des ressources",
      responsibilities: [
        "Publication et gestion du contenu média",
        "Gestion des ressources (droits, licences)",
        "Modération limitée et support opérationnel",
        "Suivi des tâches et collaboration",
        "Assistance et communication utilisateurs"
      ]
    },
    [ROLES.REGISTERED_USER]: {
      title: "Utilisateur Inscrit",
      description: "Accès premium et participation communautaire",
      responsibilities: [
        "Accès au contenu public et premium",
        "Interaction (commentaires, likes, sondages)",
        "Propositions via flux de contributions",
        "Gestion du profil et préférences",
        "Respect des règles et sécurité"
      ]
    }
  };

  const permissionCategories = {
    governance: [
      PERMISSIONS.MANAGE_POLICIES,
      PERMISSIONS.MANAGE_ALL_ACCOUNTS,
      PERMISSIONS.SECURITY_CRITICAL,
      PERMISSIONS.CMS_DECISIONS,
      PERMISSIONS.EXTERNAL_RELATIONS
    ],
    operations: [
      PERMISSIONS.MANAGE_CONTENT,
      PERMISSIONS.MANAGE_USERS,
      PERMISSIONS.MODERATE_COMMUNITY,
      PERMISSIONS.VIEW_ANALYTICS,
      PERMISSIONS.TECHNICAL_COORDINATION
    ],
    media: [
      PERMISSIONS.PUBLISH_MEDIA,
      PERMISSIONS.MANAGE_RESOURCES,
      PERMISSIONS.LIMITED_MODERATION,
      PERMISSIONS.TASK_MANAGEMENT,
      PERMISSIONS.USER_SUPPORT
    ],
    interaction: [
      PERMISSIONS.ACCESS_PREMIUM_CONTENT,
      PERMISSIONS.INTERACT_CONTENT,
      PERMISSIONS.SUBMIT_CONTRIBUTIONS,
      PERMISSIONS.MANAGE_PROFILE
    ]
  };

  const hasPermission = (role, permission) => {
    return ROLE_PERMISSIONS[role]?.includes(permission);
  };

  const getPermissionLabel = (permission) => {
    const labels = {
      [PERMISSIONS.MANAGE_POLICIES]: "Gérer les politiques",
      [PERMISSIONS.MANAGE_ALL_ACCOUNTS]: "Gérer tous les comptes",
      [PERMISSIONS.SECURITY_CRITICAL]: "Sécurité critique",
      [PERMISSIONS.CMS_DECISIONS]: "Décisions CMS",
      [PERMISSIONS.EXTERNAL_RELATIONS]: "Relations externes",
      [PERMISSIONS.MANAGE_CONTENT]: "Gérer le contenu",
      [PERMISSIONS.MANAGE_USERS]: "Gérer les utilisateurs",
      [PERMISSIONS.MODERATE_COMMUNITY]: "Modérer la communauté",
      [PERMISSIONS.VIEW_ANALYTICS]: "Voir les analytics",
      [PERMISSIONS.TECHNICAL_COORDINATION]: "Coordination technique",
      [PERMISSIONS.PUBLISH_MEDIA]: "Publier des médias",
      [PERMISSIONS.MANAGE_RESOURCES]: "Gérer les ressources",
      [PERMISSIONS.LIMITED_MODERATION]: "Modération limitée",
      [PERMISSIONS.TASK_MANAGEMENT]: "Gestion des tâches",
      [PERMISSIONS.USER_SUPPORT]: "Support utilisateur",
      [PERMISSIONS.ACCESS_PREMIUM_CONTENT]: "Accès contenu premium",
      [PERMISSIONS.INTERACT_CONTENT]: "Interagir avec le contenu",
      [PERMISSIONS.SUBMIT_CONTRIBUTIONS]: "Soumettre des contributions",
      [PERMISSIONS.MANAGE_PROFILE]: "Gérer le profil"
    };
    return labels[permission] || permission;
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Gestion des Rôles et Permissions</h2>
        
        {/* Sélection du Rôle */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {Object.entries(roleDescriptions).map(([roleKey, roleInfo]) => (
            <button
              key={roleKey}
              onClick={() => setSelectedRole(roleKey)}
              className={`p-4 rounded-lg border-2 text-left transition ${
                selectedRole === roleKey
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-semibold text-gray-900">{roleInfo.title}</div>
              <div className="text-sm text-gray-600 mt-1">{roleInfo.description}</div>
            </button>
          ))}
        </div>

        {/* Détails du Rôle Sélectionné */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Responsabilités */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="text-green-600">✅</span>
              Responsabilités Principales
            </h3>
            <ul className="space-y-2">
              {roleDescriptions[selectedRole].responsibilities.map((responsibility, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">{responsibility}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Permissions */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="text-blue-600">🛡️</span>
              Permissions Accordées
            </h3>
            <div className="space-y-4">
              {Object.entries(permissionCategories).map(([category, permissions]) => (
                <div key={category}>
                  <h4 className="font-medium text-gray-900 mb-2 capitalize">
                    {category === 'governance' && '🏛️ Gouvernance'}
                    {category === 'operations' && '⚙️ Opérations'}
                    {category === 'media' && '🎵 Médias'}
                    {category === 'interaction' && '💬 Interaction'}
                  </h4>
                  <div className="space-y-1">
                    {permissions.map((permission) => (
                      <div
                        key={permission}
                        className={`flex items-center gap-2 p-2 rounded ${
                          hasPermission(selectedRole, permission)
                            ? 'bg-green-50 text-green-800'
                            : 'bg-gray-50 text-gray-500'
                        }`}
                      >
                        {hasPermission(selectedRole, permission) ? (
                          <span className="text-green-600">✓</span>
                        ) : (
                          <span className="text-gray-400">○</span>
                        )}
                        <span className="text-sm">{getPermissionLabel(permission)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Matrice RACI */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-6">Matrice RACI des Responsabilités</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left font-semibold">Activité</th>
                {Object.values(ROLES).map(role => (
                  <th key={role} className="px-4 py-3 text-center font-semibold capitalize">
                    {role.replace('_', ' ').replace('-', ' ')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {Object.entries(RACI_MATRIX).map(([activity, roles]) => (
                <tr key={activity}>
                  <td className="px-4 py-3 font-medium capitalize">
                    {activity.replace('_', ' ')}
                  </td>
                  {Object.values(ROLES).map(role => (
                    <td key={role} className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                        roles[role] === 'A' ? 'bg-blue-100 text-blue-800' :
                        roles[role] === 'R' ? 'bg-green-100 text-green-800' :
                        roles[role] === 'C' ? 'bg-yellow-100 text-yellow-800' :
                        roles[role] === 'I' ? 'bg-gray-100 text-gray-800' :
                        'bg-white'
                      }`}>
                        {roles[role] || '-'}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-sm text-gray-600">
          <strong>Légende :</strong> A = Accountable (Approbateur), R = Responsible (Responsable), C = Consulted (Consulté), I = Informed (Informé)
        </div>
      </div>

      {/* Actions de Gestion */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-6">Actions de Gestion des Rôles</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border-2 border-blue-200 rounded-lg hover:bg-blue-50 transition text-left">
            <div className="font-semibold text-blue-800">👑 Gérer les Super-Admins</div>
            <div className="text-sm text-blue-600 mt-1">Ajouter/retirer des super-administrateurs</div>
          </button>
          
          <button className="p-4 border-2 border-green-200 rounded-lg hover:bg-green-50 transition text-left">
            <div className="font-semibold text-green-800">⚙️ Gérer les Admins</div>
            <div className="text-sm text-green-600 mt-1">Gérer les administrateurs opérationnels</div>
          </button>
          
          <button className="p-4 border-2 border-purple-200 rounded-lg hover:bg-purple-50 transition text-left">
            <div className="font-semibold text-purple-800">🎵 Gérer la Core Team</div>
            <div className="text-sm text-purple-600 mt-1">Gérer l'équipe média et support</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleManagement;
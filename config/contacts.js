// src/config/contacts.js
export const CONTACTS = {
  general: {
    email: 'castcantoria@outlook.fr',
    phone: '+261 34 11 316 57',
    whatsapp: '+261 32 91 828 83',
    address: 'Cantoria, France'
  },
  specialized: [
    {
      type: '🛠️ Problème technique',
      email: 'tovoniaina.rahendrison@gmail.com',
      description: 'Bugs, problèmes techniques du site'
    },
    {
      type: '📢 Question contenu/communication',
      email: 'tena.solution@gmail.com',
      description: 'Contenu du site, articles, communications'
    },
    {
      type: '👥 Gestion des membres',
      email: 'julesrandriamanantsoa@gmail.com',
      description: 'Adhésion, informations membres, profils'
    },
    {
      type: '🎵 Programmation artistique',
      email: 'eric.rasamimanana@gmail.com',
      description: 'Répertoire, concerts, programmation musicale'
    },
    {
      type: '👑 Urgence/accès Super Admin',
      email: 'ad-castcantoria@outlook.fr',
      description: 'Accès administrateur, urgences critiques'
    }
  ]
};

// Utilisation dans tout le site
export default CONTACTS;
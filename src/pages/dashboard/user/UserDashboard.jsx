import React from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { Link } from 'react-router-dom';

const UserDashboard = () => {
  const { userProfile, currentUser } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900">
      {/* Header */}
      <div className="bg-black bg-opacity-50 text-white p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Mon Espace C.A.S.T.</h1>
          <p className="text-gray-300">
            Bienvenue dans votre espace personnel, {userProfile?.displayName || 'Utilisateur'} !
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Carte de Bienvenue */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6 shadow-lg">
            {userProfile?.displayName?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Bonjour, {userProfile?.displayName || 'Utilisateur'} !
          </h2>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
            Merci de faire partie de la communauté C.A.S.T. Cantoria. 
            Découvrez toutes les fonctionnalités de votre espace personnel.
          </p>
          
          {/* Statistiques rapides */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Link 
              to="/events" 
              className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl hover:shadow-lg transition-all duration-300 border border-blue-200"
            >
              <div className="text-blue-600 font-bold text-2xl mb-2">0</div>
              <div className="text-blue-800 font-semibold">Événements</div>
              <div className="text-blue-600 text-sm">Prochains concerts</div>
            </Link>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
              <div className="text-green-600 font-bold text-2xl mb-2 capitalize">
                {userProfile?.role || 'Utilisateur'}
              </div>
              <div className="text-green-800 font-semibold">Statut</div>
              <div className="text-green-600 text-sm">Votre rôle</div>
            </div>
            
            <Link 
              to="/profile" 
              className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl hover:shadow-lg transition-all duration-300 border border-purple-200"
            >
              <div className="text-purple-600 font-bold text-2xl mb-2">
                {userProfile?.displayName ? '✓' : '!'}
              </div>
              <div className="text-purple-800 font-semibold">Profil</div>
              <div className="text-purple-600 text-sm">
                {userProfile?.displayName ? 'Complété' : 'À compléter'}
              </div>
            </Link>
          </div>

          {/* Actions Rapides */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <Link 
              to="/profile/edit"
              className="bg-gradient-to-br from-blue-500 to-blue-600 text-white py-4 px-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg text-center font-medium flex flex-col items-center"
            >
              <span className="text-xl mb-2">✏️</span>
              <span className="text-sm">Profil</span>
            </Link>
            
            <Link 
              to="/events"
              className="bg-gradient-to-br from-green-500 to-green-600 text-white py-4 px-4 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-md hover:shadow-lg text-center font-medium flex flex-col items-center"
            >
              <span className="text-xl mb-2">📅</span>
              <span className="text-sm">Événements</span>
            </Link>
            
            <Link 
              to="/repertoire"
              className="bg-gradient-to-br from-purple-500 to-purple-600 text-white py-4 px-4 rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg text-center font-medium flex flex-col items-center"
            >
              <span className="text-xl mb-2">🎵</span>
              <span className="text-sm">Répertoire</span>
            </Link>
            
            <Link 
              to="/contact"
              className="bg-gradient-to-br from-orange-500 to-orange-600 text-white py-4 px-4 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-md hover:shadow-lg text-center font-medium flex flex-col items-center"
            >
              <span className="text-xl mb-2">💬</span>
              <span className="text-sm">Contact</span>
            </Link>
          </div>
        </div>

        {/* Grille de Fonctionnalités */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Découvrir C.A.S.T. */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">
              <span className="text-blue-500">🌍</span>
              Découvrir C.A.S.T.
            </h3>
            <div className="space-y-4">
              {[
                { to: "/about", icon: "ℹ️", title: "Notre Histoire et Mission", desc: "Découvrez notre chorale" },
                { to: "/repertoire", icon: "📜", title: "Explorer le Répertoire", desc: "Nos œuvres musicales" },
                { to: "/gallery", icon: "🖼️", title: "Voir nos Galeries", desc: "Photos et vidéos" },
                { to: "/spiritualite", icon: "🙏", title: "Dimension Spirituelle", desc: "Notre approche" }
              ].map((item, index) => (
                <Link 
                  key={index}
                  to={item.to}
                  className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-all duration-300 border border-transparent hover:border-gray-200 group"
                >
                  <span className="text-2xl group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </span>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </div>
                    <div className="text-sm text-gray-500">{item.desc}</div>
                  </div>
                  <span className="text-gray-400 group-hover:text-blue-500 transition-colors">→</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Participer */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">
              <span className="text-green-500">🎯</span>
              Participer
            </h3>
            <div className="space-y-4">
              {[
                { to: "/events", icon: "🎵", title: "Voir nos Concerts", desc: "Prochains événements" },
                { to: "/blog", icon: "📰", title: "Lire notre Blog", desc: "Actualités et articles" },
                { to: "/join", icon: "👥", title: "Rejoindre la Chorale", desc: "Devenir membre actif" },
                { to: "/partenaires", icon: "🤝", title: "Devenir Partenaire", desc: "Soutenir notre projet" }
              ].map((item, index) => (
                <Link 
                  key={index}
                  to={item.to}
                  className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-all duration-300 border border-transparent hover:border-gray-200 group"
                >
                  <span className="text-2xl group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </span>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                      {item.title}
                    </div>
                    <div className="text-sm text-gray-500">{item.desc}</div>
                  </div>
                  <span className="text-gray-400 group-hover:text-green-500 transition-colors">→</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Mes Ressources */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">
            <span className="text-purple-500">📚</span>
            Mes Ressources
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { to: "/documents", icon: "📋", title: "Documents", desc: "Ressources partagées", color: "blue" },
              { to: "/messages", icon: "💬", title: "Messages", desc: "Communication", color: "green" },
              { to: "/settings", icon: "⚙️", title: "Paramètres", desc: "Préférences", color: "purple" },
              { to: "/help", icon: "❓", title: "Aide", desc: "Support", color: "orange" }
            ].map((item, index) => (
              <Link 
                key={index}
                to={item.to}
                className={`bg-gradient-to-br from-${item.color}-50 to-${item.color}-100 p-6 rounded-xl hover:shadow-lg transition-all duration-300 border border-${item.color}-200 group`}
              >
                <div className={`text-${item.color}-600 text-3xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {item.icon}
                </div>
                <div className={`font-semibold text-${item.color}-800 text-lg mb-2`}>
                  {item.title}
                </div>
                <div className={`text-${item.color}-600 text-sm`}>
                  {item.desc}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Prochaines Étapes Recommandées */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="text-yellow-300">🚀</span>
            Prochaines Étapes Recommandées
          </h3>
          <div className="space-y-4">
            {[
              { step: 1, title: "Compléter votre profil", desc: "Ajoutez vos informations personnelles", to: "/profile/edit", color: "blue" },
              { step: 2, title: "Explorer le répertoire", desc: "Découvrez nos œuvres musicales", to: "/repertoire", color: "green" },
              { step: 3, title: "Voir les prochains concerts", desc: "Découvrez nos événements", to: "/events", color: "purple" },
              { step: 4, title: "Nous contacter", desc: "Posez vos questions", to: "/contact", color: "orange" }
            ].map((item, index) => (
              <div key={index} className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 bg-${item.color}-400 rounded-full flex items-center justify-center text-white font-bold text-lg`}>
                      {item.step}
                    </div>
                    <div>
                      <div className="font-semibold text-lg">{item.title}</div>
                      <div className="text-blue-100 text-sm">{item.desc}</div>
                    </div>
                  </div>
                  <Link 
                    to={item.to}
                    className={`bg-${item.color}-500 hover:bg-${item.color}-600 text-white px-6 py-3 rounded-lg transition-colors font-medium whitespace-nowrap`}
                  >
                    {item.step === 1 ? 'Compléter' : item.step === 2 ? 'Explorer' : item.step === 3 ? 'Voir' : 'Contacter'}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section Contact Rapide */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { to: "/contact", icon: "📞", title: "Nous Contacter", desc: "Questions & informations" },
            { to: "/faq", icon: "❓", title: "FAQ", desc: "Questions fréquentes" },
            { to: "/support", icon: "🛠️", title: "Support", desc: "Aide technique" }
          ].map((item, index) => (
            <Link 
              key={index}
              to={item.to}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-center group border border-gray-200"
            >
              <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {item.icon}
              </div>
              <div className="font-semibold text-gray-900 text-lg mb-2">
                {item.title}
              </div>
              <div className="text-gray-500 text-sm">
                {item.desc}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
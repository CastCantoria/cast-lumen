import React from 'react';
import { Link } from 'react-router-dom';

const Spiritualite = () => {
  const spiritualPillars = [
    {
      icon: "🙏",
      title: "Prière Communautaire",
      description: "Nos répétitions commencent et se terminent par un temps de prière partagé",
      image: "/images/inspiration/inspiration1.jpg"
    },
    {
      icon: "🎵",
      title: "Musique Sacrée",
      description: "Le chant comme moyen d'élévation spirituelle et de louange",
      image: "/images/inspiration/inspiration2.jpg"
    },
    {
      icon: "👥",
      title: "Fraternité",
      description: "Une communauté unie dans la foi et le partage musical",
      image: "/images/inspiration/inspiration3.jpg"
    },
    {
      icon: "🌟",
      title: "Témoignage",
      description: "Porter la joie de l'Évangile à travers nos concerts",
      image: "/images/inspiration/inspiration.JPG"
    }
  ];

  const spiritualEvents = [
    {
      title: "Retraite Spirituelle",
      date: "15-17 Mars 2024",
      location: "Monastère d'Ambatomanga",
      description: "Week-end de recueillement, prière et chant grégorien",
      image: "/images/gallery/galerie7.jpg"
    },
    {
      title: "Chemin de Croix Musical",
      date: "29 Mars 2024",
      location: "Colline d'Ambohimanga",
      description: "Méditation des stations du chemin de croix en musique",
      image: "/images/gallery/galerie8.jpg"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 pt-20">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{ backgroundImage: "url('/images/cathedrale majestueu.png')" }}
        ></div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold text-gray-900 mb-6 font-serif">Spiritualité & Foi</h1>
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              "La musique est la prière du cœur qui s'élève vers le Ciel"<br />
              <span className="text-lg text-gray-600 italic">- C.A.S.T. Cantoria</span>
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                to="/about" 
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Notre Mission
              </Link>
              <Link 
                to="/events" 
                className="border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition"
              >
                Événements Spirituels
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Piliers Spirituels */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Nos Piliers Spirituels</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              La dimension spirituelle au cœur de notre vocation musicale
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {spiritualPillars.map((pillar, index) => (
              <div key={index} className="flex flex-col md:flex-row items-center gap-8">
                <div className="md:w-2/5">
                  <img 
                    src={pillar.image} 
                    alt={pillar.title}
                    className="w-full h-64 object-cover rounded-2xl shadow-lg"
                  />
                </div>
                <div className="md:w-3/5">
                  <div className="text-4xl mb-4">{pillar.icon}</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{pillar.title}</h3>
                  <p className="text-gray-600 text-lg leading-relaxed">{pillar.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Citation Inspirante */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-blue-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <blockquote className="text-2xl md:text-3xl italic mb-6 max-w-4xl mx-auto leading-relaxed">
            "Qui chante prie deux fois. À C.A.S.T., nous croyons que la beauté de la musique sacrée 
            est une fenêtre ouverte sur le divin, un chemin qui élève l'âme et unit les cœurs."
          </blockquote>
          <p className="text-xl text-blue-100">- Père Lucien, Aumônier de C.A.S.T.</p>
        </div>
      </section>

      {/* Événements Spirituels */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Événements Spirituels</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Des moments privilégiés pour approfondir notre foi à travers la musique
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {spiritualEvents.map((event, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <img 
                  src={event.image} 
                  alt={event.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{event.title}</h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {event.date}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      {event.location}
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">{event.description}</p>
                  <Link 
                    to="/contact"
                    className="block w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition font-semibold text-center"
                  >
                    S'inscrire
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Témoignages */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Témoignages</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ce que vivent nos membres à travers cette expérience spirituelle et musicale
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-blue-50 rounded-2xl p-6">
              <div className="text-4xl mb-4">😇</div>
              <p className="text-gray-700 mb-4 italic">
                "Chanter à C.A.S.T. m'a permis de redécouvrir ma foi à travers la beauté de la musique sacrée."
              </p>
              <p className="text-gray-600 font-semibold">- Marie, Soprano</p>
            </div>

            <div className="bg-purple-50 rounded-2xl p-6">
              <div className="text-4xl mb-4">✨</div>
              <p className="text-gray-700 mb-4 italic">
                "Nos concerts ne sont pas que des prestations, ce sont de véritables moments de grâce partagés."
              </p>
              <p className="text-gray-600 font-semibold">- Jean, Ténor</p>
            </div>

            <div className="bg-indigo-50 rounded-2xl p-6">
              <div className="text-4xl mb-4">🕊️</div>
              <p className="text-gray-700 mb-4 italic">
                "La prière communautaire avant chaque répétition crée une unité spirituelle unique."
              </p>
              <p className="text-gray-600 font-semibold">- Sophie, Alto</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-900 to-purple-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Rejoignez Notre Communauté Spirituelle</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-indigo-100">
            Venez vivre cette belle aventure où la musique rencontre la foi
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/join"
              className="bg-white text-indigo-900 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Nous Rejoindre
            </Link>
            <Link 
              to="/contact"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-indigo-900 transition"
            >
              Poser une Question
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Spiritualite;
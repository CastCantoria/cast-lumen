import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  const teamMembers = [
    {
      name: "Son Excellence Liva Ramanalinarivo",
      role: "Fondateur & Directeur Spirituel",
      description: "Zoky ara-panahy et Mpitoriteny passionné, il a fondé C.A.S.T. avec la vision d'allier excellence musicale et spiritualité",
      image: "/images/raprezy.jpg",
      specialties: ["Direction Spirituelle", "Musicologie", "Chant Grégorien"]
    },
    {
      name: "Maître Eric Rasamimanana",
      role: "Chef de Chœur",
      description: "Diplômée du Conservatoire de Paris, il dirige la chorale avec passion et exigence artistique",
      image: "/images/eric-ras.jpg",
      specialties: ["Direction Musicale", "Pédagogie Vocale", "Répertoire Sacré"]
    },
    {
      name: "Jules Randriamanantsoa",
      role: "Responsable Artistique",
      description: "Ancien soliste de l'Opéra de Paris, il supervise la qualité artistique des productions",
      image: "/images/jules-ran.jpg",
      specialties: ["Technique Vocale", "Arrangements", "Production"]
    }
  ];

  const milestones = [
    {
      year: "2003",
      title: "Fondation de C.A.S.T.",
      description: "Création de la chorale avec 15 membres fondateurs",
      image: "/images/origines.png"
    },
    {
      year: "2003",
      title: "Premier Concert Public",
      description: "Concert inaugural à la Cathédrale d'Andohalo devant 300 personnes",
      image: "/images/chorale-1.jpg"
    },
    {
      year: "2004",
      title: "Expansion de la Chorale",
      description: "La chorale passe à 40 membres actifs et diversifie son répertoire",
      image: "/images/chorale-2.jpg"
    },
    {
      year: "2005",
      title: "Reconnaissance Nationale",
      description: "Participation au Festival National de Musique Sacrée",
      image: "/images/collaborations.png"
    },
    {
      year: "2006",
      title: "50 Membres Actifs",
      description: "Atteinte d'un effectif de 50 choristes et création de la section jeunesse",
      image: "/images/chorale-3.jpg"
    },
    {
      year: "2024",
      title: "Projets Internationaux",
      description: "Premières collaborations avec des chorales internationales",
      image: "/images/diffusion.png"
    }
  ];

  const values = [
    {
      icon: "🎵",
      title: "Excellence Musicale",
      description: "Nous visons la plus haute qualité artistique dans l'interprétation du répertoire sacré"
    },
    {
      icon: "🙏",
      title: "Spiritualité",
      description: "La musique comme moyen d'élévation spirituelle et de louange"
    },
    {
      icon: "👥",
      title: "Communauté",
      description: "Une famille unie par la passion du chant et le partage des valeurs"
    },
    {
      icon: "🌍",
      title: "Rayonnement",
      description: "Porter la beauté de la musique sacrée au plus grand nombre"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 pt-20">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <img 
                src="/images/cast-chorale.jpg" 
                alt="C.A.S.T. Cantoria en concert"
                className="rounded-2xl shadow-2xl w-full h-auto"
              />
            </div>
            <div className="lg:w-1/2">
              <h1 className="text-5xl font-bold text-gray-900 mb-6 font-serif">Notre Histoire</h1>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Fondé en 2019, le <strong>Chœur Artistique et Spirituel de Tana (C.A.S.T.)</strong> 
                est né de la vision de réunir des passionnés de musique sacrée autour d'un projet 
                artistique d'excellence ancré dans la spiritualité chrétienne.
              </p>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                Notre mission : faire rayonner la beauté de la musique sacrée à travers des 
                concerts de qualité, tout en cultivant une vie communautaire riche et une 
                profonde dimension spirituelle.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  to="/join" 
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Nous Rejoindre
                </Link>
                <Link 
                  to="/events" 
                  className="border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition"
                >
                  Nos Concerts
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Valeurs */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Nos Valeurs Fondatrices</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Les principes qui guident notre action et notre développement
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center p-6">
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Équipe */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Notre Équipe</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Des passionnés dévoués à la mission artistique et spirituelle de C.A.S.T.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="relative">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-64 object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-blue-600 font-semibold mb-4">{member.role}</p>
                  <p className="text-gray-600 mb-4">{member.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {member.specialties.map((specialty, idx) => (
                      <span key={idx} className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Histoire - Timeline */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Notre Parcours</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Les étapes marquantes de notre développement depuis la fondation
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {milestones.map((milestone, index) => (
              <div key={index} className={`flex flex-col md:flex-row items-center gap-8 mb-12 ${
                index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}>
                <div className="md:w-2/5">
                  <img 
                    src={milestone.image} 
                    alt={milestone.title}
                    className="w-full h-48 object-cover rounded-2xl shadow-lg"
                  />
                </div>
                <div className="md:w-3/5">
                  <div className="bg-blue-600 text-white w-20 h-20 rounded-full flex items-center justify-center text-xl font-bold mb-4">
                    {milestone.year}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{milestone.title}</h3>
                  <p className="text-gray-600 text-lg leading-relaxed">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Chiffres Clés */}
      <section className="py-20 bg-gradient-to-r from-blue-900 to-indigo-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-blue-200">Membres Actifs</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100+</div>
              <div className="text-blue-200">Pièces au Répertoire</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">25+</div>
              <div className="text-blue-200">Concerts Annuels</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">5</div>
              <div className="text-blue-200">Ans d'Existence</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Prêt à Écrire la Suite de Notre Histoire ?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Rejoignez-nous dans cette belle aventure artistique et spirituelle
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/join"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Devenir Membre
            </Link>
            <Link 
              to="/contact"
              className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition"
            >
              Nous Contacter
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
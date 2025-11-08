import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  const teamMembers = [
    {
      name: "Son Excellence Liva Ramanalinarivo",
      role: "Fondateur & Directeur Spirituel",
      description: "Zoky ara-panahy et Mpitoriteny passionné, Son Excellence Liva Ramanalinarivo est le fondateur visionnaire du Chœur Artistique & Spirituel de Tanà (C.A.S.T.). Animé par une foi profonde et une sensibilité musicale rare, il a initié ce projet comme un sanctuaire vivant où l'art vocal devient prière, et où la beauté sonore sert la quête spirituelle.",
      image: "/images/raprezy.jpg",
      specialties: [
        "Direction Spirituelle",
        "Musicologie",
        "Chant Grégorien",
        "Vision Pastorale & Artistique"
      ],
      quote: "La musique sacrée est une prière qui élève l'âme vers le Créateur."
    },
    {
      name: "Maître Eric Rasamimanana",
      role: "Chef de Chœur",
      description: "Maître Eric Rasamimanana, diplômé du Conservatoire de Paris, incarne l'exigence artistique et la rigueur musicale au sein du CAST. Avec une pédagogie vocale fine et une passion pour le répertoire sacré, il façonne les voix avec précision et bienveillance.",
      image: "/images/eric-ras.jpg",
      specialties: [
        "Direction Musicale",
        "Pédagogie Vocale",
        "Répertoire Sacré",
        "Formation Chorale"
      ],
      quote: "Chaque voix est unique, mais ensemble, nous ne formons qu'un seul cœur qui chante."
    },
    {
      name: "Jules Randriamanantsoa",
      role: "Responsable Artistique",
      description: "Ancien soliste de l'Opéra de Paris, Jules Randriamanantsoa apporte au CAST une exigence artistique de haut niveau et une sensibilité rare. En tant que responsable artistique, il veille à la qualité des interprétations et à la profondeur expressive de chaque production.",
      image: "/images/jules-ran.jpg",
      specialties: [
        "Technique Vocale",
        "Arrangements",
        "Production Artistique",
        "Expression Scénique"
      ],
      quote: "L'art véritable naît lorsque la technique rencontre l'émotion authentique."
    },
    {
      name: "Tovoniaina RAHENDRISON",
      role: "Initiateur & Architecte du projet CAST",
      description: "Initiateur du Chœur Artistique & Spirituel de Tanà (C.A.S.T.), Tovoniaina RAHENDRISON a porté ce projet dès ses premières vibrations, avec la volonté farouche de le faire connaître au-delà des frontières.",
      image: "/images/Me.jpg",
      specialties: [
        "Initiation & Structuration",
        "Architecture Technique",
        "Transmission Pédagogique",
        "Rayonnement International"
      ],
      quote: "Le code, comme la musique, doit servir une beauté qui élève l'âme."
    }
  ];

  const milestones = [
    {
      year: "2019",
      title: "Naissance d'une Vision Sacrée",
      description: "Fondation du C.A.S.T. par Son Excellence Liva Ramanalinarivo avec 15 membres fondateurs partageant une même passion pour la musique sacrée et la spiritualité.",
      image: "/images/origines.png",
      achievements: ["15 membres fondateurs", "Vision spirituelle établie", "Premier local de répétition"]
    },
    {
      year: "2020",
      title: "Premier Concert Sacré",
      description: "Concert inaugural 'Lumières Célestes' à la Cathédrale d'Andohalo devant 300 personnes, marquant le début de notre mission artistique et spirituelle.",
      image: "/images/chorale-1.jpg",
      achievements: ["300 spectateurs", "Répertoire de 20 pièces", "Reconnaissance diocésaine"]
    },
    {
      year: "2021",
      title: "Expansion et Structuration",
      description: "La chorale passe à 35 membres actifs et se structure en sections vocales. Création du programme de formation vocale et spirituelle.",
      image: "/images/chorale-2.jpg",
      achievements: ["35 membres actifs", "4 sections vocales", "Programme de formation"]
    },
    {
      year: "2022",
      title: "Excellence Artistique Reconnue",
      description: "Participation remarquée au Festival National de Musique Sacrée de Madagascar. Premiers enregistrements studio de notre répertoire.",
      image: "/images/collaborations.png",
      achievements: ["Prix d'excellence", "5 enregistrements studio", "50 pièces maîtrisées"]
    },
    {
      year: "2023",
      title: "Rayonnement National",
      description: "Atteinte d'un effectif de 50 choristes et création de l'Académie C.A.S.T. pour la formation des jeunes talents.",
      image: "/images/chorale-3.jpg",
      achievements: ["50 membres actifs", "Académie C.A.S.T.", "3 tournées régionales"]
    },
    {
      year: "2024",
      title: "Innovation et Ouverture Mondiale",
      description: "Lancement de la plateforme numérique C.A.S.T., collaborations internationales virtuelles et projet d'album studio.",
      image: "/images/diffusion.png",
      achievements: ["Plateforme numérique", "Collaborations internationales", "Projet album studio"]
    }
  ];

  const values = [
    {
      icon: "🎵",
      title: "Excellence Musicale",
      description: "Nous visons la plus haute qualité artistique dans l'interprétation du répertoire sacré, alliant technique vocale rigoureuse et expressivité authentique.",
      details: [
        "Formation vocale continue",
        "Répertoire sacré diversifié",
        "Répétitions rigoureuses"
      ]
    },
    {
      icon: "🙏",
      title: "Spiritualité Profonde",
      description: "La musique comme moyen d'élévation spirituelle et de louange. Chaque concert est une prière, chaque note une offrande.",
      details: [
        "Prière communautaire",
        "Réflexion spirituelle",
        "Musique liturgique"
      ]
    },
    {
      icon: "👥",
      title: "Communauté Fraternelle",
      description: "Une famille unie par la passion du chant et le partage des valeurs. L'accueil et l'entraide sont au cœur de notre démarche.",
      details: [
        "Accueil des nouveaux membres",
        "Partage fraternel",
        "Solidarité active"
      ]
    },
    {
      icon: "🌍",
      title: "Rayonnement Culturel",
      description: "Porter la beauté de la musique sacrée au plus grand nombre, au service de l'Église et de la société malgache.",
      details: [
        "Concerts publics accessibles",
        "Actions caritatives",
        "Patrimoine culturel"
      ]
    }
  ];

  const stats = [
    {
      number: "50+",
      label: "Membres Actifs",
      description: "Choristes passionnés",
      icon: "🎤"
    },
    {
      number: "100+",
      label: "Pièces au Répertoire",
      description: "Du grégorien au contemporain",
      icon: "📜"
    },
    {
      number: "25+",
      label: "Concerts Annuels",
      description: "Liturgies et événements",
      icon: "🎭"
    },
    {
      number: "5",
      label: "Ans de Mission",
      description: "Depuis 2019",
      icon: "⭐"
    },
    {
      number: "15+",
      label: "Lieux Sacrés",
      description: "Cathédrales et églises",
      icon: "⛪"
    },
    {
      number: "1000+",
      label: "Âmes Touchées",
      description: "Auditeurs transformés",
      icon: "👥"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-16 sm:pt-20">
      {/* Hero Section Responsive */}
      <section className="relative py-16 sm:py-24 md:py-32 overflow-hidden bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="absolute inset-0 bg-[url('/images/cast-chorale.jpg')] bg-cover bg-center opacity-30"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-purple-900/60"></div>
        
        <div className="container mx-auto px-4 sm:px-6 relative">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
            <div className="lg:w-1/2 text-center lg:text-left">
              <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-3 sm:p-4 inline-block mb-6 sm:mb-8 border border-white/30">
                <span className="text-sm sm:text-lg font-semibold text-white flex items-center justify-center lg:justify-start">
                  <span className="mr-2 text-xl sm:text-2xl">🎵</span> 
                  Chœur Sacré Depuis 2019
                </span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 sm:mb-8 font-serif leading-tight">
                C.A.S.T. <span className="text-yellow-300 block mt-1 sm:mt-2">Cantoria</span>
              </h1>
              
              <p className="text-xl sm:text-2xl md:text-3xl mb-6 sm:mb-8 leading-relaxed text-blue-100 font-light">
                Chœur Artistique & Spirituel de Tanà
              </p>
              
              <p className="text-base sm:text-lg md:text-xl text-blue-200 mb-8 sm:mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Fondé en 2019, le <strong className="text-white font-semibold">C.A.S.T. Cantoria</strong> incarne 
                la rencontre sacrée entre <strong className="text-yellow-300">l'excellence musicale</strong> et 
                la <strong className="text-yellow-300">profondeur spirituelle</strong>.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center lg:justify-start">
                <Link 
                  to="/join" 
                  className="bg-yellow-400 text-gray-900 px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 rounded-xl sm:rounded-2xl font-bold hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center text-sm sm:text-base md:text-lg"
                >
                  <span className="mr-2 sm:mr-3 text-lg sm:text-xl md:text-2xl">🎤</span>
                  Rejoindre la Chorale
                </Link>
                <Link 
                  to="/events" 
                  className="border-2 border-white text-white px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 rounded-xl sm:rounded-2xl font-bold hover:bg-white hover:text-purple-900 transition-all duration-300 transform hover:scale-105 flex items-center justify-center text-sm sm:text-base md:text-lg backdrop-blur-sm"
                >
                  <span className="mr-2 sm:mr-3 text-lg sm:text-xl md:text-2xl">📅</span>
                  Nos Événements
                </Link>
              </div>
            </div>
            
            <div className="lg:w-1/2 mt-8 lg:mt-0">
              <div className="relative group">
                <div className="absolute -inset-2 sm:-inset-4 bg-gradient-to-r from-yellow-400 to-purple-600 rounded-2xl sm:rounded-3xl opacity-50 group-hover:opacity-80 blur-lg sm:blur-xl transition-all duration-500"></div>
                <img 
                  src="/images/cast-chorale.jpg" 
                  alt="C.A.S.T. Cantoria en concert"
                  className="relative rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl w-full h-64 sm:h-80 md:h-96 lg:h-[500px] object-cover transform group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute -bottom-3 -left-3 sm:-bottom-4 sm:-left-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl font-bold shadow-lg sm:shadow-xl border-2 border-white text-xs sm:text-sm">
                  <span className="text-lg sm:text-xl mr-1 sm:mr-2">🏆</span>
                  Excellence 2024
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chiffres Clés Responsive */}
      <section className="py-12 sm:py-16 md:py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 opacity-70"></div>
        <div className="container mx-auto px-4 sm:px-6 relative">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 font-serif">Notre Impact</h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Des chiffres qui témoignent de notre engagement
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="text-2xl sm:text-3xl md:text-4xl mb-2 sm:mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-300 relative">{stat.icon}</div>
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2 relative">{stat.number}</div>
                  <div className="font-semibold text-blue-100 text-sm sm:text-base mb-1 sm:mb-2 relative">{stat.label}</div>
                  <div className="text-blue-200 text-xs sm:text-sm relative">{stat.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Valeurs Responsive */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-48 h-48 sm:w-60 sm:h-60 md:w-72 md:h-72 bg-purple-200 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-50"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-blue-200 rounded-full translate-x-1/3 translate-y-1/3 opacity-50"></div>
        
        <div className="container mx-auto px-4 sm:px-6 relative">
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 font-serif">Nos Valeurs</h2>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Les principes qui animent chaque note et unissent chaque cœur
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8 md:gap-10">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-xl transition-all duration-500 p-6 sm:p-8 md:p-10 group border border-blue-100 hover:border-blue-200 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full -translate-y-12 translate-x-12 opacity-60"></div>
                
                <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6 md:space-x-8 relative">
                  <div className="text-4xl sm:text-5xl md:text-6xl group-hover:scale-110 transition-transform duration-500 flex-shrink-0">
                    {value.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 font-serif">{value.title}</h3>
                    <p className="text-base sm:text-lg text-gray-700 mb-6 sm:mb-8 leading-relaxed">{value.description}</p>
                    
                    <div className="space-y-3 sm:space-y-4">
                      {value.details.map((detail, idx) => (
                        <div key={idx} className="flex items-start text-gray-600 group/item">
                          <span className="w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mr-3 sm:mr-4 mt-1 sm:mt-2 flex-shrink-0 group-hover/item:scale-125 transition-transform"></span>
                          <span className="text-sm sm:text-base leading-relaxed font-medium">{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Équipe Responsive */}
      <section className="py-12 sm:py-16 md:py-20 bg-white relative overflow-hidden">
        <div className="absolute top-10 left-10 w-40 h-40 sm:w-52 sm:h-52 md:w-64 md:h-64 bg-blue-50 rounded-full opacity-60"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 sm:w-60 sm:h-60 md:w-80 md:h-80 bg-purple-50 rounded-full opacity-60"></div>
        
        <div className="container mx-auto px-4 sm:px-6 relative">
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 font-serif">Notre Équipe</h2>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Les visionnaires qui donnent corps et âme à notre mission
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12">
            {teamMembers.map((member, index) => (
              <div key={index} className="group">
                <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-xl transition-all duration-700 overflow-hidden border border-blue-100 hover:border-blue-200 h-full flex flex-col">
                  <div className="relative h-64 sm:h-72 md:h-80 w-full overflow-hidden">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    
                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-lg rounded-xl w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center text-lg sm:text-xl md:text-2xl font-bold text-blue-600 shadow-lg border border-white/30">
                      {member.specialties[0]?.charAt(0)}
                    </div>
                    
                    <div className="absolute bottom-4 left-4 bg-white/20 backdrop-blur-lg text-white px-3 sm:px-4 py-2 rounded-xl border border-white/30">
                      <span className="font-semibold text-sm sm:text-base">{member.role}</span>
                    </div>
                  </div>
                  
                  <div className="p-4 sm:p-6 md:p-8 flex flex-col flex-grow">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight font-serif">
                      {member.name}
                    </h3>
                    
                    <p className="text-gray-700 mb-4 sm:mb-6 text-base sm:text-lg leading-relaxed flex-grow">
                      {member.description}
                    </p>
                    
                    <div className="mb-4 sm:mb-6 p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl sm:rounded-2xl border-l-4 border-blue-500 relative">
                      <div className="text-2xl sm:text-3xl md:text-4xl text-blue-300 absolute -top-1 sm:-top-2 left-2 sm:left-4">"</div>
                      <p className="text-blue-800 italic text-base sm:text-lg leading-relaxed relative z-10">
                        "{member.quote}"
                      </p>
                    </div>
                    
                    <div className="space-y-3 sm:space-y-4">
                      <h4 className="font-semibold text-gray-800 text-lg sm:text-xl flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 sm:mr-3"></span>
                        Expertises :
                      </h4>
                      <div className="flex flex-wrap gap-2 sm:gap-3">
                        {member.specialties.map((specialty, idx) => (
                          <span 
                            key={idx} 
                            className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-3 py-2 rounded-xl text-sm font-semibold border border-blue-200 hover:border-blue-300 transition-all duration-300 hover:scale-105 hover:shadow-md"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Histoire Responsive */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-purple-50 to-blue-100 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 relative">
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 font-serif">Notre Histoire</h2>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Cinq années de croissance et de rayonnement spirituel
            </p>
          </div>

          <div className="max-w-7xl mx-auto">
            <div className="relative">
              {/* Ligne de temps pour desktop */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 sm:w-2 bg-gradient-to-b from-blue-400 to-purple-600 h-full hidden lg:block rounded-full shadow-lg"></div>
              
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex flex-col lg:flex-row items-stretch mb-12 sm:mb-16 md:mb-20 ${
                  index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                }`}>
                  {/* Contenu */}
                  <div className={`lg:w-5/12 ${index % 2 === 0 ? 'lg:pr-6' : 'lg:pl-6'} mb-6 lg:mb-0`}>
                    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-xl transition-all duration-500 p-4 sm:p-6 md:p-8 border-l-4 border-blue-500 h-full relative overflow-hidden group">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center mb-4 sm:mb-6">
                        <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl sm:rounded-2xl flex items-center justify-center text-base sm:text-lg md:text-xl font-bold mr-4 sm:mr-6 shadow-lg border-2 border-white mb-3 sm:mb-0">
                          {milestone.year}
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 font-serif">{milestone.title}</h3>
                      </div>
                      
                      <p className="text-gray-700 mb-4 sm:mb-6 text-sm sm:text-base md:text-lg leading-relaxed">{milestone.description}</p>
                      
                      <div className="space-y-2 sm:space-y-3">
                        {milestone.achievements.map((achievement, idx) => (
                          <div key={idx} className="flex items-center text-gray-600 text-sm sm:text-base group/achieve">
                            <span className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full mr-3 group-hover/achieve:scale-125 transition-transform"></span>
                            <span className="font-medium">{achievement}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Point central pour desktop */}
                  <div className="hidden lg:flex w-2/12 justify-center relative items-center">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full border-4 border-white shadow-xl z-10 transform group-hover:scale-125 transition-transform duration-300"></div>
                  </div>
                  
                  {/* Image */}
                  <div className={`lg:w-5/12 ${index % 2 === 0 ? 'lg:pl-6' : 'lg:pr-6'}`}>
                    <div className="relative group/image h-full">
                      <div className="absolute -inset-2 sm:-inset-4 bg-gradient-to-r from-blue-400 to-purple-600 rounded-2xl sm:rounded-3xl opacity-20 group-hover/image:opacity-40 blur-lg sm:blur-xl transition-all duration-500"></div>
                      <img 
                        src={milestone.image} 
                        alt={milestone.title}
                        className="relative w-full h-48 sm:h-56 md:h-64 lg:h-72 object-cover rounded-xl sm:rounded-2xl shadow-lg group-hover/image:scale-105 transition-transform duration-500 border-4 border-white"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Vision Responsive */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 text-white relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 text-center relative">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 sm:mb-8 font-serif">Notre Vision</h2>
          <p className="text-lg sm:text-xl md:text-2xl mb-8 sm:mb-10 md:mb-12 max-w-4xl mx-auto text-blue-100 leading-relaxed font-light">
            Développer l'Académie C.A.S.T. pour former la nouvelle génération de chantres sacrés 
            et étendre notre rayonnement à travers des collaborations internationales.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 md:gap-10 max-w-5xl mx-auto">
            {[
              {
                icon: "🎓",
                title: "Académie Sacrée",
                description: "Former 50 jeunes talents par an",
                details: ["Programme complet", "Mentorat spirituel", "Excellence vocale"]
              },
              {
                icon: "🎼",
                title: "Création Inspirée",
                description: "Nouvelles pièces sacrées",
                details: ["Studio professionnel", "Compositions originales", "Patrimoine"]
              },
              {
                icon: "🌍",
                title: "Rayonnement Mondial",
                description: "Concerts internationaux",
                details: ["Tournées", "Collaborations", "Ambassade culturelle"]
              }
            ].map((vision, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-white/20 hover:border-white/40 transition-all duration-500 group hover:scale-105">
                <div className="text-4xl sm:text-5xl mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">{vision.icon}</div>
                <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 font-serif">{vision.title}</h3>
                <p className="text-blue-200 mb-4 sm:mb-6 text-base sm:text-lg">{vision.description}</p>
                <div className="space-y-2">
                  {vision.details.map((detail, idx) => (
                    <div key={idx} className="flex items-center text-blue-100 text-sm">
                      <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2 sm:mr-3"></span>
                      {detail}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final Responsive */}
      <section className="py-12 sm:py-16 md:py-20 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 text-center relative">
          <div className="max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 lg:p-16 shadow-xl border border-blue-100 relative overflow-hidden">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 sm:mb-8 font-serif leading-tight">
                Votre Voix a une <span className="text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">Mission</span>
              </h2>
              
              <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-8 sm:mb-10 md:mb-12 leading-relaxed max-w-3xl mx-auto">
                Rejoignez une communauté où l'art rencontre la foi, où chaque chant est une prière.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
                <Link 
                  to="/join"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 sm:px-8 md:px-10 lg:px-12 py-3 sm:py-4 md:py-5 rounded-xl sm:rounded-2xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center text-sm sm:text-base md:text-lg min-w-48 sm:min-w-56"
                >
                  <span className="mr-2 sm:mr-3 text-lg sm:text-xl">🎤</span>
                  Nous Rejoindre
                </Link>
                
                <Link 
                  to="/spiritualite"
                  className="border-2 border-blue-600 text-blue-600 px-6 sm:px-8 md:px-10 lg:px-12 py-3 sm:py-4 md:py-5 rounded-xl sm:rounded-2xl font-bold hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:scale-105 flex items-center justify-center text-sm sm:text-base md:text-lg min-w-48 sm:min-w-56 bg-white/80 backdrop-blur-sm"
                >
                  <span className="mr-2 sm:mr-3 text-lg sm:text-xl">🕊️</span>
                  Spiritualité
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
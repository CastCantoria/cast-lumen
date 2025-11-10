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
      year: "2003",
      title: "Naissance du C.A.S.T. - Une Renaissance Spirituelle",
      description: "Inauguration solennelle du Chœur Artistique & Spirituel de Tanà à l'Espace FENOHASINA Itaosy, sous le haut patronage des autorités de la Région. Cet événement fondateur a rassemblé parents et proches venus nombreux, certains ayant parcouru de longues distances pour ce moment historique. Par la Grâce de Dieu, ce fut une véritable renaissance artistique et spirituelle.",
      image: "/images/origines.png",
      achievements: ["Cérémonie inaugurale", "Patronage des autorités", "Affluence exceptionnelle"]
    },
    {
      year: "2019",
      title: "Consolidation & Nouvelle Vision",
      description: "Le C.A.S.T. se restructure avec 15 membres fondateurs partageant une même passion pour la musique sacrée et la spiritualité, renouvelant son engagement artistique et spirituel.",
      image: "/images/chorale-1.jpg",
      achievements: ["15 membres fondateurs", "Vision spirituelle renouvelée", "Nouveau local de répétition"]
    },
    {
      year: "2020",
      title: "Premier Concert Sacré",
      description: "Concert inaugural 'Lumières Célestes' à la Cathédrale d'Andohalo devant 300 personnes, marquant le début de notre mission artistique et spirituelle renouvelée.",
      image: "/images/chorale-2.jpg",
      achievements: ["300 spectateurs", "Répertoire de 20 pièces", "Reconnaissance diocésaine"]
    },
    {
      year: "2021",
      title: "Expansion et Structuration",
      description: "La chorale passe à 35 membres actifs et se structure en sections vocales. Création du programme de formation vocale et spirituelle.",
      image: "/images/chorale-3.jpg",
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
      number: "20+",
      label: "Ans d'Existence",
      description: "Depuis 2003",
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section - Année 2003 mise en avant */}
      <section className="relative py-8 md:py-16 lg:py-24 overflow-hidden bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white">
        <div className="absolute inset-0 bg-black/40"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/cast-chorale.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center 30%',
            backgroundRepeat: 'no-repeat'
          }}
        ></div>
        
        <div className="container mx-auto px-4 sm:px-6 relative">
          <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-12 xl:gap-16 min-h-[70vh]">
            {/* Content */}
            <div className="lg:w-1/2 text-center lg:text-left space-y-4 md:space-y-6">
              <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-3 md:p-4 inline-block border border-white/30">
                <span className="text-sm md:text-base lg:text-lg font-semibold text-white flex items-center justify-center lg:justify-start">
                  <span className="mr-2 text-lg md:text-xl">🎵</span> 
                  Fondé en 2003 • Chœur Sacré
                </span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold font-serif leading-tight">
                C.A.S.T. <span className="text-yellow-300 block mt-2 md:mt-4">Cantoria</span>
              </h1>
              
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-blue-100 font-light leading-relaxed">
                Chœur Artistique & Spirituel de Tanà
              </p>
              
              <p className="text-base md:text-lg lg:text-xl text-blue-200 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                <strong className="text-yellow-300">Depuis 2003</strong>, le C.A.S.T. Cantoria incarne 
                la rencontre sacrée entre <strong className="text-yellow-300">l'excellence musicale</strong> et 
                la <strong className="text-yellow-300">profondeur spirituelle</strong>. 
                Une histoire de passion, de foi et de dévouement à la musique sacrée.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center lg:justify-start pt-4">
                <Link 
                  to="/join" 
                  className="bg-yellow-400 text-gray-900 px-6 md:px-8 lg:px-10 py-3 md:py-4 rounded-xl md:rounded-2xl font-bold hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center text-sm md:text-base lg:text-lg min-w-[200px]"
                >
                  <span className="mr-2 md:mr-3 text-lg md:text-xl">🎤</span>
                  Rejoindre la Chorale
                </Link>
                <Link 
                  to="/events" 
                  className="border-2 border-white text-white px-6 md:px-8 lg:px-10 py-3 md:py-4 rounded-xl md:rounded-2xl font-bold hover:bg-white hover:text-purple-900 transition-all duration-300 transform hover:scale-105 flex items-center justify-center text-sm md:text-base lg:text-lg min-w-[200px] backdrop-blur-sm"
                >
                  <span className="mr-2 md:mr-3 text-lg md:text-xl">📅</span>
                  Nos Événements
                </Link>
              </div>
            </div>
            
            {/* Image */}
            <div className="lg:w-1/2 mt-6 lg:mt-0">
              <div className="relative group">
                <div className="absolute -inset-2 md:-inset-4 bg-gradient-to-r from-yellow-400 to-purple-600 rounded-2xl md:rounded-3xl opacity-50 group-hover:opacity-80 blur-lg md:blur-xl transition-all duration-500"></div>
                <div className="relative rounded-xl md:rounded-2xl shadow-xl md:shadow-2xl overflow-hidden">
                  <img 
                    src="/images/cast-chorale.jpg" 
                    alt="C.A.S.T. Cantoria en concert"
                    className="w-full h-64 sm:h-72 md:h-80 lg:h-96 object-cover object-center transform group-hover:scale-105 transition-all duration-700"
                    loading="eager"
                    style={{ objectPosition: 'center 30%' }}
                  />
                </div>
                <div className="absolute -bottom-3 -left-3 md:-bottom-4 md:-left-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-4 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl font-bold shadow-lg md:shadow-xl border-2 border-white text-xs md:text-sm">
                  <span className="text-lg md:text-xl mr-1 md:mr-2">🏆</span>
                  Depuis 2003
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Notre Histoire - Section spéciale 2003 */}
      <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-br from-purple-50 to-blue-100">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 md:p-12 border border-purple-200">
              <div className="text-center mb-8 md:mb-12">
                <div className="inline-flex items-center justify-center bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-full text-sm md:text-base font-semibold mb-4">
                  <span className="mr-2 text-lg">🎉</span>
                  Notre Histoire Fondatrice
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-serif">
                  La Naissance du C.A.S.T. en <span className="text-purple-600">2003</span>
                </h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
                <div className="space-y-6">
                  <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                    <p className="text-xl md:text-2xl font-light italic text-purple-700 mb-6">
                      "Tout a commencé en 2003. L'inauguration du groupe C.A.S.T. a été célébrée à l'Espace FENOHASINA Itaosy, sous les hauts patronages des autorités de la Région."
                    </p>
                    
                    <p className="mb-4 text-lg">
                      Ce moment historique a marqué la <strong>naissance officielle</strong> du Chœur Artistique & Spirituel de Tanà. 
                      Les parents et proches sont venus <strong>nombreux</strong>, certains ayant fait le déplacement de régions éloignées 
                      pour assister à cet événement fondateur.
                    </p>
                    
                    <p className="mb-4 text-lg">
                      Par la <strong>Grâce de Dieu</strong>, cette inauguration fut une véritable <strong>renaissance spirituelle et artistique</strong>. 
                      Elle a posé les bases solides d'une aventure musicale qui allait traverser les années.
                    </p>

                    <p className="text-lg font-semibold text-blue-700">
                      Au fil du temps, le C.A.S.T. est toujours debout, prêt à s'épanouir et à s'étendre vers tous les horizons. 
                      Grâce à vous, nous sommes fiers d'être Cantoria.
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl p-1">
                    <img 
                      src="/images/origines.png" 
                      alt="Inauguration du C.A.S.T. en 2003"
                      className="w-full h-64 sm:h-80 md:h-96 object-cover rounded-xl shadow-lg"
                      loading="lazy"
                    />
                  </div>
                  <div className="absolute -bottom-4 -right-4 bg-yellow-400 text-gray-900 px-6 py-3 rounded-xl font-bold text-lg shadow-lg border-2 border-white">
                    2003
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 md:py-12 lg:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 md:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 md:mb-6 font-serif">Notre Impact</h2>
            <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
              Plus de 20 ans de dévouement à la musique sacrée
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 md:hover:-translate-y-2 relative overflow-hidden h-full flex flex-col justify-center">
                  <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-2 group-hover:scale-110 transition-transform duration-300 relative">
                    {stat.icon}
                  </div>
                  <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2 relative">
                    {stat.number}
                  </div>
                  <div className="font-semibold text-blue-100 text-xs sm:text-sm md:text-base mb-1 relative">
                    {stat.label}
                  </div>
                  <div className="text-blue-200 text-xs sm:text-sm relative">
                    {stat.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-8 md:py-12 lg:py-16 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 md:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 md:mb-6 font-serif">Nos Valeurs</h2>
            <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Les principes qui animent chaque note et unissent chaque cœur depuis 2003
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 p-4 sm:p-6 md:p-8 group border border-blue-100 hover:border-blue-200">
                <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4 md:space-x-6">
                  <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl group-hover:scale-110 transition-transform duration-500 flex-shrink-0">
                    {value.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 font-serif">
                      {value.title}
                    </h3>
                    <p className="text-sm sm:text-base md:text-lg text-gray-700 mb-4 sm:mb-6 leading-relaxed">
                      {value.description}
                    </p>
                    
                    <div className="space-y-2 sm:space-y-3">
                      {value.details.map((detail, idx) => (
                        <div key={idx} className="flex items-start text-gray-600 group/item">
                          <span className="w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mr-3 mt-1 sm:mt-2 flex-shrink-0"></span>
                          <span className="text-xs sm:text-sm md:text-base leading-relaxed font-medium">
                            {detail}
                          </span>
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

      {/* Team Section - Images corrigées sans lettres */}
      <section className="py-8 md:py-12 lg:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 md:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 md:mb-6 font-serif">Notre Équipe</h2>
            <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Les visionnaires qui donnent corps et âme à notre mission depuis 2003
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10">
            {teamMembers.map((member, index) => (
              <div key={index} className="group">
                <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-700 overflow-hidden border border-blue-100 hover:border-blue-200 h-full flex flex-col">
                  {/* Image Container avec meilleur cadrage et sans lettre */}
                  <div className="relative h-64 sm:h-72 md:h-80 w-full overflow-hidden">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                      style={{ 
                        objectPosition: member.image.includes('Me.jpg') ? 'center 20%' : 
                                      member.image.includes('raprezy.jpg') ? 'center 25%' : 
                                      'center 30%' 
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    
                    {/* Badge Role - Sans lettre, avec icône */}
                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-lg rounded-xl w-12 h-12 flex items-center justify-center shadow-lg border border-white/30">
                      <span className="text-lg">👑</span>
                    </div>
                    
                    {/* Role */}
                    <div className="absolute bottom-4 left-4 bg-white/20 backdrop-blur-lg text-white px-3 py-2 rounded-lg border border-white/30">
                      <span className="font-semibold text-sm">{member.role}</span>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6 sm:p-8 flex flex-col flex-grow space-y-4">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight font-serif">
                      {member.name}
                    </h3>
                    
                    <p className="text-gray-700 text-base leading-relaxed flex-grow">
                      {member.description}
                    </p>
                    
                    {/* Quote */}
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-l-4 border-blue-500 relative">
                      <div className="text-2xl text-blue-300 absolute -top-2 left-3">"</div>
                      <p className="text-blue-800 italic text-base leading-relaxed relative z-10 pl-4">
                        "{member.quote}"
                      </p>
                    </div>
                    
                    {/* Specialties */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-800 text-lg flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                        Domaines d'expertise :
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {member.specialties.map((specialty, idx) => (
                          <span 
                            key={idx} 
                            className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-3 py-2 rounded-lg text-sm font-semibold border border-blue-200 hover:border-blue-300 transition-all duration-300 hover:scale-105 hover:shadow-md"
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

      {/* Timeline Section */}
      <section className="py-8 md:py-12 lg:py-16 bg-gradient-to-br from-purple-50 to-blue-100">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 md:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 md:mb-6 font-serif">Notre Parcours</h2>
            <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              De 2003 à aujourd'hui : 20 ans de croissance et de rayonnement spirituel
            </p>
          </div>

          <div className="max-w-7xl mx-auto">
            <div className="space-y-8 md:space-y-12 lg:space-y-16">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex flex-col lg:flex-row items-stretch gap-6 md:gap-8 ${index === 0 ? 'bg-yellow-50 rounded-2xl p-6 border-2 border-yellow-200' : ''}`}>
                  {/* Year Badge */}
                  <div className="flex justify-center lg:justify-start lg:w-1/4">
                    <div className={`bg-gradient-to-br from-blue-600 to-purple-600 text-white w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center text-xl md:text-2xl font-bold shadow-lg border-2 border-white ${index === 0 ? 'from-yellow-500 to-orange-500 scale-110' : ''}`}>
                      {milestone.year}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="lg:w-3/4">
                    <div className={`rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 p-6 md:p-8 border-l-4 h-full ${index === 0 ? 'bg-white border-yellow-500' : 'bg-white border-blue-500'}`}>
                      <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4 font-serif">
                        {milestone.title}
                      </h3>
                      
                      <p className="text-gray-700 mb-6 text-base md:text-lg leading-relaxed">
                        {milestone.description}
                      </p>
                      
                      {/* Image pour mobile */}
                      <div className="mb-6 lg:hidden">
                        <div className="relative">
                          <img 
                            src={milestone.image} 
                            alt={milestone.title}
                            className="w-full h-56 object-cover rounded-xl shadow-lg border-4 border-white"
                            loading="lazy"
                            style={{ objectPosition: 'center 30%' }}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        {milestone.achievements.map((achievement, idx) => (
                          <div key={idx} className="flex items-center text-gray-600 text-base">
                            <span className="w-3 h-3 bg-green-500 rounded-full mr-4"></span>
                            <span className="font-medium">{achievement}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Image pour desktop */}
                  <div className="hidden lg:block lg:w-2/4">
                    <div className="relative h-full">
                      <img 
                        src={milestone.image} 
                        alt={milestone.title}
                        className="w-full h-56 md:h-64 lg:h-72 object-cover rounded-xl shadow-lg border-4 border-white"
                        loading="lazy"
                        style={{ objectPosition: 'center 30%' }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-8 md:py-12 lg:py-16 bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 md:mb-8 font-serif">Notre Vision</h2>
          <p className="text-base md:text-lg lg:text-xl mb-8 md:mb-10 max-w-4xl mx-auto text-blue-100 leading-relaxed font-light">
            Forts de nos 20 ans d'existence, nous développons l'Académie C.A.S.T. pour former la nouvelle génération 
            de chantres sacrés et étendre notre rayonnement à travers des collaborations internationales.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-5xl mx-auto">
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
              <div key={index} className="bg-white/10 backdrop-blur-lg rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border border-white/20 hover:border-white/40 transition-all duration-500 group hover:scale-105">
                <div className="text-3xl sm:text-4xl md:text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {vision.icon}
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 font-serif">
                  {vision.title}
                </h3>
                <p className="text-blue-200 mb-4 sm:mb-6 text-sm sm:text-base md:text-lg">
                  {vision.description}
                </p>
                <div className="space-y-2">
                  {vision.details.map((detail, idx) => (
                    <div key={idx} className="flex items-center text-blue-100 text-xs sm:text-sm">
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

      {/* CTA Section */}
      <section className="py-8 md:py-12 lg:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <div className="max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-12 shadow-xl border border-blue-100">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 md:mb-8 font-serif leading-tight">
                Votre Voix a une <span className="text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">Mission</span>
              </h2>
              
              <p className="text-base md:text-lg lg:text-xl text-gray-600 mb-8 md:mb-10 leading-relaxed max-w-3xl mx-auto">
                Rejoignez une communauté où l'art rencontre la foi, où chaque chant est une prière depuis 2003.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center">
                <Link 
                  to="/join"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 md:px-8 lg:px-10 py-3 md:py-4 rounded-xl sm:rounded-2xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center text-sm md:text-base lg:text-lg min-w-[200px] sm:min-w-[220px]"
                >
                  <span className="mr-2 md:mr-3 text-lg md:text-xl">🎤</span>
                  Nous Rejoindre
                </Link>
                
                <Link 
                  to="/spiritualite"
                  className="border-2 border-blue-600 text-blue-600 px-6 md:px-8 lg:px-10 py-3 md:py-4 rounded-xl sm:rounded-2xl font-bold hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:scale-105 flex items-center justify-center text-sm md:text-base lg:text-lg min-w-[200px] sm:min-w-[220px] bg-white/80"
                >
                  <span className="mr-2 md:mr-3 text-lg md:text-xl">🕊️</span>
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
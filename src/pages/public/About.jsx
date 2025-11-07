import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  const teamMembers = [
    {
      name: "Son Excellence Liva Ramanalinarivo",
      role: "Fondateur & Directeur Spirituel",
      description: "Zoky ara-panahy et Mpitoriteny passionné, Son Excellence Liva Ramanalinarivo est le fondateur visionnaire du Chœur Artistique & Spirituel de Tanà (C.A.S.T.). Animé par une foi profonde et une sensibilité musicale rare, il a initié ce projet comme un sanctuaire vivant où l'art vocal devient prière, et où la beauté sonore sert la quête spirituelle. Sa démarche vise à unir excellence musicale, élévation intérieure et fraternité active, pour faire du CAST non seulement une chorale, mais une école de l'âme, un espace de transformation et de communion. Sous sa direction, chaque voix trouve sa place, chaque silence devient offrande, et chaque membre est invité à chanter avec le cœur autant qu'avec la technique.",
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
      description: "Maître Eric Rasamimanana, diplômé du Conservatoire de Paris, incarne l'exigence artistique et la rigueur musicale au sein du CAST. Avec une pédagogie vocale fine et une passion pour le répertoire sacré, il façonne les voix avec précision et bienveillance. Son approche allie discipline chorale et sensibilité spirituelle, permettant à chaque choriste de s'élever techniquement tout en restant enraciné dans la dimension sacrée du chant. Sous sa baguette, le chœur devient un corps vivant, animé par la justesse, la ferveur et l'harmonie.",
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
      description: "Ancien soliste de l'Opéra de Paris, Jules Randriamanantsoa apporte au CAST une exigence artistique de haut niveau et une sensibilité rare. En tant que responsable artistique, il veille à la qualité des interprétations, à la cohérence des arrangements et à la profondeur expressive de chaque production. Son expérience scénique et sa maîtrise vocale nourrissent le chœur d'une énergie créative, où chaque note devient émotion, et chaque prestation, une offrande esthétique. Il incarne l'élégance, la rigueur et l'âme artistique du projet.",
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
      description: "Initiateur du Chœur Artistique & Spirituel de Tanà (C.A.S.T.), Tovoniaina RAHENDRISON a porté ce projet dès ses premières vibrations, avec la volonté farouche de le faire connaître au-delà des frontières. Architecte technique, chef de projet et porteur de sens, il a mis en œuvre tous les moyens — humains, numériques et symboliques — pour structurer, documenter et faire rayonner le CAST dans le monde entier. Son engagement ne se limite pas à la technique : il veille à la cohérence visuelle, à la transmission pédagogique, et à l'élévation collective du groupe. À travers CAST, il incarne une vision où la beauté du chant sacré rencontre la rigueur du code, et où chaque membre est invité à chanter, comprendre et transmettre.",
      image: "/images/Me.jpg",
      specialties: [
        "Initiation & Structuration du projet",
        "Architecture Technique & Documentation",
        "Transmission Pédagogique",
        "Rayonnement International",
        "Symbolisme & Identité Visuelle"
      ],
      quote: "Le code, comme la musique, doit servir une beauté qui élève l'âme."
    }
  ];

  const milestones = [
    {
      year: "2019",
      title: "Naissance d'une Vision Sacrée",
      description: "Fondation du C.A.S.T. par Son Excellence Liva Ramanalinarivo avec 15 membres fondateurs partageant une même passion pour la musique sacrée et la spiritualité. Naissance d'un sanctuaire vocal où l'art rencontre la foi.",
      image: "/images/origines.png",
      achievements: ["15 membres fondateurs", "Vision spirituelle établie", "Premier local de répétition sacré"]
    },
    {
      year: "2020",
      title: "Premier Concert Sacré",
      description: "Concert inaugural 'Lumières Célestes' à la Cathédrale d'Andohalo devant 300 personnes, marquant le début de notre mission artistique et spirituelle. Première offrande musicale collective.",
      image: "/images/chorale-1.jpg",
      achievements: ["300 spectateurs émus", "Répertoire de 20 pièces sacrées", "Reconnaissance diocésaine"]
    },
    {
      year: "2021",
      title: "Expansion et Structuration",
      description: "La chorale passe à 35 membres actifs et se structure en sections vocales. Création du programme de formation vocale et spirituelle pour les nouveaux membres.",
      image: "/images/chorale-2.jpg",
      achievements: ["35 membres actifs", "4 sections vocales harmonisées", "Programme de formation intégrale"]
    },
    {
      year: "2022",
      title: "Excellence Artistique Reconnue",
      description: "Participation remarquée au Festival National de Musique Sacrée de Madagascar. Premiers enregistrements studio de notre répertoire, fixation de notre patrimoine vocal.",
      image: "/images/collaborations.png",
      achievements: ["Prix d'excellence national", "5 enregistrements studio", "Répertoire de 50 pièces maîtrisées"]
    },
    {
      year: "2023",
      title: "Rayonnement National",
      description: "Atteinte d'un effectif de 50 choristes et création de l'Académie C.A.S.T. pour la formation des jeunes talents. Premières tournées régionales, semence musicale à travers l'île.",
      image: "/images/chorale-3.jpg",
      achievements: ["50 membres actifs engagés", "Création de l'Académie C.A.S.T.", "3 tournées régionales fructueuses"]
    },
    {
      year: "2024",
      title: "Innovation et Ouverture Mondiale",
      description: "Lancement de la plateforme numérique C.A.S.T., collaborations internationales virtuelles et projet d'album studio. Le chant sacré malgache s'ouvre au monde numérique.",
      image: "/images/diffusion.png",
      achievements: ["Plateforme numérique innovante", "Collaborations internationales", "Projet album studio ambitieux"]
    }
  ];

  const values = [
    {
      icon: "🎵",
      title: "Excellence Musicale",
      description: "Nous visons la plus haute qualité artistique dans l'interprétation du répertoire sacré, alliant technique vocale rigoureuse et expressivité authentique. Chaque note doit être une offrande parfaite.",
      details: [
        "Formation vocale continue et exigeante",
        "Répertoire sacré diversifié et maîtrisé",
        "Répétitions rigoureuses et productives"
      ]
    },
    {
      icon: "🙏",
      title: "Spiritualité Profonde",
      description: "La musique comme moyen d'élévation spirituelle et de louange. Chaque concert est une prière, chaque note une offrande, chaque silence une présence divine.",
      details: [
        "Prière communautaire avant chaque répétition",
        "Réflexion spirituelle partagée",
        "Musique au service de la liturgie"
      ]
    },
    {
      icon: "👥",
      title: "Communauté Fraternelle",
      description: "Une famille unie par la passion du chant et le partage des valeurs. L'accueil et l'entraide sont au cœur de notre démarche humaine et spirituelle.",
      details: [
        "Accueil chaleureux des nouveaux membres",
        "Partage fraternel des joies et épreuves",
        "Solidarité active dans la vie communautaire"
      ]
    },
    {
      icon: "🌍",
      title: "Rayonnement Culturel",
      description: "Porter la beauté de la musique sacrée au plus grand nombre, au service de l'Église et de la société malgache. Notre chant comme ambassadeur de la foi.",
      details: [
        "Concerts publics accessibles à tous",
        "Actions caritatives et sociales",
        "Transmission du patrimoine culturel sacré"
      ]
    }
  ];

  const stats = [
    {
      number: "50+",
      label: "Membres Actifs",
      description: "Choristes passionnés et spirituellement engagés",
      icon: "🎤"
    },
    {
      number: "100+",
      label: "Pièces au Répertoire",
      description: "Du grégorien au contemporain sacré",
      icon: "📜"
    },
    {
      number: "25+",
      label: "Concerts Annuels",
      description: "Liturgies, concerts et événements sacrés",
      icon: "🎭"
    },
    {
      number: "5",
      label: "Ans de Mission",
      description: "Depuis notre fondation visionnaire en 2019",
      icon: "⭐"
    },
    {
      number: "15+",
      label: "Lieux Sacrés",
      description: "Cathédrales et églises sanctifiées par notre chant",
      icon: "⛪"
    },
    {
      number: "1000+",
      label: "Âmes Touchées",
      description: "Auditeurs transformés par la beauté sacrée",
      icon: "👥"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-20">
      {/* Hero Section Magistrale - Version Améliorée */}
      <section className="relative py-32 overflow-hidden bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="absolute inset-0 bg-[url('/images/cast-chorale.jpg')] bg-cover bg-center opacity-30"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-purple-900/60"></div>
        
        <div className="container mx-auto px-6 relative">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-4 inline-block mb-8 border border-white/30">
                <span className="text-lg font-semibold text-white flex items-center">
                  <span className="mr-2 text-2xl">🎵</span> 
                  Chœur Sacré Depuis 2019 • Excellence Spirituelle
                </span>
              </div>
              
              <h1 className="text-6xl md:text-7xl font-bold mb-8 font-serif leading-tight">
                C.A.S.T. <span className="text-yellow-300 block mt-2">Cantoria</span>
              </h1>
              
              <p className="text-2xl md:text-3xl mb-8 leading-relaxed text-blue-100 font-light">
                Chœur Artistique & Spirituel de Tanà
              </p>
              
              <p className="text-xl text-blue-200 mb-10 leading-relaxed max-w-2xl">
                Fondé en 2019, le <strong className="text-white font-semibold">C.A.S.T. Cantoria</strong> incarne 
                la rencontre sacrée entre <strong className="text-yellow-300">l'excellence musicale</strong> et 
                la <strong className="text-yellow-300">profondeur spirituelle</strong>. 
                Notre mission : transformer le chant en prière, élever les âmes par la beauté, 
                et bâtir une communauté où chaque voix sert le divin.
              </p>
              
              <div className="flex flex-wrap gap-6">
                <Link 
                  to="/join" 
                  className="bg-yellow-400 text-gray-900 px-10 py-5 rounded-2xl font-bold hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl flex items-center text-lg"
                >
                  <span className="mr-3 text-2xl">🎤</span>
                  Rejoindre la Communion Vocale
                </Link>
                <Link 
                  to="/events" 
                  className="border-2 border-white text-white px-10 py-5 rounded-2xl font-bold hover:bg-white hover:text-purple-900 transition-all duration-300 transform hover:scale-105 flex items-center text-lg backdrop-blur-sm"
                >
                  <span className="mr-3 text-2xl">📅</span>
                  Vivre nos Célébrations
                </Link>
              </div>
            </div>
            
            <div className="lg:w-1/2">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-yellow-400 to-purple-600 rounded-3xl opacity-50 group-hover:opacity-80 blur-xl transition-all duration-500"></div>
                <img 
                  src="/images/cast-chorale.jpg" 
                  alt="C.A.S.T. Cantoria en concert solennel - Chœur sacré unifié"
                  className="relative rounded-2xl shadow-2xl w-full h-[600px] object-cover transform group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute -bottom-6 -left-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-8 py-4 rounded-2xl font-bold shadow-2xl border-2 border-white">
                  <span className="text-2xl mr-2">🏆</span>
                  Excellence Spirituelle 2024
                </div>
                <div className="absolute -top-6 -right-6 bg-white/20 backdrop-blur-lg text-white px-6 py-3 rounded-2xl font-semibold border border-white/30">
                  <span className="text-xl mr-2">⭐</span>
                  50+ Membres Actifs
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chiffres Clés Témoins - Version Améliorée */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 opacity-70"></div>
        <div className="container mx-auto px-6 relative">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-6 font-serif">Notre Impact Sacré</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Des chiffres qui témoignent de notre engagement et de notre rayonnement spirituel
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-3 relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300 relative">{stat.icon}</div>
                  <div className="text-4xl font-bold mb-2 relative">{stat.number}</div>
                  <div className="font-semibold text-blue-100 text-base mb-2 relative">{stat.label}</div>
                  <div className="text-blue-200 text-sm relative">{stat.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Valeurs Fondatrices Sacrées - Version Améliorée */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-72 h-72 bg-purple-200 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-50"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-200 rounded-full translate-x-1/3 translate-y-1/3 opacity-50"></div>
        
        <div className="container mx-auto px-6 relative">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-gray-900 mb-6 font-serif">Notre Colonne Vertébrale Spirituelle</h2>
            <p className="text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Les principes sacrés qui animent chaque note, guident chaque prière, et unissent chaque cœur dans une harmonie divine
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 p-10 group border border-blue-100 hover:border-blue-200 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full -translate-y-16 translate-x-16 opacity-60"></div>
                
                <div className="flex items-start space-x-8 relative">
                  <div className="text-6xl group-hover:scale-110 transition-transform duration-500 flex-shrink-0">
                    {value.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-3xl font-bold text-gray-900 mb-6 font-serif">{value.title}</h3>
                    <p className="text-lg text-gray-700 mb-8 leading-relaxed">{value.description}</p>
                    
                    <div className="space-y-4">
                      {value.details.map((detail, idx) => (
                        <div key={idx} className="flex items-start text-gray-600 group/item">
                          <span className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mr-4 mt-2 flex-shrink-0 group-hover/item:scale-125 transition-transform"></span>
                          <span className="text-base leading-relaxed font-medium">{detail}</span>
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

      {/* Âme du C.A.S.T. - Équipe Fondatrice - VERSION ULTIME */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-10 left-10 w-64 h-64 bg-blue-50 rounded-full opacity-60"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-50 rounded-full opacity-60"></div>
        
        <div className="container mx-auto px-6 relative">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-gray-900 mb-6 font-serif">L'Âme Fondatrice du C.A.S.T.</h2>
            <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Rencontrez les visionnaires qui donnent corps et âme à notre mission sacrée, 
              unissant leurs talents pour créer une harmonie céleste
            </p>
          </div>

          <div className="grid grid-cols-1 2xl:grid-cols-2 gap-12">
            {teamMembers.map((member, index) => (
              <div key={index} className="group">
                <div className="bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-700 overflow-hidden border border-blue-100 hover:border-blue-200 h-full flex flex-col">
                  {/* Image en pleine largeur avec overlay amélioré */}
                  <div className="relative h-96 w-full overflow-hidden">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    
                    {/* Badge spécialité */}
                    <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-lg rounded-2xl w-14 h-14 flex items-center justify-center text-2xl font-bold text-blue-600 shadow-lg border border-white/30">
                      {member.specialties[0]?.charAt(0)}
                    </div>
                    
                    {/* Badge rôle avec effet glassmorphism */}
                    <div className="absolute bottom-6 left-6 bg-white/20 backdrop-blur-lg text-white px-6 py-3 rounded-2xl border border-white/30">
                      <span className="font-semibold text-lg">{member.role}</span>
                    </div>
                    
                    {/* Effet de brillance au hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  </div>
                  
                  {/* Contenu texte enrichi */}
                  <div className="p-8 flex flex-col flex-grow">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 leading-tight font-serif">
                      {member.name}
                    </h3>
                    
                    <p className="text-gray-700 mb-6 text-lg leading-relaxed flex-grow">
                      {member.description}
                    </p>
                    
                    {/* Citation mise en valeur */}
                    <div className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border-l-4 border-blue-500 relative">
                      <div className="text-4xl text-blue-300 absolute -top-2 left-4">"</div>
                      <p className="text-blue-800 italic text-lg leading-relaxed relative z-10">
                        "{member.quote}"
                      </p>
                    </div>
                    
                    {/* Spécialités avec design amélioré */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-800 text-xl flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                        Domaines d'Expertise :
                      </h4>
                      <div className="flex flex-wrap gap-3">
                        {member.specialties.map((specialty, idx) => (
                          <span 
                            key={idx} 
                            className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-4 py-3 rounded-2xl text-base font-semibold border border-blue-200 hover:border-blue-300 transition-all duration-300 hover:scale-105 hover:shadow-lg"
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

      {/* Histoire - Chronologie Sacrée - Version Améliorée */}
      <section className="py-24 bg-gradient-to-br from-purple-50 to-blue-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full -translate-y-48 translate-x-48 opacity-40"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-200 rounded-full translate-y-48 -translate-x-48 opacity-40"></div>
        
        <div className="container mx-auto px-6 relative">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-gray-900 mb-6 font-serif">Notre Parcours Inspiré</h2>
            <p className="text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Cinq années de croissance bénie, d'excellence sacrée et de rayonnement spirituel, 
              marquant chaque étape de notre évolution divine
            </p>
          </div>

          <div className="max-w-7xl mx-auto">
            <div className="relative">
              {/* Ligne de temps sacrée améliorée */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-2 bg-gradient-to-b from-blue-400 to-purple-600 h-full hidden lg:block rounded-full shadow-lg"></div>
              
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex flex-col lg:flex-row items-stretch mb-20 ${
                  index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                }`}>
                  {/* Côté contenu */}
                  <div className={`lg:w-5/12 ${index % 2 === 0 ? 'lg:pr-12' : 'lg:pl-12'} mb-8 lg:mb-0`}>
                    <div className="bg-white rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 p-8 border-l-4 border-blue-500 h-full relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full -translate-y-12 translate-x-12 opacity-60"></div>
                      
                      <div className="flex items-center mb-6">
                        <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white w-20 h-20 rounded-2xl flex items-center justify-center text-xl font-bold mr-6 shadow-lg border-2 border-white">
                          {milestone.year}
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 font-serif">{milestone.title}</h3>
                      </div>
                      
                      <p className="text-gray-700 mb-6 text-lg leading-relaxed">{milestone.description}</p>
                      
                      <div className="space-y-3">
                        {milestone.achievements.map((achievement, idx) => (
                          <div key={idx} className="flex items-center text-gray-600 text-base group/achieve">
                            <span className="w-3 h-3 bg-green-500 rounded-full mr-4 group-hover/achieve:scale-125 transition-transform"></span>
                            <span className="font-medium">{achievement}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Point central sacré amélioré */}
                  <div className="hidden lg:flex w-2/12 justify-center relative items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full border-4 border-white shadow-2xl z-10 transform group-hover:scale-125 transition-transform duration-300"></div>
                    <div className="absolute w-16 h-16 bg-blue-200 rounded-full opacity-30 group-hover:scale-150 transition-transform duration-500"></div>
                  </div>
                  
                  {/* Côté image amélioré */}
                  <div className={`lg:w-5/12 ${index % 2 === 0 ? 'lg:pl-12' : 'lg:pr-12'}`}>
                    <div className="relative group/image h-full">
                      <div className="absolute -inset-4 bg-gradient-to-r from-blue-400 to-purple-600 rounded-3xl opacity-20 group-hover/image:opacity-40 blur-xl transition-all duration-500"></div>
                      <img 
                        src={milestone.image} 
                        alt={milestone.title}
                        className="relative w-full h-80 lg:h-96 object-cover rounded-2xl shadow-2xl group-hover/image:scale-105 transition-transform duration-500 border-4 border-white"
                      />
                      <div className="absolute inset-0 bg-blue-900 opacity-0 group-hover/image:opacity-10 rounded-2xl transition-opacity duration-300"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Vision Prophétique - Version Corrigée */}
      <section className="py-24 bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white/10 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white/10 to-transparent"></div>
        
        <div className="container mx-auto px-6 text-center relative">
          <h2 className="text-5xl font-bold mb-8 font-serif">Notre Vision Prophétique 2025-2030</h2>
          <p className="text-2xl mb-12 max-w-4xl mx-auto text-blue-100 leading-relaxed font-light">
            Développer l'Académie C.A.S.T. pour former la nouvelle génération de chantres sacrés, 
            créer un studio d'enregistrement professionnel dédié au répertoire spirituel, 
            et étendre notre rayonnement à travers des collaborations internationales 
            et des tournées sacrées qui porteront la voix malgache aux quatre coins du monde.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto">
            {[
              {
                icon: "🎓",
                title: "Académie Sacrée",
                description: "Former 50 jeunes talents par an d'ici 2026",
                details: ["Programme de formation complet", "Mentorat spirituel", "Excellence vocale"]
              },
              {
                icon: "🎼",
                title: "Création Inspirée",
                description: "Composer et enregistrer 20 nouvelles pièces sacrées",
                details: ["Studio professionnel", "Compositions originales", "Patrimoine musical"]
              },
              {
                icon: "🌍",
                title: "Rayonnement Mondial",
                description: "Concerts dans 5 pays d'Afrique et d'Europe",
                details: ["Tournées internationales", "Collaborations", "Ambassade culturelle"]
              }
            ].map((vision, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 hover:border-white/40 transition-all duration-500 group hover:scale-105">
                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">{vision.icon}</div>
                <h3 className="text-2xl font-bold mb-4 font-serif">{vision.title}</h3>
                <p className="text-blue-200 mb-6 text-lg">{vision.description}</p>
                <div className="space-y-2">
                  {vision.details.map((detail, idx) => (
                    <div key={idx} className="flex items-center text-blue-100 text-sm">
                      <span className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></span>
                      {detail}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Appel Final Sacré - Version Améliorée */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-50 to-transparent"></div>
        <div className="container mx-auto px-6 text-center relative">
          <div className="max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-16 shadow-2xl border border-blue-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full -translate-y-32 translate-x-32 opacity-60"></div>
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-100 rounded-full translate-y-32 -translate-x-32 opacity-60"></div>
              
              <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8 font-serif leading-tight relative">
                Votre Voix a une <span className="text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">Mission Divine</span>
              </h2>
              
              <p className="text-2xl text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto relative">
                Rejoignez une communauté où l'art rencontre la foi, où chaque chant est une prière, 
                où votre talent sert une beauté qui élève les âmes vers le divin. 
                Devenez l'instrument d'une harmonie sacrée qui transforme les cœurs et glorifie le Créateur.
              </p>
              
              <div className="flex flex-col lg:flex-row gap-6 justify-center items-center relative">
                <Link 
                  to="/join"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 py-6 rounded-2xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl flex items-center justify-center text-lg min-w-64"
                >
                  <span className="mr-3 text-2xl">🎤</span>
                  Devenir Membre du C.A.S.T.
                </Link>
                
                <Link 
                  to="/spiritualite"
                  className="border-2 border-blue-600 text-blue-600 px-12 py-6 rounded-2xl font-bold hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:scale-105 flex items-center justify-center text-lg min-w-64 bg-white/80 backdrop-blur-sm"
                >
                  <span className="mr-3 text-2xl">🕊️</span>
                  Approfondir Notre Spiritualité
                </Link>
              </div>
              
              <div className="mt-12 text-gray-500 relative">
                <p className="text-lg flex items-center justify-center">
                  <span className="text-2xl mr-3">✨</span>
                  Une audition musicale et un entretien spirituel vous attendent - Votre voix a une place unique dans notre chœur sacré
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
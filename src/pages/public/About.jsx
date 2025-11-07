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
      {/* Hero Section Magistrale */}
      <section className="relative py-24 overflow-hidden bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="absolute inset-0 bg-[url('/images/cast-chorale.jpg')] bg-cover bg-center opacity-20"></div>
        
        <div className="container mx-auto px-4 relative">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <div className="bg-white/10 backdrop-blur rounded-2xl p-3 inline-block mb-6">
                <span className="text-sm font-semibold">🎵 Chœur Sacré Depuis 2019</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold mb-6 font-serif leading-tight">
                C.A.S.T. <span className="text-yellow-300">Cantoria</span>
              </h1>
              
              <p className="text-xl md:text-2xl mb-6 leading-relaxed text-blue-100">
                Chœur Artistique & Spirituel de Tanà
              </p>
              
              <p className="text-lg text-blue-200 mb-8 leading-relaxed">
                Fondé en 2019, le <strong className="text-white">C.A.S.T. Cantoria</strong> incarne 
                la rencontre sacrée entre <strong className="text-yellow-300">l'excellence musicale</strong> et 
                la <strong className="text-yellow-300">profondeur spirituelle</strong>. 
                Notre mission : transformer le chant en prière, élever les âmes par la beauté, 
                et bâtir une communauté où chaque voix sert le divin.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link 
                  to="/join" 
                  className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-xl font-bold hover:bg-yellow-300 transition transform hover:scale-105 shadow-lg flex items-center"
                >
                  <span className="mr-2">🎤</span>
                  Rejoindre la Communion Vocale
                </Link>
                <Link 
                  to="/events" 
                  className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold hover:bg-white hover:text-purple-900 transition transform hover:scale-105 flex items-center"
                >
                  <span className="mr-2">📅</span>
                  Vivre nos Célébrations
                </Link>
              </div>
            </div>
            
            <div className="lg:w-1/2">
              <div className="relative">
                <img 
                  src="/images/cast-chorale.jpg" 
                  alt="C.A.S.T. Cantoria en concert solennel - Chœur sacré unifié"
                  className="rounded-2xl shadow-2xl w-full h-auto transform rotate-1 hover:rotate-0 transition-transform duration-500"
                />
                <div className="absolute -bottom-6 -left-6 bg-yellow-400 text-gray-900 px-6 py-3 rounded-xl font-bold shadow-lg">
                  🏆 Excellence Spirituelle 2024
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chiffres Clés Témoins */}
      <section className="py-16 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-50"></div>
        <div className="container mx-auto px-4 relative">
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{stat.icon}</div>
                  <div className="text-3xl font-bold mb-1">{stat.number}</div>
                  <div className="font-semibold text-blue-100 text-sm mb-1">{stat.label}</div>
                  <div className="text-blue-200 text-xs">{stat.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Valeurs Fondatrices Sacrées */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-serif">Notre Colonne Vertébrale Spirituelle</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Les principes sacrés qui animent chaque note, guident chaque prière, et unissent chaque cœur
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-8 group border border-blue-100">
                <div className="flex items-start space-x-6">
                  <div className="text-5xl group-hover:scale-110 transition-transform duration-300">
                    {value.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{value.title}</h3>
                    <p className="text-gray-700 mb-6 leading-relaxed">{value.description}</p>
                    
                    <div className="space-y-3">
                      {value.details.map((detail, idx) => (
                        <div key={idx} className="flex items-start text-gray-600">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                          <span className="text-sm leading-relaxed">{detail}</span>
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

      {/* Âme du C.A.S.T. - Équipe Fondatrice */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-serif">L'Âme Fondatrice du C.A.S.T.</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Rencontrez les visionnaires qui donnent corps et âme à notre mission sacrée
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 group border border-blue-100">
                <div className="flex flex-col md:flex-row h-full">
                  <div className="md:w-2/5 relative">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-64 md:h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur rounded-full w-12 h-12 flex items-center justify-center text-xl shadow-lg">
                      {member.specialties[0]?.charAt(0)}
                    </div>
                  </div>
                  
                  <div className="md:w-3/5 p-6 flex flex-col">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight">{member.name}</h3>
                    <p className="text-blue-600 font-semibold mb-4 text-sm">{member.role}</p>
                    
                    <p className="text-gray-700 mb-4 text-sm leading-relaxed flex-grow">{member.description}</p>
                    
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                      <p className="text-blue-800 italic text-sm">"{member.quote}"</p>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-800 text-sm">Domaines d'Expertise :</h4>
                      <div className="flex flex-wrap gap-2">
                        {member.specialties.map((specialty, idx) => (
                          <span key={idx} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
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

      {/* Histoire - Chronologie Sacrée */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-blue-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-serif">Notre Parcours Inspiré</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Cinq années de croissance bénie, d'excellence sacrée et de rayonnement spirituel
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="relative">
              {/* Ligne de temps sacrée */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-blue-200 h-full hidden md:block"></div>
              
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex flex-col md:flex-row items-center mb-16 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}>
                  {/* Côté contenu */}
                  <div className={`md:w-5/12 ${index % 2 === 0 ? 'md:pr-8' : 'md:pl-8'} mb-6 md:mb-0`}>
                    <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 border-l-4 border-blue-500">
                      <div className="flex items-center mb-4">
                        <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold mr-4 shadow-lg">
                          {milestone.year}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">{milestone.title}</h3>
                      </div>
                      
                      <p className="text-gray-700 mb-4 leading-relaxed">{milestone.description}</p>
                      
                      <div className="space-y-2">
                        {milestone.achievements.map((achievement, idx) => (
                          <div key={idx} className="flex items-center text-gray-600 text-sm">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                            {achievement}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Point central sacré */}
                  <div className="hidden md:flex w-2/12 justify-center relative">
                    <div className="w-6 h-6 bg-blue-600 rounded-full border-4 border-white shadow-lg z-10"></div>
                  </div>
                  
                  {/* Côté image */}
                  <div className={`md:w-5/12 ${index % 2 === 0 ? 'md:pl-8' : 'md:pr-8'}`}>
                    <div className="relative group">
                      <img 
                        src={milestone.image} 
                        alt={milestone.title}
                        className="w-full h-64 object-cover rounded-2xl shadow-lg group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-blue-900 opacity-0 group-hover:opacity-20 rounded-2xl transition-opacity duration-300"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Vision Prophétique */}
      <section className="py-20 bg-gradient-to-r from-blue-900 to-purple-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6 font-serif">Notre Vision Prophétique</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto text-blue-100 leading-relaxed">
            Développer l'Académie C.A.S.T. pour former la nouvelle génération de chantres sacrés, 
            créer un studio d'enregistrement professionnel dédié au répertoire spirituel, 
            et étendre notre rayonnement à travers des collaborations internationales 
            et des tournées sacrées qui porteront la voix malgache aux quatre coins du monde.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
              <div className="text-4xl mb-4">🎓</div>
              <h3 className="text-xl font-bold mb-3">Académie Sacrée</h3>
              <p className="text-blue-200">Former 50 jeunes talents par an d'ici 2026</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
              <div className="text-4xl mb-4">🎼</div>
              <h3 className="text-xl font-bold mb-3">Création Inspirée</h3>
              <p className="text-blue-200">Composer et enregistrer 20 nouvelles pièces sacrées</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
              <div className="text-4xl mb-4">🌍</div>
              <h3 className="text-xl font-bold mb-3">Rayonnement Mondial</h3>
              <p className="text-blue-200">Concerts dans 5 pays d'Afrique et d'Europe</p>
            </div>
          </div>
        </div>
      </section>

      {/* Appel Final Sacré */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-serif leading-tight">
              Votre Voix a une <span className="text-blue-600">Mission Divine</span>
            </h2>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Rejoignez une communauté où l'art rencontre la foi, où chaque chant est une prière, 
              où votre talent sert une beauté qui élève les âmes vers le divin. 
              Devenez l'instrument d'une harmonie sacrée qui transforme les cœurs et glorifie le Créateur.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/join"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition transform hover:scale-105 shadow-lg flex items-center justify-center"
              >
                <span className="mr-2">🎤</span>
                Devenir Membre du C.A.S.T.
              </Link>
              
              <Link 
                to="/spiritualite"
                className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-xl font-bold hover:bg-blue-600 hover:text-white transition transform hover:scale-105 flex items-center justify-center"
              >
                <span className="mr-2">🕊️</span>
                Approfondir Notre Spiritualité
              </Link>
            </div>
            
            <div className="mt-8 text-gray-500">
              <p className="text-sm">
                ✨ Une audition musicale et un entretien spirituel vous attendent - Votre voix a une place unique dans notre chœur sacré
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
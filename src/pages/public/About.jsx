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
      title: "✨ Naissance d'un Souffle Sacré",
      description: "L'inauguration du groupe C.A.S.T. fut célébrée à l'Espace FENOHASINA Itaosy, sous les hauts patronages des autorités de la Région. Ce jour-là, les familles, les proches et les amis sont venus nombreux — certains de très loin — pour vivre ensemble un moment inoubliable. Par la Grâce de Dieu, ce fut une véritable Renaissance. Un souffle nouveau s'est levé, mêlant ferveur, beauté et unité.",
      image: "/images/origines.png",
      achievements: ["Cérémonie inaugurale sacrée", "Patronage des autorités", "Communauté unie dans la foi"]
    },
    {
      year: "2019",
      title: "🎵 Renouveau des Vocations",
      description: "Le C.A.S.T. se restructure avec de nouveaux membres fondateurs partageant une même passion pour la musique sacrée et la spiritualité, renouvelant son engagement artistique et spirituel.",
      image: "/images/chorale-1.jpg",
      achievements: ["Nouveaux membres dévoués", "Vision spirituelle approfondie", "Engagement renouvelé"]
    },
    {
      year: "2020",
      title: "🕊️ Première Offrande Musicale",
      description: "Concert inaugural 'Lumières Célestes' à la Cathédrale d'Andohalo, où chaque note devient prière et chaque silence résonne de la présence divine.",
      image: "/images/chorale-2.jpg",
      achievements: ["300 âmes touchées", "20 pièces sacrées interprétées", "Consécration diocésaine"]
    },
    {
      year: "2021",
      title: "👥 Expansion de la Famille Spirituelle",
      description: "La chorale passe à 35 membres actifs et se structure en sections vocales. Création du programme de formation vocale et spirituelle pour approfondir la mission.",
      image: "/images/chorale-3.jpg",
      achievements: ["35 voix unies en prière", "4 sections harmonieuses", "Programme de formation intégrale"]
    },
    {
      year: "2022",
      title: "⭐ Excellence Reconnue par la Grâce",
      description: "Participation bénie au Festival National de Musique Sacrée de Madagascar et premiers enregistrements studio pour l'éternité de notre répertoire sacré.",
      image: "/images/collaborations.png",
      achievements: ["Prix d'excellence décerné", "5 œuvres immortalisées", "50 pièces maîtrisées"]
    },
    {
      year: "2023",
      title: "🌍 Rayonnement Œcuménique",
      description: "Atteinte d'un effectif de 50 choristes unis dans la diversité chrétienne et création de l'Académie C.A.S.T. pour former les générations futures de chantres sacrés.",
      image: "/images/chorale-3.jpg",
      achievements: ["50 cœurs unis en Christ", "Académie sacrée fondée", "3 tournées régionales bénies"]
    },
    {
      year: "2024",
      title: "🚀 Innovation au Service du Sacré",
      description: "Lancement de la plateforme numérique C.A.S.T. pour porter la beauté sacrée aux confins du monde numérique et collaborations internationales virtuelles.",
      image: "/images/diffusion.png",
      achievements: ["Plateforme numérique bénie", "Collaborations internationales", "Projet album studio en gestation"]
    }
  ];

  const values = [
    {
      icon: "✨",
      title: "Excellence Artistique Sacrée",
      description: "Nous visons la plus haute qualité artistique dans l'interprétation du répertoire sacré, où chaque note est une offrande et chaque silence une prière.",
      details: [
        "Formation vocale continue",
        "Répertoire sacré diversifié",
        "Répétitions consacrées"
      ]
    },
    {
      icon: "🕊️",
      title: "Spiritualité Profonde",
      description: "La musique comme moyen d'élévation spirituelle et de louange. Chaque concert est une célébration, chaque chant une oraison.",
      details: [
        "Prière communautaire",
        "Méditation spirituelle",
        "Musique liturgique vivante"
      ]
    },
    {
      icon: "👨‍👩‍👧‍👦",
      title: "Communauté Œcuménique",
      description: "Une famille unie par la passion du chant sacré, transcendant les dénominations chrétiennes dans l'unité de l'Esprit.",
      details: [
        "Accueil fraternel",
        "Partage œcuménique",
        "Solidarité active"
      ]
    },
    {
      icon: "🌍",
      title: "Rayonnement Universel",
      description: "Porter la beauté de la musique sacrée au plus grand nombre, comme ambassadeurs de la paix et de l'unité en Christ.",
      details: [
        "Concerts accessibles à tous",
        "Actions caritatives",
        "Patrimoine culturel vivant"
      ]
    }
  ];

  const stats = [
    {
      number: "50+",
      label: "Âmes Unies en Chant",
      description: "Choristes consacrés",
      icon: "🎤"
    },
    {
      number: "100+",
      label: "Pièces au Répertoire Sacré",
      description: "Du grégorien au contemporain",
      icon: "📜"
    },
    {
      number: "25+",
      label: "Célébrations Annuelle",
      description: "Liturgies et concerts bénis",
      icon: "🎭"
    },
    {
      number: "20+",
      label: "Ans de Grâce et Fidélité",
      description: "Depuis 2003 par la Grâce de Dieu",
      icon: "⭐"
    },
    {
      number: "15+",
      label: "Sanctuaires Animés",
      description: "Cathédrales et églises sanctifiées",
      icon: "⛪"
    },
    {
      number: "1000+",
      label: "Âmes Touchées par la Grâce",
      description: "Auditeurs transformés",
      icon: "💖"
    }
  ];

  // Animation au scroll
  React.useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in-up');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.observe-me').forEach(el => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section Glorieuse */}
      <section className="relative py-12 md:py-20 lg:py-28 overflow-hidden bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white min-h-screen flex items-center">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/50"></div>
          <div 
            className="absolute inset-0 bg-cover bg-center transform scale-105"
            style={{
              backgroundImage: "url('/images/cast-chorale.jpg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center 30%',
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-purple-900/60"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16 xl:gap-20">
            {/* Content */}
            <div className="lg:w-1/2 text-center lg:text-left space-y-6 md:space-y-8 observe-me">
              <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-4 md:p-6 inline-block border border-white/30 shadow-2xl transform hover:scale-105 transition-all duration-500">
                <span className="text-lg md:text-xl lg:text-2xl font-semibold text-white flex items-center justify-center lg:justify-start">
                  <span className="mr-3 text-2xl md:text-3xl animate-pulse">🌟</span> 
                  C.A.S.T. – Chœur Artistique & Spirituel de Tanà
                </span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold font-serif leading-tight bg-gradient-to-r from-white via-yellow-200 to-yellow-400 bg-clip-text text-transparent animate-float">
                C.A.S.T.
                <span className="text-yellow-300 block mt-4 md:mt-6 text-shadow-glow">Cantoria</span>
              </h1>
              
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 md:p-8 border-l-4 border-yellow-400 transform hover:scale-102 transition-all duration-500">
                <p className="text-xl md:text-2xl lg:text-3xl text-white leading-relaxed font-light italic">
                  « Quand l'art devient prière, la musique touche l'âme »
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center lg:justify-start pt-6">
                <Link 
                  to="/join" 
                  className="group bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-8 md:px-10 lg:px-12 py-4 md:py-5 rounded-2xl font-bold hover:from-yellow-300 hover:to-orange-400 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl flex items-center justify-center text-lg md:text-xl min-w-[240px] relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/20 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  <span className="mr-3 text-xl md:text-2xl">🎤</span>
                  Rejoindre la Chorale
                </Link>
                <Link 
                  to="/events" 
                  className="group border-2 border-white text-white px-8 md:px-10 lg:px-12 py-4 md:py-5 rounded-2xl font-bold hover:bg-white hover:text-purple-900 transition-all duration-300 transform hover:scale-105 flex items-center justify-center text-lg md:text-xl min-w-[240px] backdrop-blur-sm relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/10 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  <span className="mr-3 text-xl md:text-2xl">📅</span>
                  Nos Célébrations
                </Link>
              </div>
            </div>
            
            {/* Image Glorieuse */}
            <div className="lg:w-1/2 mt-8 lg:mt-0 observe-me">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-yellow-400 via-purple-500 to-blue-600 rounded-3xl opacity-60 group-hover:opacity-80 blur-xl transition-all duration-700 animate-pulse-slow"></div>
                <div className="relative rounded-2xl shadow-2xl overflow-hidden transform group-hover:scale-105 transition-transform duration-700">
                  <img 
                    src="/images/cast-chorale.jpg" 
                    alt="C.A.S.T. Cantoria en concert sacré"
                    className="w-full h-72 sm:h-80 md:h-96 lg:h-[500px] object-cover object-center transform group-hover:scale-110 transition-transform duration-1000"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                </div>
                <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-6 py-3 rounded-2xl font-bold shadow-2xl border-2 border-white text-sm md:text-base transform group-hover:scale-110 transition-transform duration-300">
                  <span className="text-xl md:text-2xl mr-2">✨</span>
                  Pour la Gloire de Dieu
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Élément décoratif flottant */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="text-white text-center">
            <div className="text-2xl mb-2">⌄</div>
            <div className="text-sm opacity-70">Découvrez notre histoire sacrée</div>
          </div>
        </div>
      </section>

      {/* Section Naissance d'un Souffle */}
      <section className="py-16 md:py-24 lg:py-32 bg-gradient-to-br from-white to-blue-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-72 h-72 bg-yellow-200 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-20 animate-float-slow"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-200 rounded-full translate-x-1/3 translate-y-1/3 opacity-20 animate-float-slower"></div>
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 md:mb-16 observe-me">
              <div className="inline-flex items-center justify-center bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-8 py-4 rounded-full text-lg md:text-xl font-semibold mb-6 shadow-lg transform hover:scale-105 transition-transform duration-300">
                <span className="mr-3 text-2xl">✨</span>
                Naissance d'un Souffle
              </div>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6 font-serif bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                2003 : L'Année de la Grâce
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center">
              <div className="space-y-6 md:space-y-8 observe-me">
                <div className="prose prose-lg md:prose-xl max-w-none text-gray-700 leading-relaxed">
                  <p className="text-2xl md:text-3xl font-light italic text-purple-700 mb-8 leading-relaxed text-center lg:text-left">
                    "Tout a commencé en 2003."
                  </p>
                  
                  <div className="space-y-6 text-lg md:text-xl">
                    <p className="bg-blue-50 p-6 rounded-2xl border-l-4 border-blue-500 transform hover:scale-102 transition-all duration-300">
                      <strong className="text-blue-700">L'inauguration du groupe C.A.S.T. fut célébrée à l'Espace FENOHASINA Itaosy</strong>, sous les hauts patronages des autorités de la Région.
                    </p>
                    
                    <p className="bg-purple-50 p-6 rounded-2xl border-l-4 border-purple-500 transform hover:scale-102 transition-all duration-300">
                      Ce jour-là, les <strong className="text-purple-700">familles, les proches et les amis sont venus nombreux</strong> — certains de très loin — pour vivre ensemble un moment inoubliable.
                    </p>

                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-2xl border-l-4 border-yellow-500 transform hover:scale-102 transition-all duration-300">
                      <p className="text-yellow-800 font-semibold text-center text-xl">
                        Par la <strong className="text-orange-600">Grâce de Dieu</strong>, ce fut une véritable <strong className="text-orange-600">Renaissance</strong>.
                        <br />
                        Un souffle nouveau s'est levé, mêlant <strong className="text-orange-600">ferveur, beauté et unité</strong>.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative observe-me">
                <div className="bg-gradient-to-br from-yellow-100 to-purple-100 rounded-3xl p-2 shadow-2xl transform hover:scale-105 transition-transform duration-500">
                  <img 
                    src="/images/origines.png" 
                    alt="Inauguration du C.A.S.T. en 2003 - Espace FENOHASINA Itaosy"
                    className="w-full h-80 md:h-96 object-cover rounded-2xl shadow-lg"
                    loading="lazy"
                  />
                </div>
                <div className="absolute -top-4 -right-4 bg-gradient-to-r from-yellow-400 to-red-500 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl border-2 border-white transform rotate-6 animate-pulse-slow">
                  <span className="mr-2">🎉</span>
                  2003
                </div>
                <div className="absolute -bottom-4 -left-4 bg-white/90 backdrop-blur-lg px-6 py-3 rounded-2xl shadow-lg border border-gray-200">
                  <p className="text-sm font-semibold text-gray-700">Espace FENOHASINA Itaosy</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Mission et Vision Sacrée */}
      <section className="py-16 md:py-24 lg:py-32 bg-gradient-to-br from-purple-50 to-blue-100 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-5xl mx-auto text-center">
            <div className="observe-me mb-12">
              <div className="inline-flex items-center justify-center bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-full text-lg md:text-xl font-semibold mb-6 shadow-lg">
                <span className="mr-3 text-2xl">🎵</span>
                Une Voix, Une Famille, Une Mission
              </div>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-8 font-serif">
                Notre <span className="text-transparent bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text">Mission Sacrée</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-16">
              <div className="observe-me bg-white rounded-2xl p-8 shadow-2xl border border-green-200 transform hover:scale-105 transition-all duration-500">
                <div className="text-6xl mb-6 text-green-500">👨‍👩‍👧‍👦</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Famille Œcuménique</h3>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Le C.A.S.T. — Chœur Artistique & Spirituel de Tanà — est né de la convergence de vocations artistiques et spirituelles.
                  Il rassemble des choristes issus de toutes les Églises chrétiennes du FFKM, incarnant une <strong className="text-green-600">unité œcuménique rare et précieuse</strong>.
                </p>
              </div>
              
              <div className="observe-me bg-white rounded-2xl p-8 shadow-2xl border border-blue-200 transform hover:scale-105 transition-all duration-500">
                <div className="text-6xl mb-6 text-blue-500">🎶</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Fidélité à la Vocation</h3>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Depuis ce jour fondateur, C.A.S.T. est resté debout.
                  Fidèle à sa vocation, il s'épanouit et s'étend vers tous les horizons, porté par la <strong className="text-blue-600">foi, la rigueur et l'amour du chant sacré</strong>.
                </p>
              </div>
            </div>

            <div className="observe-me bg-gradient-to-r from-blue-600 to-purple-700 rounded-3xl p-8 md:p-12 text-white shadow-2xl transform hover:scale-102 transition-all duration-500">
              <p className="text-2xl md:text-3xl font-light italic leading-relaxed mb-6">
                "Grâce à vous, à votre présence, à votre engagement, nous sommes fiers de porter le nom de Cantoria."
              </p>
              <p className="text-xl font-semibold text-yellow-200">
                Fiers d'incarner une voix, une lumière, une famille en marche vers l'unité et la beauté partagée.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section Âme du C.A.S.T. */}
      <section className="py-16 md:py-24 lg:py-32 bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-white relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="observe-me mb-12">
              <div className="inline-flex items-center justify-center bg-white/20 backdrop-blur-lg text-white px-8 py-4 rounded-full text-lg md:text-xl font-semibold mb-6 border border-white/30">
                <span className="mr-3 text-2xl">🕊️</span>
                L'Âme du C.A.S.T.
              </div>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-8 font-serif bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
                Ce que vous entendrez aujourd'hui…
              </h2>
            </div>

            <div className="observe-me space-y-8">
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-white/20 transform hover:scale-105 transition-all duration-500">
                <p className="text-2xl md:text-3xl font-light italic leading-relaxed mb-6">
                  "…ce ne sont pas simplement des voix."
                </p>
                <p className="text-xl md:text-2xl text-yellow-200 font-semibold">
                  Ce sont des âmes en prière, des silences qui vibrent, des cœurs en harmonie.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-white/10 transform hover:scale-102 transition-all duration-500">
                <p className="text-xl md:text-2xl font-light leading-relaxed mb-6">
                  Car ici, la musique ne se joue pas — <strong className="text-yellow-300">elle se vit</strong>.
                </p>
                <div className="text-4xl mb-4">✨</div>
                <p className="text-2xl md:text-3xl font-semibold text-yellow-300">
                  Le C.A.S.T. est une offrande, un feu doux, un souffle partagé.
                </p>
              </div>

              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-3xl p-8 md:p-12 transform hover:scale-105 transition-all duration-500 shadow-2xl">
                <p className="text-3xl md:text-4xl font-bold text-gray-900">
                  Soyez les bienvenus.
                </p>
                <p className="text-xl md:text-2xl text-gray-800 mt-4 font-light">
                  Dans cette maison où l'art devient prière et la musique, chemin vers Dieu.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section Bénie */}
      <section className="py-16 md:py-24 lg:py-32 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 via-purple-500 to-blue-600"></div>
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16 observe-me">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6 font-serif">
              Notre <span className="text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">Impact Béni</span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Plus de 20 ans de dévouement à la musique sacrée, par la Grâce de Dieu
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="observe-me text-center group">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-2xl p-6 md:p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-3 relative overflow-hidden h-full flex flex-col justify-center">
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="text-3xl md:text-4xl lg:text-5xl mb-4 group-hover:scale-110 transition-transform duration-300 relative">
                    {stat.icon}
                  </div>
                  <div className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 relative">
                    {stat.number}
                  </div>
                  <div className="font-semibold text-blue-100 text-sm md:text-base mb-2 relative">
                    {stat.label}
                  </div>
                  <div className="text-blue-200 text-xs md:text-sm relative">
                    {stat.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section - Images corrigées sans lettres */}
      <section className="py-16 md:py-24 lg:py-32 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16 observe-me">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6 font-serif">Notre Équipe Sacrée</h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Les visionnaires qui donnent corps et âme à notre mission depuis 2003
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            {teamMembers.map((member, index) => (
              <div key={index} className="group observe-me">
                <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-700 overflow-hidden border border-blue-100 hover:border-blue-200 h-full flex flex-col transform hover:scale-105">
                  {/* Image Container avec meilleur cadrage et sans lettre */}
                  <div className="relative h-72 md:h-80 w-full overflow-hidden">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                      style={{ 
                        objectPosition: member.image.includes('Me.jpg') ? 'center 20%' : 
                                      member.image.includes('raprezy.jpg') ? 'center 25%' : 
                                      'center 30%' 
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    
                    {/* Badge Role - Sans lettre, avec icône */}
                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-lg rounded-xl w-12 h-12 flex items-center justify-center shadow-2xl border border-white/30">
                      <span className="text-lg">👑</span>
                    </div>
                    
                    {/* Role */}
                    <div className="absolute bottom-4 left-4 bg-white/20 backdrop-blur-lg text-white px-4 py-2 rounded-lg border border-white/30">
                      <span className="font-semibold text-sm">{member.role}</span>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6 md:p-8 flex flex-col flex-grow space-y-4">
                    <h3 className="text-2xl font-bold text-gray-900 leading-tight font-serif">
                      {member.name}
                    </h3>
                    
                    <p className="text-gray-700 text-lg leading-relaxed flex-grow">
                      {member.description}
                    </p>
                    
                    {/* Quote */}
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-l-4 border-blue-500 relative transform hover:scale-102 transition-all duration-300">
                      <div className="text-2xl text-blue-300 absolute -top-2 left-3">"</div>
                      <p className="text-blue-800 italic text-lg leading-relaxed relative z-10 pl-4">
                        "{member.quote}"
                      </p>
                    </div>
                    
                    {/* Specialties */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-800 text-xl flex items-center">
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
      <section className="py-16 md:py-24 lg:py-32 bg-gradient-to-br from-purple-50 to-blue-100">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16 observe-me">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6 font-serif">Notre Parcours Sacré</h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              De 2003 à aujourd'hui : 20 ans de croissance et de rayonnement spirituel
            </p>
          </div>

          <div className="max-w-7xl mx-auto">
            <div className="space-y-12 md:space-y-16 lg:space-y-20">
              {milestones.map((milestone, index) => (
                <div key={index} className={`observe-me flex flex-col lg:flex-row items-stretch gap-8 md:gap-12 ${index === 0 ? 'bg-yellow-50 rounded-3xl p-8 border-2 border-yellow-200 transform hover:scale-102 transition-all duration-500' : ''}`}>
                  {/* Year Badge */}
                  <div className="flex justify-center lg:justify-start lg:w-1/4">
                    <div className={`bg-gradient-to-br from-blue-600 to-purple-600 text-white w-24 h-24 md:w-28 md:h-28 rounded-3xl flex items-center justify-center text-2xl md:text-3xl font-bold shadow-2xl border-4 border-white transform hover:scale-110 transition-transform duration-300 ${index === 0 ? 'from-yellow-500 to-orange-500 scale-110' : ''}`}>
                      {milestone.year}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="lg:w-3/4">
                    <div className={`rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 p-8 md:p-10 border-l-4 h-full transform hover:scale-102 ${index === 0 ? 'bg-white border-yellow-500' : 'bg-white border-blue-500'}`}>
                      <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 font-serif">
                        {milestone.title}
                      </h3>
                      
                      <p className="text-gray-700 mb-8 text-lg md:text-xl leading-relaxed">
                        {milestone.description}
                      </p>
                      
                      {/* Image pour mobile */}
                      <div className="mb-8 lg:hidden">
                        <div className="relative">
                          <img 
                            src={milestone.image} 
                            alt={milestone.title}
                            className="w-full h-64 object-cover rounded-2xl shadow-lg border-4 border-white transform hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                            style={{ objectPosition: 'center 30%' }}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        {milestone.achievements.map((achievement, idx) => (
                          <div key={idx} className="flex items-center text-gray-600 text-lg">
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
                        className="w-full h-64 md:h-72 lg:h-80 object-cover rounded-2xl shadow-lg border-4 border-white transform hover:scale-105 transition-transform duration-500"
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

      {/* Values Section */}
      <section className="py-16 md:py-24 lg:py-32 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16 observe-me">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6 font-serif">Nos Valeurs Sacrées</h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Les principes qui animent chaque note et unissent chaque cœur depuis 2003
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            {values.map((value, index) => (
              <div key={index} className="observe-me bg-white rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 p-8 md:p-10 group border border-blue-100 hover:border-blue-200 transform hover:scale-105">
                <div className="flex flex-col sm:flex-row items-start space-y-6 sm:space-y-0 sm:space-x-6 md:space-x-8">
                  <div className="text-5xl sm:text-6xl md:text-7xl group-hover:scale-110 transition-transform duration-500 flex-shrink-0">
                    {value.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 font-serif">
                      {value.title}
                    </h3>
                    <p className="text-lg md:text-xl text-gray-700 mb-8 leading-relaxed">
                      {value.description}
                    </p>
                    
                    <div className="space-y-4">
                      {value.details.map((detail, idx) => (
                        <div key={idx} className="flex items-start text-gray-600 group/item">
                          <span className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mr-4 mt-2 flex-shrink-0 group-hover/item:scale-125 transition-transform"></span>
                          <span className="text-lg md:text-xl leading-relaxed font-medium">
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

      {/* CTA Final Glorieux */}
      <section className="py-16 md:py-24 lg:py-32 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 text-center relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="observe-me bg-gradient-to-br from-white/10 to-purple-500/20 backdrop-blur-2xl rounded-3xl p-8 md:p-16 lg:p-20 shadow-2xl border border-white/20 transform hover:scale-102 transition-all duration-500">
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-8 font-serif leading-tight">
                Votre Voix a une <span className="text-transparent bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text">Mission Divine</span>
              </h2>
              
              <p className="text-xl md:text-2xl lg:text-3xl text-blue-100 mb-12 leading-relaxed max-w-4xl mx-auto">
                Rejoignez une communauté où l'art devient prière, où chaque chant est une offrande à la Gloire de Dieu.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 md:gap-8 justify-center items-center">
                <Link 
                  to="/join"
                  className="group bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-10 md:px-12 lg:px-16 py-5 md:py-6 rounded-2xl font-bold hover:from-yellow-300 hover:to-orange-400 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl flex items-center justify-center text-lg md:text-xl lg:text-2xl min-w-[280px] relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/30 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  <span className="mr-3 text-2xl">🎤</span>
                  Rejoindre la Chorale Sacrée
                </Link>
                
                <Link 
                  to="/spiritualite"
                  className="group border-2 border-white text-white px-10 md:px-12 lg:px-16 py-5 md:py-6 rounded-2xl font-bold hover:bg-white hover:text-purple-900 transition-all duration-300 transform hover:scale-105 flex items-center justify-center text-lg md:text-xl lg:text-2xl min-w-[280px] backdrop-blur-sm relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/20 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  <span className="mr-3 text-2xl">🕊️</span>
                  Découvrir Notre Spiritualité
                </Link>
              </div>

              <div className="mt-12 pt-8 border-t border-white/20">
                <p className="text-lg md:text-xl text-yellow-200 italic">
                  "Que tout ce que vous faites : paroles ou actions, tout soit fait au nom du Seigneur Jésus, en rendant par lui grâces à Dieu le Père." 
                  <br /><strong className="text-white">- Colossiens 3:17</strong>
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
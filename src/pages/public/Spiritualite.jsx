import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Spiritualite = () => {
  const [activeTestimony, setActiveTestimony] = useState(0);

  const spiritualPillars = [
    {
      icon: "🙏",
      title: "Prière Communautaire",
      description: "Nos répétitions commencent et se terminent par un temps de prière partagé, créant un espace sacré où la musique devient méditation.",
      longDescription: "Chaque session débute par l'invocation de l'Esprit Saint et se clôture par une action de grâce. Ces moments de recueillement unissent nos voix et nos cœurs dans une même intention spirituelle.",
      image: "/images/inspiration/inspiration1.jpg",
      verse: "« Là où deux ou trois sont réunis en mon nom, je suis au milieu d'eux. » - Matthieu 18:20",
      practices: ["Prière d'ouverture", "Chant des psaumes", "Moment de silence", "Action de grâce"]
    },
    {
      icon: "🎵",
      title: "Musique Sacrée",
      description: "Le chant comme moyen d'élévation spirituelle et de louange, pont entre le terrestre et le divin.",
      longDescription: "Nous explorons le riche répertoire de la musique sacrée, du grégorien aux polyphonies contemporaines, considérant chaque note comme une offrande et chaque mélodie comme une prière.",
      image: "/images/inspiration/inspiration2.jpg",
      verse: "« Chantez à Dieu de tout votre cœur. » - Colossiens 3:16",
      practices: ["Chant grégorien", "Polyphonie sacrée", "Musique liturgique", "Improvisation spirituelle"]
    },
    {
      icon: "👥",
      title: "Fraternité",
      description: "Une communauté unie dans la foi et le partage musical, où chaque voix trouve sa place.",
      longDescription: "Au-delà des notes, C.A.S.T. est une famille spirituelle. Nous cheminons ensemble, portant les joies et les épreuves de chacun, vivant concrètement la charité fraternelle.",
      image: "/images/inspiration/inspiration3.jpg",
      verse: "« Aimez-vous les uns les autres comme je vous ai aimés. » - Jean 13:34",
      practices: ["Partage fraternel", "Accueil des nouveaux", "Soutien mutuel", "Célébrations communes"]
    },
    {
      icon: "🌟",
      title: "Témoignage",
      description: "Porter la joie de l'Évangile à travers nos concerts, être des instruments de paix et de beauté.",
      longDescription: "Nos concerts sont des occasions de témoigner de la foi par la beauté. Nous croyons que la musique sacrée peut toucher les cœurs et ouvrir des chemins vers Dieu.",
      image: "/images/inspiration/inspiration.JPG",
      verse: "« Que votre lumière brille devant les hommes. » - Matthieu 5:16",
      practices: ["Concerts caritatifs", "Témoignages personnels", "Rencontres avec le public", "Actions sociales"]
    }
  ];

  const spiritualEvents = [
    {
      title: "Retraite Spirituelle Annuelle",
      date: "15-17 Mars 2024",
      location: "Monastère d'Ambatomanga",
      description: "Week-end de recueillement, prière et chant grégorien dans le silence monastique.",
      fullDescription: "Immersion totale dans la vie monastique avec offices liturgiques, temps de silence, enseignement sur la musique sacrée et répétitions dans la chapelle historique.",
      image: "/images/gallery/galerie7.jpg",
      schedule: ["Vendredi : Installation et Vêpres", "Samedi : Offices et ateliers", "Dimanche : Messe et partage"],
      participants: "25 places disponibles",
      price: "Participation libre"
    },
    {
      title: "Chemin de Croix Musical",
      date: "29 Mars 2024 - 15h00",
      location: "Colline Sacrée d'Ambohimanga",
      description: "Méditation des stations du chemin de croix en musique, procession chantée.",
      fullDescription: "Parcours spirituel sur la colline historique, chaque station méditée avec un chant approprié. Moment fort du Carême pour préparer Pâques.",
      image: "/images/gallery/galerie8.jpg",
      schedule: ["Accueil et introduction", "Procession des 14 stations", "Chant final et envoi"],
      participants: "Ouvert à tous",
      price: "Gratuit"
    },
    {
      title: "Veillée Pascale Musicale",
      date: "30 Mars 2024 - 20h00",
      location: "Chapelle Saint-Augustin",
      description: "Célébration de la Résurrection à travers les plus beaux chants pascaux.",
      fullDescription: "De la liturgie de la lumière au chant de l'Alléluia, participation active à la plus grande fête chrétienne par la musique sacrée.",
      image: "/images/concert1.jpg",
      schedule: ["Liturgie de la lumière", "Liturgie de la Parole", "Liturgie baptismale", "Liturgie eucharistique"],
      participants: "Chorale et assemblée",
      price: "Offrande libre"
    }
  ];

  const saintsPatrons = [
    {
      name: "Sainte Cécile",
      role: "Patronne des musiciens",
      feast: "22 Novembre",
      description: "Nous nous plaçons sous sa protection pour que notre chant soit toujours une prière.",
      image: "/images/saints/cecile.jpg",
      prayer: "Sainte Cécile, apprenez-nous à unir nos voix dans une seule louange pour la plus grande gloire de Dieu."
    },
    {
      name: "Saint Augustin",
      role: "Docteur de l'Église",
      feast: "28 Août",
      description: "Il disait 'Qui chante prie deux fois', inspirant notre démarche spirituelle.",
      image: "/images/saints/augustin.jpg",
      prayer: "Saint Augustin, guidez-nous pour que notre musique soit une véritable prière du cœur."
    },
    {
      name: "Saint Grégoire",
      role: "Père du chant grégorien",
      feast: "3 Septembre",
      description: "Il a organisé le chant liturgique, héritage que nous cherchons à perpétuer.",
      image: "/images/saints/gregoire.jpg",
      prayer: "Saint Grégoire, enseignez-nous la beauté et la profondeur du chant sacré."
    }
  ];

  const detailedTestimonies = [
    {
      name: "Marie, Soprano",
      role: "Membre depuis 5 ans",
      avatar: "😇",
      testimony: "Chanter à C.A.S.T. m'a permis de redécouvrir ma foi à travers la beauté de la musique sacrée. Chaque répétition est un véritable temps de ressourcement spirituel.",
      story: "Ancienne choriste paroissiale, j'ai trouvé à C.A.S.T. une profondeur spirituelle qui dépasse la simple pratique musicale. La prière communautaire avant chaque répétition crée une atmosphère unique de recueillement."
    },
    {
      name: "Jean, Ténor",
      role: "Chef de pupitre",
      avatar: "✨",
      testimony: "Nos concerts ne sont pas que des prestations, ce sont de véritables moments de grâce partagés avec le public. Je sens souvent une présence particulière.",
      story: "Ingénieur de formation, C.A.S.T. est mon oasis spirituel. La qualité musicale associée à la ferveur de la prière transforme complètement l'expérience du chant."
    },
    {
      name: "Sophie, Alto",
      role: "Membre fondatrice",
      avatar: "🕊️",
      testimony: "La prière communautaire avant chaque répétition crée une unité spirituelle unique. Nous ne sommes plus des individus qui chantent, mais un seul corps qui prie.",
      story: "Cela fait 8 ans que je chemine avec C.A.S.T. J'ai vu des vies transformées par la puissance de la musique sacrée. Des personnes sont revenues à la foi grâce à la beauté de nos chants."
    },
    {
      name: "Pierre, Basse",
      role: "Nouveau membre",
      avatar: "🎵",
      testimony: "Arrivé il y a 6 mois, j'ai été touché par l'accueil et la dimension spirituelle authentique. On ne fait pas que chanter, on prie ensemble.",
      story: "Venant d'une chorale profane, j'ai découvert à C.A.S.T. une dimension insoupçonnée du chant. La technique vocale est au service de l'expression de la foi."
    }
  ];

  const spiritualResources = [
    {
      title: "Répertoire de Carême",
      type: "Partitions",
      description: "Collection de chants pour le temps du Carême",
      link: "/repertoire/careme",
      icon: "📜"
    },
    {
      title: "Prière du Chanteur",
      type: "Texte spirituel",
      description: "Prière à dire avant chaque répétition ou concert",
      link: "/resources/priere",
      icon: "📖"
    },
    {
      title: "Enseignements Audio",
      type: "Podcast",
      description: "Réflexions sur la musique sacrée et la spiritualité",
      link: "/resources/podcasts",
      icon: "🎧"
    },
    {
      title: "Calendrier Liturgique",
      type: "Guide",
      description: "Adaptation du répertoire au temps liturgique",
      link: "/resources/calendrier",
      icon: "📅"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 pt-20">
      {/* Hero Section Améliorée */}
      <section className="relative py-24 overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{ backgroundImage: "url('/images/cathedrale majestueu.png')" }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center bg-white/10 backdrop-blur rounded-full px-6 py-2 mb-6">
              <span className="text-lg mr-2">🕊️</span>
              <span className="font-semibold">Spiritualité & Foi</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 font-serif leading-tight">
              Quand la Musique <span className="text-yellow-300">Rencontre</span> la Foi
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 leading-relaxed max-w-3xl mx-auto">
              "La musique est la prière du cœur qui s'élève vers le Ciel, 
              un langage universel qui touche l'âme et ouvre les portes du divin."
            </p>
            
            <p className="text-lg text-blue-200 italic mb-8">
              - C.A.S.T. Cantoria
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                to="/about" 
                className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-xl font-bold hover:bg-yellow-300 transition transform hover:scale-105 shadow-lg flex items-center"
              >
                <span className="mr-2">🎯</span>
                Notre Mission Spirituelle
              </Link>
              <Link 
                to="/events" 
                className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold hover:bg-white hover:text-purple-900 transition transform hover:scale-105 flex items-center"
              >
                <span className="mr-2">📅</span>
                Événements Spirituels
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Piliers Spirituels Enrichis */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-serif">Nos Piliers Spirituels</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              La dimension spirituelle au cœur de notre vocation musicale
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {spiritualPillars.map((pillar, index) => (
              <div key={index} className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-2/5 relative">
                    <img 
                      src={pillar.image} 
                      alt={pillar.title}
                      className="w-full h-64 md:h-full object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur rounded-full w-12 h-12 flex items-center justify-center text-2xl">
                      {pillar.icon}
                    </div>
                  </div>
                  
                  <div className="md:w-3/5 p-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{pillar.title}</h3>
                    <p className="text-gray-700 mb-4 leading-relaxed">{pillar.longDescription}</p>
                    
                    <div className="bg-blue-50 rounded-lg p-4 mb-4">
                      <p className="text-blue-800 italic text-sm">{pillar.verse}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-800 text-sm">Pratiques :</h4>
                      <div className="flex flex-wrap gap-2">
                        {pillar.practices.map((practice, idx) => (
                          <span key={idx} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs">
                            {practice}
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

      {/* Saints Patrons */}
      <section className="py-20 bg-gradient-to-r from-purple-50 to-blue-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-serif">Nos Saints Patrons</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Nous marchons sur les pas de ceux qui ont uni musique et spiritualité
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {saintsPatrons.map((saint, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all">
                <div className="h-48 bg-gradient-to-br from-purple-400 to-blue-500 relative">
                  <div className="absolute inset-0 flex items-center justify-center text-6xl text-white">
                    {saint.image ? '🖼️' : '👼'}
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-gray-900">{saint.name}</h3>
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                      {saint.feast}
                    </span>
                  </div>
                  
                  <p className="text-blue-600 font-semibold text-sm mb-2">{saint.role}</p>
                  <p className="text-gray-600 mb-4 text-sm">{saint.description}</p>
                  
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-gray-700 italic text-xs">{saint.prayer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Citation Inspirante Améliorée */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-6xl mb-6">🎵</div>
            <blockquote className="text-2xl md:text-3xl italic mb-8 leading-relaxed">
              "Qui chante prie deux fois. À C.A.S.T., nous croyons que la beauté de la musique sacrée 
              est une fenêtre ouverte sur le divin, un chemin qui élève l'âme et unit les cœurs 
              dans une même louange du Créateur."
            </blockquote>
            <div className="flex items-center justify-center space-x-4">
              <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-lg">
                ✞
              </div>
              <div>
                <p className="text-xl font-semibold">Père Lucien</p>
                <p className="text-blue-200">Aumônier de C.A.S.T.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Événements Spirituels Détaillés */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-serif">Événements Spirituels</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Des moments privilégiés pour approfondir notre foi à travers la musique
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {spiritualEvents.map((event, index) => (
              <div key={index} className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 group">
                <div className="relative overflow-hidden">
                  <img 
                    src={event.image} 
                    alt={event.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Spiritualité
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{event.title}</h3>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-gray-600">
                      <span className="mr-3 text-lg">📅</span>
                      <span className="font-medium">{event.date}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <span className="mr-3 text-lg">📍</span>
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <span className="mr-3 text-lg">👥</span>
                      <span className="text-sm">{event.participants}</span>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4 leading-relaxed">{event.fullDescription}</p>

                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Déroulement :</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {event.schedule.map((item, idx) => (
                        <li key={idx} className="flex items-center">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <span className="text-green-600 font-semibold">{event.price}</span>
                    <Link 
                      to="/contact"
                      className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 px-6 rounded-lg hover:from-purple-700 hover:to-blue-700 transition font-semibold"
                    >
                      S'inscrire
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Témoignages Interactifs */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-serif">Témoignages Vivants</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Découvrez comment la musique sacrée transforme des vies
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Témoignage Principal */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <div className="flex items-start space-x-6">
                <div className="text-6xl">{detailedTestimonies[activeTestimony].avatar}</div>
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        {detailedTestimonies[activeTestimony].name}
                      </h3>
                      <p className="text-blue-600 font-semibold">
                        {detailedTestimonies[activeTestimony].role}
                      </p>
                    </div>
                  </div>
                  
                  <blockquote className="text-xl text-gray-700 italic mb-4 leading-relaxed">
                    "{detailedTestimonies[activeTestimony].testimony}"
                  </blockquote>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {detailedTestimonies[activeTestimony].story}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation des témoignages */}
            <div className="flex justify-center space-x-4">
              {detailedTestimonies.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimony(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    activeTestimony === index 
                      ? 'bg-blue-600 scale-125' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>

            {/* Mini-témoignages */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
              {detailedTestimonies.map((testimony, index) => (
                <div 
                  key={index}
                  className={`bg-white rounded-xl p-6 shadow-lg cursor-pointer transition-all hover:shadow-xl ${
                    activeTestimony === index ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setActiveTestimony(index)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl">{testimony.avatar}</div>
                    <div>
                      <h4 className="font-bold text-gray-900">{testimony.name}</h4>
                      <p className="text-sm text-gray-600">{testimony.role}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 mt-3 text-sm line-clamp-2">
                    "{testimony.testimony}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Ressources Spirituelles */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-serif">Ressources Spirituelles</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Outils et contenus pour approfondir votre cheminement
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {spiritualResources.map((resource, index) => (
              <Link
                key={index}
                to={resource.link}
                className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group border border-blue-100"
              >
                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {resource.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{resource.title}</h3>
                <p className="text-blue-600 text-sm font-semibold mb-2">{resource.type}</p>
                <p className="text-gray-600 text-sm">{resource.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-r from-indigo-900 via-purple-900 to-blue-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 font-serif">
              Votre Voix a une <span className="text-yellow-300">Mission Spirituelle</span>
            </h2>
            <p className="text-xl mb-8 text-blue-100 leading-relaxed">
              Rejoignez une communauté où la musique devient prière, 
              où chaque chant est une offrande, où votre talent sert une cause divine.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/join"
                className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-xl font-bold hover:bg-yellow-300 transition transform hover:scale-105 shadow-lg flex items-center justify-center"
              >
                <span className="mr-2">🎵</span>
                Rejoindre C.A.S.T.
              </Link>
              <Link 
                to="/contact"
                className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold hover:bg-white hover:text-purple-900 transition transform hover:scale-105 flex items-center justify-center"
              >
                <span className="mr-2">💬</span>
                Échanger avec nous
              </Link>
            </div>
            
            <div className="mt-8 text-blue-200">
              <p className="text-sm">
                ✨ Une audition musicale et un entretien spirituel vous attendent
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Spiritualite;
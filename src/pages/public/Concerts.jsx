import React from 'react';
import { Link } from 'react-router-dom';

const Concerts = () => {
  const upcomingEvents = [
    {
      id: 1,
      title: "Concert de Printemps",
      date: "15 Avril 2024",
      time: "18:00",
      location: "Cathédrale d'Andohalo",
      description: "Célébration musicale du printemps avec un répertoire de renaissance et baroque",
      image: "/images/concert1.jpg",
      price: "Entrée libre",
      status: "À venir"
    },
    {
      id: 2,
      title: "Festival de Musique Sacrée",
      date: "25 Mai 2024",
      time: "20:00",
      location: "Église Saint-Joseph",
      description: "Participation au festival annuel de musique sacrée de Tana",
      image: "/images/gallery/galerie2.jpg",
      price: "20.000 Ar",
      status: "À venir"
    },
    {
      id: 3,
      title: "Concert Bénéfice",
      date: "10 Juin 2024",
      time: "17:30",
      location: "Jardin d'Antanimena",
      description: "Concert au profit des œuvres caritatives locales",
      image: "/images/gallery/galerie4.jpg",
      price: "Entrée libre - Don volontaire",
      status: "À venir"
    }
  ];

  const pastEvents = [
    {
      id: 4,
      title: "Concert de Noël 2023",
      date: "24 Décembre 2023",
      location: "Cathédrale d'Andohalo",
      description: "Célébration traditionnelle de Noël",
      image: "/images/gallery/galerie1.jpg",
      highlights: ["Full audience", "Media coverage", "Special guests"]
    },
    {
      id: 5,
      title: "Concert d'Automne",
      date: "15 Octobre 2023",
      location: "Chapelle Saint-Michel",
      description: "Concert intime de musique sacrée",
      image: "/images/chorale-3.jpg",
      highlights: ["Acoustic perfection", "New repertoire", "Artist collaboration"]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-900 to-blue-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6 font-serif">Concerts & Événements</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-green-100">
            Vivez l'expérience unique des concerts C.A.S.T. - où la musique sacrée prend vie
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/join" 
              className="bg-white text-green-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Rejoindre un Concert
            </Link>
            <Link 
              to="/repertoire" 
              className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-900 transition"
            >
              Découvrir le Répertoire
            </Link>
          </div>
        </div>
      </section>

      {/* Événements à Venir */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Événements à Venir</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ne manquez pas nos prochaines prestations. Réservez vos places dès maintenant !
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {upcomingEvents.map(event => (
              <div key={event.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="relative">
                  <img 
                    src={event.image} 
                    alt={event.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {event.status}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{event.title}</h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {event.date} • {event.time}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {event.location}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                      {event.price}
                    </div>
                  </div>
                  <p className="text-gray-600 mb-6">{event.description}</p>
                  <div className="flex space-x-3">
                    <Link 
                      to="/contact" 
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition font-semibold text-center"
                    >
                      Réserver
                    </Link>
                    <Link 
                      to={`/events/${event.id}`}
                      className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:border-green-600 hover:text-green-600 transition font-semibold text-center"
                    >
                      Plus d'infos
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Événements Passés */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Événements Passés</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Revivez les moments forts de nos précédents concerts
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {pastEvents.map(event => (
              <div key={event.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-2/5">
                    <img 
                      src={event.image} 
                      alt={event.title}
                      className="w-full h-48 md:h-full object-cover"
                    />
                  </div>
                  <div className="md:w-3/5 p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{event.title}</h3>
                    <div className="flex items-center text-gray-600 mb-3">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {event.date}
                    </div>
                    <div className="flex items-center text-gray-600 mb-4">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      {event.location}
                    </div>
                    <p className="text-gray-600 mb-4">{event.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {event.highlights.map((highlight, index) => (
                        <span key={index} className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">
                          {highlight}
                        </span>
                      ))}
                    </div>
                    <Link 
                      to="/gallery" 
                      className="text-green-600 hover:text-green-700 font-semibold inline-flex items-center"
                    >
                      Voir les photos
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Restez Informés</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-blue-100">
            Inscrivez-vous à notre newsletter pour ne manquer aucun concert et recevoir nos actualités
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input 
              type="email" 
              placeholder="Votre email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
              S'inscrire
            </button>
          </div>
          <p className="text-sm mt-4 text-blue-200">
            📧 Nous ne partagerons jamais votre email. Désinscription à tout moment.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Concerts;
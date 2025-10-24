import React from 'react';
import { Link } from 'react-router-dom';
import './Events.css';

const Events = () => {
  // Données des événements (remplacez par vos vraies données)
  const upcomingEvents = [
    {
      id: 1,
      title: "Concert de Noël",
      date: "24 Décembre 2024",
      time: "20:00",
      location: "Cathédrale d'Andohalo",
      description: "Célébration musicale de la Nativité avec des œuvres sacrées classiques et malgaches.",
      image: "/images/concert-noel.jpg"
    },
    {
      id: 2,
      title: "Messe œcuménique",
      date: "15 Janvier 2025",
      time: "10:00", 
      location: "Paroisse Internationale Andohalo",
      description: "Participation à la messe œcuménique du FFKM avec notre répertoire sacré.",
      image: "/images/messe-oecumenique.jpg"
    }
  ];

  const pastEvents = [
    {
      id: 3,
      title: "Concert d'Automne",
      date: "15 Novembre 2024",
      location: "Église catholique de Faravohitra",
      description: "Programme incluant des œuvres de Mozart, Haydn et des compositions malgaches."
    },
    {
      id: 4,
      title: "Festival de Musique Sacrée",
      date: "20 Octobre 2024",
      location: "Saint Michel Itaosy",
      description: "Participation au festival annuel de musique sacrée de Madagascar."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12">
      <div className="container mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-4">
            Événements du C.A.S.T. Cantoria
          </h1>
          <p className="text-xl text-green-600">
            Calendrier des concerts et activités du chœur
          </p>
        </div>

        {/* Événements à venir */}
        <section className="mb-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-green-700 mb-8 text-center">
              🎵 Événements à Venir
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="h-48 bg-green-200 flex items-center justify-center">
                    <span className="text-4xl">🎻</span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-green-800 mb-3">
                      {event.title}
                    </h3>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-green-600">
                        <span className="mr-2">📅</span>
                        {event.date} à {event.time}
                      </div>
                      <div className="flex items-center text-green-600">
                        <span className="mr-2">📍</span>
                        {event.location}
                      </div>
                    </div>
                    <p className="text-green-700 mb-4">
                      {event.description}
                    </p>
                    <Link 
                      to="/contact"
                      className="block w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-center"
                    >
                      Réserver maintenant
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {upcomingEvents.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎵</div>
                <h3 className="text-2xl font-bold text-green-800 mb-4">
                  Programme en préparation
                </h3>
                <p className="text-lg text-green-600">
                  Notre calendrier d'événements sera bientôt disponible. 
                  Restez connectés pour ne rien manquer de nos prochains concerts.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Types d'événements */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-green-700 mb-8 text-center">
              Nos types d'événements
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-green-800 mb-3">
                  🎻 Concerts sacrés
                </h3>
                <p className="text-green-600">
                  Œuvres classiques et compositions malgaches
                </p>
              </div>
              
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-green-800 mb-3">
                  🙏 Offices liturgiques
                </h3>
                <p className="text-green-600">
                  Participation aux célébrations religieuses
                </p>
              </div>
              
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-green-800 mb-3">
                  🎓 Masterclasses
                </h3>
                <p className="text-green-600">
                  Ateliers et formations vocales
                </p>
              </div>
              
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-green-800 mb-3">
                  🌍 Événements œcuméniques
                </h3>
                <p className="text-green-600">
                  Rencontres inter-confessionnelles
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Événements passés */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-green-700 mb-8 text-center">
              Événements Passés
            </h2>
            
            <div className="space-y-6">
              {pastEvents.map((event) => (
                <div key={event.id} className="bg-white p-6 rounded-lg shadow-lg">
                  <h3 className="text-lg font-semibold text-green-800 mb-2">
                    {event.title}
                  </h3>
                  <div className="flex flex-wrap gap-4 text-green-600 mb-3">
                    <span className="flex items-center">
                      📅 {event.date}
                    </span>
                    <span className="flex items-center">
                      📍 {event.location}
                    </span>
                  </div>
                  <p className="text-green-700">
                    {event.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Réservation */}
        <section>
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-green-800 text-white p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">
                Informations et réservations
              </h3>
              
              <div className="flex flex-col sm:flex-row justify-center gap-6 mb-6">
                <div className="bg-green-700 p-4 rounded-lg">
                  <div className="text-lg font-semibold">📞 Téléphone</div>
                  <div className="text-xl">+261 34 11 361 57</div>
                </div>
                
                <div className="bg-green-700 p-4 rounded-lg">
                  <div className="text-lg font-semibold">📱 WhatsApp</div>
                  <div className="text-xl">+261 32 91 828 83</div>
                </div>
              </div>
              
              <p className="text-lg mb-6">
                Pour toute information sur nos événements ou pour réserver pour nos concerts
              </p>
              <Link 
                to="/contact"
                className="inline-block bg-white text-green-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Nous Contacter
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Events;
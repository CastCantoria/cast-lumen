import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';

const EventList = () => {  // ⬅️ CHANGER ICI : Concerts → EventList
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    name: '',
    email: '',
    phone: '',
    seats: 1,
    message: ''
  });
  const { currentUser } = useAuth();

  // Filtres disponibles
  const filters = [
    { id: 'all', label: 'Tous les Événements' },
    { id: 'upcoming', label: 'À Venir' },
    { id: 'past', label: 'Terminés' },
    { id: 'free', label: 'Entrée Libre' },
    { id: 'premium', label: 'Concerts Premium' },
    { id: 'festival', label: 'Festivals' }
  ];

  // Fonction pour déterminer le statut basé sur la date
  const getEventStatus = (eventDate, eventTime) => {
    const now = new Date();
    const eventDateTime = new Date(`${eventDate}T${eventTime}`);
    
    // Si la date est passée
    if (eventDateTime < now) {
      return 'past';
    }
    
    // Si c'est aujourd'hui mais l'heure est passée
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const eventDateOnly = new Date(eventDate);
    eventDateOnly.setHours(0, 0, 0, 0);
    
    if (eventDateOnly.getTime() === today.getTime() && eventDateTime < now) {
      return 'past';
    }
    
    return 'upcoming';
  };

  // Fonction pour déterminer l'état de l'événement
  const getEventState = (event) => {
    const status = getEventStatus(event.date, event.time);
    const now = new Date();
    const eventDateTime = new Date(`${event.date}T${event.time}`);
    const timeDiff = eventDateTime - now;
    const hoursDiff = timeDiff / (1000 * 60 * 60);

    if (status === 'past') {
      return { status: 'past', label: 'Terminé', color: 'gray', badgeColor: 'bg-gray-500' };
    }

    if (hoursDiff < 24) {
      return { status: 'upcoming', label: 'Bientôt !', color: 'orange', badgeColor: 'bg-orange-500' };
    }

    if (hoursDiff < 168) { // 7 jours
      return { status: 'upcoming', label: 'Cette semaine', color: 'green', badgeColor: 'bg-green-500' };
    }

    return { status: 'upcoming', label: 'À Venir', color: 'blue', badgeColor: 'bg-blue-500' };
  };

  // Chargement des événements depuis Firestore
  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      try {
        const eventsQuery = query(
          collection(db, 'events'),
          orderBy('date', 'asc')
        );

        // Abonnement en temps réel
        const unsubscribe = onSnapshot(eventsQuery, (querySnapshot) => {
          const eventsData = querySnapshot.docs.map(doc => {
            const data = doc.data();
            
            // Calculer le statut dynamiquement
            const status = getEventStatus(data.date, data.time);
            
            return {
              id: doc.id,
              ...data,
              status: status,
              // Assurer la compatibilité avec les données existantes
              availableSeats: data.availableSeats || data.seats || 0,
              seats: data.seats || 100,
              price: data.price || 0,
              priceLabel: data.priceLabel || (data.price === 0 ? 'Entrée libre' : `${data.price} Ar`),
              category: data.category || 'premium'
            };
          });

          setEvents(eventsData);
          setLoading(false);
        });

        // Nettoyer l'abonnement
        return () => unsubscribe();
      } catch (error) {
        console.error('Erreur chargement événements:', error);
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  // Filtrage des événements
  const filteredEvents = events.filter(event => {
    const matchesFilter = activeFilter === 'all' || 
                         (activeFilter === 'upcoming' && event.status === 'upcoming') ||
                         (activeFilter === 'past' && event.status === 'past') ||
                         (activeFilter === 'free' && event.price === 0) ||
                         (activeFilter === 'premium' && event.category === 'premium') ||
                         (activeFilter === 'festival' && event.category === 'festival');
    
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const upcomingEvents = filteredEvents.filter(event => event.status === 'upcoming');
  const pastEvents = filteredEvents.filter(event => event.status === 'past');

  const handleBooking = (event) => {
    if (!currentUser && event.price > 0) {
      alert('Veuillez vous connecter pour réserver des places payantes');
      return;
    }
    
    const eventState = getEventState(event);
    if (eventState.status === 'past') {
      alert('Cet événement est déjà terminé. Les réservations ne sont plus disponibles.');
      return;
    }

    setSelectedEvent(event);
    setShowBookingModal(true);
    setBookingForm({
      name: currentUser?.displayName || '',
      email: currentUser?.email || '',
      phone: '',
      seats: 1,
      message: ''
    });
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    
    // Vérifier que l'événement est toujours à venir
    const eventState = getEventState(selectedEvent);
    if (eventState.status === 'past') {
      alert('Cet événement est déjà terminé. Les réservations ne sont plus disponibles.');
      setShowBookingModal(false);
      return;
    }

    // Ici, intégration avec le système de réservation Firestore
    try {
      // Simuler l'enregistrement de la réservation
      alert(`Réservation envoyée pour ${bookingForm.seats} place(s) à "${selectedEvent.title}"`);
      setShowBookingModal(false);
    } catch (error) {
      console.error('Erreur réservation:', error);
      alert('Erreur lors de la réservation. Veuillez réessayer.');
    }
  };

  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  const getDaysUntilEvent = (dateString, timeString) => {
    const eventDateTime = new Date(`${dateString}T${timeString}`);
    const today = new Date();
    const diffTime = eventDateTime - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const EventCard = ({ event, type = 'upcoming' }) => {
    const eventState = getEventState(event);
    const daysUntil = getDaysUntilEvent(event.date, event.time);

    return (
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 group">
        <div className="relative">
          <img 
            src={event.image} 
            alt={event.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.src = '/images/concert-default.jpg';
            }}
          />
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <div className={`px-3 py-1 rounded-full text-sm font-semibold text-white ${eventState.badgeColor}`}>
              {eventState.label}
            </div>
            {event.price === 0 && eventState.status === 'upcoming' && (
              <div className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                🎁 Entrée Libre
              </div>
            )}
            {eventState.status === 'past' && (
              <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                ⏱️ Terminé
              </div>
            )}
          </div>
          {eventState.status === 'upcoming' && event.availableSeats > 0 && (
            <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
              📍 {event.availableSeats} places restantes
            </div>
          )}
          {eventState.status === 'upcoming' && event.availableSeats === 0 && (
            <div className="absolute bottom-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm">
              🎫 Complet
            </div>
          )}
        </div>
        
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-green-600 transition-colors">
            {event.title}
          </h3>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-gray-600">
              <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formatDate(event.date)} • {event.time}
              {eventState.status === 'upcoming' && daysUntil >= 0 && (
                <span className="ml-2 text-orange-600 font-semibold">
                  (Dans {daysUntil} jour{daysUntil > 1 ? 's' : ''})
                </span>
              )}
            </div>
            
            <div className="flex items-center text-gray-600">
              <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {event.location}
            </div>
            
            <div className="flex items-center text-gray-600">
              <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              {event.priceLabel}
            </div>
          </div>

          <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>

          {event.highlights && eventState.status === 'upcoming' && (
            <div className="flex flex-wrap gap-1 mb-4">
              {event.highlights.slice(0, 3).map((highlight, index) => (
                <span key={index} className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs">
                  {highlight}
                </span>
              ))}
            </div>
          )}

          <div className="flex space-x-3">
            {eventState.status === 'upcoming' ? (
              <>
                <button 
                  onClick={() => handleBooking(event)}
                  disabled={event.availableSeats === 0}
                  className={`flex-1 py-2 px-4 rounded-lg font-semibold text-center transition ${
                    event.availableSeats === 0
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {event.availableSeats === 0 
                    ? 'Complet' 
                    : event.price > 0 ? 'Réserver' : 'S\'inscrire'
                  }
                </button>
                <button 
                  onClick={() => setSelectedEvent(event)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:border-green-600 hover:text-green-600 transition font-semibold text-center"
                >
                  Détails
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/gallery" 
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition font-semibold text-center"
                >
                  Voir les Photos
                </Link>
                <button 
                  onClick={() => setSelectedEvent(event)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:border-blue-600 hover:text-blue-600 transition font-semibold text-center"
                >
                  Bilan
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  const EventDetailModal = ({ event, onClose }) => {
    const eventState = getEventState(event);
    const daysUntil = getDaysUntilEvent(event.date, event.time);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-auto">
          <div className="p-8">
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold text-white ${eventState.badgeColor}`}>
                    {eventState.label}
                  </span>
                  {event.price === 0 && eventState.status === 'upcoming' && (
                    <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      🎁 Entrée Libre
                    </span>
                  )}
                  {eventState.status === 'past' && (
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      ⏱️ Terminé
                    </span>
                  )}
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{event.title}</h1>
              </div>
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors ml-4"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <img 
              src={event.image} 
              alt={event.title}
              className="w-full h-64 object-cover rounded-2xl mb-6"
              onError={(e) => {
                e.target.src = '/images/concert-default.jpg';
              }}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">📋 Informations Pratiques</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <strong>Date :</strong> {formatDate(event.date)}
                    </div>
                    <div>
                      <strong>Heure :</strong> {event.time} - {event.endTime}
                    </div>
                    <div>
                      <strong>Lieu :</strong> {event.location}
                    </div>
                    <div>
                      <strong>Adresse :</strong> {event.address}
                    </div>
                    <div>
                      <strong>Durée :</strong> {event.duration}
                    </div>
                    <div>
                      <strong>Tenue :</strong> {event.dressCode}
                    </div>
                    {event.ageLimit && (
                      <div>
                        <strong>Public :</strong> {event.ageLimit}
                      </div>
                    )}
                    {eventState.status === 'upcoming' && (
                      <div>
                        <strong>Places :</strong> {event.availableSeats} / {event.seats} disponibles
                      </div>
                    )}
                  </div>
                </div>

                {event.program && (
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">🎵 Programme</h2>
                    <ul className="space-y-2">
                      {event.program.map((piece, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-green-500 mr-2">•</span>
                          {piece}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {event.performers && (
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">👥 Interprètes</h2>
                    <ul className="space-y-2">
                      {event.performers.map((performer, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          {performer}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">📖 Description</h2>
                  <p className="text-gray-700 leading-relaxed">{event.longDescription || event.description}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className={`border rounded-2xl p-6 ${
                  eventState.status === 'upcoming' 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <h3 className="font-bold mb-3 ${
                    eventState.status === 'upcoming' ? 'text-green-800' : 'text-gray-800'
                  }">
                    {eventState.status === 'upcoming' ? '🎟️ Réservation' : '📊 Bilan'}
                  </h3>
                  <div className={`text-2xl font-bold mb-4 ${
                    eventState.status === 'upcoming' ? 'text-green-600' : 'text-gray-600'
                  }`}>
                    {event.priceLabel}
                  </div>
                  {eventState.status === 'upcoming' ? (
                    <>
                      <div className="text-sm text-green-700 mb-4">
                        {event.availableSeats > 0 
                          ? `${event.availableSeats} places disponibles` 
                          : 'Complet'
                        }
                      </div>
                      {event.availableSeats > 0 && (
                        <button 
                          onClick={() => handleBooking(event)}
                          className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
                        >
                          {event.price > 0 ? 'Réserver maintenant' : 'Confirmer ma présence'}
                        </button>
                      )}
                    </>
                  ) : (
                    <div className="text-sm text-gray-600">
                      Cet événement s'est déroulé le {formatDate(event.date)}
                    </div>
                  )}
                </div>

                {event.highlights && (
                  <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                    <h3 className="font-bold text-blue-800 mb-3">
                      {eventState.status === 'upcoming' ? '✨ Points Forts' : '🎯 Points Marquants'}
                    </h3>
                    <ul className="space-y-2">
                      {event.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-center text-blue-700">
                          <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {eventState.status === 'past' && event.testimonials && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
                    <h3 className="font-bold text-yellow-800 mb-3">💬 Témoignages</h3>
                    <div className="space-y-4">
                      {event.testimonials.map((testimonial, index) => (
                        <div key={index} className="text-yellow-700">
                          <div className="flex items-center mb-1">
                            <span className="font-semibold">{testimonial.name}</span>
                            <div className="ml-2 flex text-yellow-500">
                              {'★'.repeat(testimonial.rating)}
                            </div>
                          </div>
                          <p className="text-sm italic">"{testimonial.comment}"</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const BookingModal = ({ event, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Réservation</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">{event.title}</h3>
            <p className="text-gray-600 text-sm">{formatDate(event.date)} à {event.time}</p>
            <p className="text-gray-600 text-sm">{event.location}</p>
            <p className="text-green-600 font-semibold mt-2">{event.priceLabel}</p>
          </div>

          <form onSubmit={handleBookingSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Nom complet *</label>
              <input
                type="text"
                required
                value={bookingForm.name}
                onChange={(e) => setBookingForm({...bookingForm, name: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Email *</label>
              <input
                type="email"
                required
                value={bookingForm.email}
                onChange={(e) => setBookingForm({...bookingForm, email: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Téléphone</label>
              <input
                type="tel"
                value={bookingForm.phone}
                onChange={(e) => setBookingForm({...bookingForm, phone: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {event.price > 0 && (
              <div>
                <label className="block text-gray-700 font-medium mb-2">Nombre de places *</label>
                <select
                  value={bookingForm.seats}
                  onChange={(e) => setBookingForm({...bookingForm, seats: parseInt(e.target.value)})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {[...Array(Math.min(10, event.availableSeats))].map((_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1} place{i + 1 > 1 ? 's' : ''}</option>
                  ))}
                </select>
                <p className="text-sm text-gray-500 mt-1">
                  Total: {event.price * bookingForm.seats} Ar
                </p>
              </div>
            )}

            <div>
              <label className="block text-gray-700 font-medium mb-2">Message (optionnel)</label>
              <textarea
                rows="3"
                value={bookingForm.message}
                onChange={(e) => setBookingForm({...bookingForm, message: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                placeholder="Demandes particulières, allergies..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              {event.price > 0 ? 'Confirmer la réservation' : 'Confirmer ma présence'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des événements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-900 via-blue-900 to-purple-900 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 text-center relative">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 font-serif">Calendrier des Événements</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-green-100 leading-relaxed">
            Découvrez tous les événements de C.A.S.T. Cantoria - Concerts, répétitions, ateliers et bien plus encore
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/join" 
              className="bg-white text-green-900 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition transform hover:scale-105 shadow-lg"
            >
              🎵 Rejoindre un Événement
            </Link>
            <Link 
              to="/concerts" 
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold hover:bg-white hover:text-green-900 transition transform hover:scale-105"
            >
              📅 Voir les Concerts
            </Link>
          </div>
        </div>
      </section>

      {/* Barre de recherche et filtres */}
      <section className="py-8 bg-white/80 backdrop-blur-sm sticky top-20 z-30 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Barre de recherche */}
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <input
                  type="text"
                  placeholder="🔍 Rechercher un événement, un lieu, une date..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-6 py-4 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white shadow-sm"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Filtres */}
            <div className="flex flex-wrap gap-2">
              {filters.map(filter => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-4 py-2 rounded-full font-medium transition-all ${
                    activeFilter === filter.id
                      ? 'bg-green-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Événements à Venir */}
      {upcomingEvents.length > 0 && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Événements à Venir</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Ne manquez pas nos prochaines activités. Réservez vos places dès maintenant !
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {upcomingEvents.map(event => (
                <EventCard key={event.id} event={event} type="upcoming" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Événements Terminés */}
      {pastEvents.length > 0 && (
        <section className="py-20 bg-gray-100">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Événements Terminés</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Revivez les moments forts de nos précédents événements
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {pastEvents.map(event => (
                <EventCard key={event.id} event={event} type="past" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Aucun résultat */}
      {filteredEvents.length === 0 && !loading && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Aucun événement trouvé</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm 
                ? `Aucun résultat pour "${searchTerm}"` 
                : `Aucun événement dans la catégorie "${filters.find(f => f.id === activeFilter)?.label}"`
              }
            </p>
            <button
              onClick={() => {
                setActiveFilter('all');
                setSearchTerm('');
              }}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
            >
              Voir tous les événements
            </button>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-green-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Restez Informés</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-blue-100">
            Inscrivez-vous à notre newsletter pour ne manquer aucun événement et recevoir nos actualités
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

      {/* Modals */}
      {selectedEvent && (
        <EventDetailModal 
          event={selectedEvent} 
          onClose={() => setSelectedEvent(null)} 
        />
      )}

      {showBookingModal && selectedEvent && (
        <BookingModal 
          event={selectedEvent}
          onClose={() => setShowBookingModal(false)}
        />
      )}
    </div>
  );
};

export default EventList; // ⬅️ CORRESPOND AU NOM DU COMPOSANT
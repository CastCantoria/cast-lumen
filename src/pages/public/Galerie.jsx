import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Galerie = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);

  const galleryCategories = [
    { id: 'all', name: 'Toutes', icon: '🖼️' },
    { id: 'concerts', name: 'Concerts', icon: '🎵' },
    { id: 'repetitions', name: 'Répétitions', icon: '🎶' },
    { id: 'evenements', name: 'Événements', icon: '🎭' },
    { id: 'portraits', name: 'Portraits', icon: '👤' }
  ];

  const galleryItems = [
    {
      id: 1,
      category: 'concerts',
      image: '/images/concert1.jpg',
      title: 'Concert de Noël 2023',
      description: 'Célébration de Noël à la Cathédrale',
      date: '24 Décembre 2023'
    },
    {
      id: 2,
      category: 'repetitions',
      image: '/images/chorale-1.jpg',
      title: 'Répétition Hebdomadaire',
      description: 'Session de travail sur le nouveau répertoire',
      date: '15 Janvier 2024'
    },
    {
      id: 3,
      category: 'evenements',
      image: '/images/gallery/galerie1.jpg',
      title: 'Rencontre Annuelle',
      description: 'Rassemblement des membres de C.A.S.T.',
      date: '10 Février 2024'
    },
    {
      id: 4,
      category: 'portraits',
      image: '/images/portrait.jpg',
      title: 'Portrait - Chef de Chœur',
      description: 'Notre directeur artistique en action',
      date: '5 Mars 2024'
    },
    {
      id: 5,
      category: 'concerts',
      image: '/images/gallery/galerie2.jpg',
      title: 'Concert de Pâques',
      description: 'Célébration musicale de Pâques',
      date: '1 Avril 2024'
    },
    {
      id: 6,
      category: 'repetitions',
      image: '/images/chorale-2.jpg',
      title: 'Préparation Concert',
      description: 'Dernières répétitions avant le grand concert',
      date: '20 Mars 2024'
    },
    {
      id: 7,
      category: 'evenements',
      image: '/images/gallery/galerie3.jpg',
      title: 'Atelier Vocal',
      description: 'Masterclass de technique vocale',
      date: '15 Février 2024'
    },
    {
      id: 8,
      category: 'portraits',
      image: '/images/pcast01.jpg',
      title: 'Portrait - Soprano',
      description: 'Membre de la section soprano',
      date: '8 Janvier 2024'
    },
    {
      id: 9,
      category: 'concerts',
      image: '/images/gallery/galerie4.jpg',
      title: 'Concert Bénéfice',
      description: 'Au profit des œuvres caritatives',
      date: '12 Mai 2024'
    }
  ];

  const filteredItems = activeCategory === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeCategory);

  const openModal = (item) => {
    setSelectedImage(item);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-900 to-blue-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6 font-serif">Galerie C.A.S.T.</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-purple-100">
            Découvrez les moments forts de notre chorale à travers nos photos et vidéos
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/events" 
              className="bg-white text-purple-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Voir nos Concerts
            </Link>
            <Link 
              to="/join" 
              className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-900 transition"
            >
              Nous Rejoindre
            </Link>
          </div>
        </div>
      </section>

      {/* Filtres */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Explorez Notre Univers</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Parcourez nos différentes catégories pour découvrir tous les aspects de la vie à C.A.S.T.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {galleryCategories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center px-6 py-3 rounded-full font-semibold transition-all ${
                  activeCategory === category.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <span className="mr-2 text-lg">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>

          {/* Grille de Photos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map(item => (
              <div 
                key={item.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group"
                onClick={() => openModal(item)}
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                      <div className="bg-white text-blue-600 px-4 py-2 rounded-full font-semibold">
                        👁️ Voir
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 mb-3">{item.description}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>📅 {item.date}</span>
                    <span className="capitalize bg-blue-100 text-blue-600 px-2 py-1 rounded">
                      {item.category}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📷</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Aucune photo dans cette catégorie</h3>
              <p className="text-gray-600">D'autres contenus seront bientôt ajoutés.</p>
            </div>
          )}
        </div>
      </section>

      {/* Section Vidéos */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Nos Vidéos</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Revivez nos prestations en vidéo et découvrez l'ambiance de nos concerts
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="relative pb-[56.25%] h-0">
                <img 
                  src="/images/gallery/galerie5.jpg" 
                  alt="Extrait vidéo concert"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <button className="bg-red-600 text-white rounded-full w-16 h-16 flex items-center justify-center hover:bg-red-700 transition transform hover:scale-110">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </button>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Concert de Noël 2023</h3>
                <p className="text-gray-600 mb-4">Extrait de notre célébration de Noël à la Cathédrale</p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>🎵 15 min</span>
                  <span>📅 24 Déc 2023</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="relative pb-[56.25%] h-0">
                <img 
                  src="/images/gallery/galerie6.jpg" 
                  alt="Documentaire C.A.S.T."
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <button className="bg-red-600 text-white rounded-full w-16 h-16 flex items-center justify-center hover:bg-red-700 transition transform hover:scale-110">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </button>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Documentaire C.A.S.T.</h3>
                <p className="text-gray-600 mb-4">Portrait de notre chorale et de sa mission</p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>🎬 25 min</span>
                  <span>📅 15 Jan 2024</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link 
              to="/videos" 
              className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition inline-flex items-center"
            >
              <span>Voir toutes nos vidéos</span>
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Vous Avez Assisté à Nos Concerts ?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-blue-100">
            Partagez vos photos et vidéos avec nous en utilisant le hashtag #CASTCantoria
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/contact"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Partager Mes Photos
            </Link>
            <Link 
              to="/events"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition"
            >
              Prochains Événements
            </Link>
          </div>
        </div>
      </section>

      {/* Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="relative">
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:bg-gray-100 transition z-10"
              >
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <img 
                src={selectedImage.image} 
                alt={selectedImage.title}
                className="w-full h-auto max-h-[60vh] object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedImage.title}</h3>
              <p className="text-gray-600 mb-4 text-lg">{selectedImage.description}</p>
              <div className="flex justify-between items-center text-gray-500">
                <span>📅 {selectedImage.date}</span>
                <span className="capitalize bg-blue-100 text-blue-600 px-3 py-1 rounded-full">
                  {selectedImage.category}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Galerie;
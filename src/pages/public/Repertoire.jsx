import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Repertoire = () => {
  const [activeEra, setActiveEra] = useState('all');
  const [selectedPiece, setSelectedPiece] = useState(null);

  const eras = [
    { id: 'all', name: 'Tout le Répertoire', icon: '🎵' },
    { id: 'renaissance', name: 'Renaissance', icon: '🕌' },
    { id: 'baroque', name: 'Baroque', icon: '🎻' },
    { id: 'classique', name: 'Classique', icon: '🎹' },
    { id: 'romantique', name: 'Romantique', icon: '💖' },
    { id: 'contemporain', name: 'Contemporain', icon: '🌟' }
  ];

  const repertoire = [
    {
      id: 1,
      title: "Ave Maria",
      composer: "Franz Schubert",
      era: "romantique",
      duration: "4:30",
      difficulty: "Moyen",
      description: "L'une des pièces les plus célèbres de Schubert, d'une beauté intemporelle",
      image: "/images/partition-sacree.jpg",
      audio: "/audio/cantique-1.mp3"
    },
    {
      id: 2,
      title: "Gloria",
      composer: "Antonio Vivaldi",
      era: "baroque",
      duration: "25:00",
      difficulty: "Difficile",
      description: "Extrait glorieux du célèbre compositeur vénitien",
      image: "/images/chorale-4.jpg",
      audio: "/audio/intro-cast.mp3"
    },
    {
      id: 3,
      title: "Messe en Si Mineur",
      composer: "Johann Sebastian Bach",
      era: "baroque",
      duration: "120:00",
      difficulty: "Très difficile",
      description: "Chef-d'œuvre absolu de la musique sacrée",
      image: "/images/chorale-5.jpg"
    },
    {
      id: 4,
      title: "Cantique de Jean Racine",
      composer: "Gabriel Fauré",
      era: "romantique",
      duration: "5:15",
      difficulty: "Moyen",
      description: "Pièce délicate et émouvante composée à 19 ans",
      image: "/images/gallery/galerie7.jpg"
    },
    {
      id: 5,
      title: "Ave Verum Corpus",
      composer: "Wolfgang Amadeus Mozart",
      era: "classique",
      duration: "3:45",
      difficulty: "Facile",
      description: "Motet d'une pureté et simplicité remarquables",
      image: "/images/gallery/galerie8.jpg"
    },
    {
      id: 6,
      title: "O Magnum Mysterium",
      composer: "Tomas Luis de Victoria",
      era: "renaissance",
      duration: "4:20",
      difficulty: "Moyen",
      description: "Chef-d'œuvre de la polyphonie Renaissance",
      image: "/images/inspiration/inspiration1.jpg"
    }
  ];

  const filteredRepertoire = activeEra === 'all' 
    ? repertoire 
    : repertoire.filter(piece => piece.era === activeEra);

  const playAudio = (piece) => {
    if (piece.audio) {
      setSelectedPiece(piece);
      // Simulation de lecture audio
      console.log('Lecture de:', piece.title);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6 font-serif">Notre Répertoire</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-indigo-100">
            Découvrez la richesse de notre répertoire musical, de la Renaissance à nos jours
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/events" 
              className="bg-white text-indigo-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Écouter en Concert
            </Link>
            <Link 
              to="/join" 
              className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-indigo-900 transition"
            >
              Chanter Avec Nous
            </Link>
          </div>
        </div>
      </section>

      {/* Filtres par Époque */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Explorez par Époque</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Parcourez notre collection organisée par périodes musicales
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
            {eras.map(era => (
              <button
                key={era.id}
                onClick={() => setActiveEra(era.id)}
                className={`flex flex-col items-center p-4 rounded-2xl transition-all ${
                  activeEra === era.id
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="text-2xl mb-2">{era.icon}</span>
                <span className="text-sm font-semibold text-center">{era.name}</span>
              </button>
            ))}
          </div>

          {/* Grille des Pièces */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRepertoire.map(piece => (
              <div key={piece.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="relative">
                  <img 
                    src={piece.image} 
                    alt={piece.title}
                    className="w-full h-48 object-cover"
                  />
                  {piece.audio && (
                    <button
                      onClick={() => playAudio(piece)}
                      className="absolute bottom-4 right-4 bg-white bg-opacity-90 rounded-full w-12 h-12 flex items-center justify-center hover:bg-opacity-100 transition shadow-lg"
                    >
                      <svg className="w-6 h-6 text-indigo-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </button>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{piece.title}</h3>
                  <p className="text-indigo-600 font-semibold mb-3">{piece.composer}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div className="text-center bg-gray-50 rounded-lg p-2">
                      <div className="text-gray-500">Durée</div>
                      <div className="font-semibold">{piece.duration}</div>
                    </div>
                    <div className="text-center bg-gray-50 rounded-lg p-2">
                      <div className="text-gray-500">Difficulté</div>
                      <div className={`font-semibold ${
                        piece.difficulty === 'Facile' ? 'text-green-600' :
                        piece.difficulty === 'Moyen' ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {piece.difficulty}
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4">{piece.description}</p>
                  
                  <div className="flex justify-between items-center">
                    <span className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-sm capitalize">
                      {piece.era}
                    </span>
                    <Link 
                      to="/gallery"
                      className="text-indigo-600 hover:text-indigo-700 font-semibold text-sm"
                    >
                      Partition →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredRepertoire.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎼</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Aucune pièce dans cette période</h3>
              <p className="text-gray-600">D'autres œuvres seront bientôt ajoutées à notre répertoire.</p>
            </div>
          )}
        </div>
      </section>

      {/* Section Statistiques */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600 mb-2">{repertoire.length}+</div>
              <div className="text-gray-700 font-semibold">Pièces au Répertoire</div>
              <p className="text-gray-600 text-sm mt-2">De la Renaissance au Contemporain</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600 mb-2">15+</div>
              <div className="text-gray-700 font-semibold">Compositeurs</div>
              <p className="text-gray-600 text-sm mt-2">Des plus grands noms de la musique sacrée</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600 mb-2">6</div>
              <div className="text-gray-700 font-semibold">Périodes Musicales</div>
              <p className="text-gray-600 text-sm mt-2">Couverture complète de l'histoire musicale</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Envie de Chanter Ce Répertoire ?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-purple-100">
            Rejoignez C.A.S.T. et participez à l'interprétation de ces chefs-d'œuvre
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/join"
              className="bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Postuler Maintenant
            </Link>
            <Link 
              to="/contact"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition"
            >
              Nous Contacter
            </Link>
          </div>
        </div>
      </section>

      {/* Modal Audio */}
      {selectedPiece && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">{selectedPiece.title}</h3>
              <button
                onClick={() => setSelectedPiece(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-gray-600 mb-4">{selectedPiece.composer}</p>
            <div className="bg-gray-100 rounded-lg p-4 text-center">
              <div className="text-4xl mb-4">🎵</div>
              <p className="text-gray-600">Extrait audio de {selectedPiece.title}</p>
              <p className="text-sm text-gray-500 mt-2">Fonctionnalité en développement</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Repertoire;
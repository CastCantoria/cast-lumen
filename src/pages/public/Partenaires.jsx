import React from 'react';
import { Link } from 'react-router-dom';

const Partenaires = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12">
      <div className="container mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-4">
            Partenaires du C.A.S.T. Cantoria
          </h1>
          <p className="text-xl text-green-600">
            Le rayonnement du chœur s'appuie sur un réseau solide et engagé
          </p>
        </div>

        {/* Médias Partenaires */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-green-700 mb-8 text-center">
              Médias partenaires
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                <h3 className="text-xl font-semibold text-green-800 mb-3">
                  📺 TV Plus Madagascar
                </h3>
                <p className="text-green-600">Diffusion télévisuelle</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                <h3 className="text-xl font-semibold text-green-800 mb-3">
                  📻 Radio Don Bosco
                </h3>
                <p className="text-green-600">Radio éducative et culturelle</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                <h3 className="text-xl font-semibold text-green-800 mb-3">
                  🔊 Radio Fahazavana
                </h3>
                <p className="text-green-600">Radio spirituelle</p>
              </div>
            </div>
          </div>
        </section>

        {/* Collaborations Artistiques */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-green-700 mb-8 text-center">
              Collaborations artistiques
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-green-800 mb-2">
                  Maestro Casimir R.
                </h3>
                <p className="text-green-600">Direction orchestrale</p>
              </div>
              
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-green-800 mb-2">
                  Quatuor Squad
                </h3>
                <p className="text-green-600">Accompagnement instrumental</p>
              </div>
              
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-green-800 mb-2">
                  Musicien classiques
                </h3>
                <p className="text-green-600">Solistes et instrumentistes</p>
              </div>
              
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-green-800 mb-2">
                  Artisans du son et visuel
                </h3>
                <p className="text-green-600">Technique et production</p>
              </div>
            </div>
          </div>
        </section>

        {/* Devenir Partenaire */}
        <section>
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-green-800 text-white p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">
                📞 Devenir partenaire
              </h3>
              <p className="text-xl mb-4">
                +261 34 11 361 57 (Yas)
              </p>
              <p className="text-lg mb-6">
                Rejoignez notre réseau de partenaires et soutenez la musique sacrée à Madagascar
              </p>
              <Link 
                to="/contact"
                className="inline-block bg-white text-green-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Devenir Partenaire
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Partenaires;
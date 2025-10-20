import React from 'react';

const Galerie = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12">
      <div className="container mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-4">
            Galerie du C.A.S.T. Cantoria
          </h1>
          <p className="text-xl text-green-600">
            Les images et vidéos illustrant la vie du chœur
          </p>
        </div>

        {/* Introduction */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <p className="text-lg">
                Les images et vidéos illustrant la vie du <strong>C.A.S.T. - Chœur Artistique & Spirituel de Tanà</strong> 
                sont autant de témoins visuels de la ferveur et du soin apporté à chaque moment sacré.
              </p>
            </div>
          </div>
        </section>

        {/* Catégories de médias */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-green-700 mb-8 text-center">
              Nos collections
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Albums événements */}
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold text-green-800 mb-3">
                  🎵 Albums classés par événement
                </h3>
                <p className="text-green-600">
                  Concerts, répétitions, rencontres, préparatifs
                </p>
              </div>
              
              {/* Captures vidéo */}
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold text-green-800 mb-3">
                  🎥 Captures vidéo
                </h3>
                <p className="text-green-600">
                  Performances en direct, coulisses, interviews, reportages
                </p>
              </div>
              
              {/* Portraits */}
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold text-green-800 mb-3">
                  👤 Portraits
                </h3>
                <p className="text-green-600">
                  Les choristes, chefs, musiciens et partenaires
                </p>
              </div>
              
              {/* Visuels */}
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold text-green-800 mb-3">
                  🎨 Visuels
                </h3>
                <p className="text-green-600">
                  Affiches, graphismes liturgiques, illustrations artistiques
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Message galerie */}
        <section>
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-green-800 text-white p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">
                Mémoire visuelle
              </h3>
              <p className="text-lg italic">
                "Chaque photo ou chaque vidéo murmure une histoire de foi, de partage, de vocation."
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Galerie;
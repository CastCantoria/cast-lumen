import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12">
      <div className="container mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-4">
            À propos du C.A.S.T.
          </h1>
          <h2 className="text-2xl md:text-3xl text-green-600">
            Chœur Artistique & Spirituel de Tanà
          </h2>
        </div>

        {/* Notre Histoire */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold text-green-700 mb-8 text-center">
              Notre Histoire
            </h3>
            
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <p className="text-lg mb-6">
                Depuis sa création en 2003, le <strong>C.A.S.T. - Chœur Artistique & Spirituel de Tanà</strong> 
                incarne une mission de service et de spiritualité, œuvrant à faire entendre la voix de l'âme 
                malgache dans un dialogue entre tradition et modernité.
              </p>
              
              <p className="text-lg">
                Chaque étape de son cheminement est marquée par la foi, la rigueur, et la quête de beauté.
              </p>
            </div>
          </div>
        </section>

        {/* Direction */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold text-green-700 mb-8 text-center">
              👑 Direction Fondatrice
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h4 className="text-xl font-semibold text-green-800 mb-2">
                  Son Excellence Liva ANDRIAMANALINARIVO
                </h4>
                <p className="text-green-600">Président fondateur</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h4 className="text-xl font-semibold text-green-800 mb-2">
                  Maître Éric RASAMIMANANA
                </h4>
                <p className="text-green-600">Directeur artistique</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h4 className="text-xl font-semibold text-green-800 mb-2">
                  Jules RANDRIAMANANTSOA
                </h4>
                <p className="text-green-600">Chef de pupitre & Gestion membres</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h4 className="text-xl font-semibold text-green-800 mb-2">
                  Tovoniaina RAHENDRISON
                </h4>
                <p className="text-green-600">Support technique</p>
              </div>
            </div>
          </div>
        </section>

        {/* Vision */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold text-green-700 mb-8 text-center">
              Vision du projet
            </h3>
            
            <div className="bg-green-800 text-white p-8 rounded-lg text-center">
              <p className="text-xl italic">
                Le <strong>C.A.S.T. Cantoria</strong> aspire à devenir une cathédrale vivante, 
                où chaque voix, chaque note, chaque silence participe à la révélation du divin 
                dans l'art vocal, tout en affirmant l'identité culturelle malgache.
              </p>
            </div>
          </div>
        </section>

        {/* In Memoriam */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold text-green-700 mb-8 text-center">
              🎗️ In Memoriam
            </h3>
            
            <div className="bg-gray-100 p-8 rounded-lg">
              <h4 className="text-2xl font-semibold text-center mb-4">
                Monsieur Lucien Emmanuel RANDRIANARIVELO (†)
              </h4>
              <p className="text-lg text-center italic mb-4">
                « Le murmure d'un homme devenu souffle éternel »
              </p>
              
              <p className="text-lg mb-4">
                À l'image d'un orfèvre du sacré, il a patiemment transcrit les partitions complexes 
                en grilles solfa accessibles, offrant à chaque choriste le don de compréhension. 
                Il a offert une âme malgache aux chefs-d'œuvre classiques, traduisant leurs paroles 
                avec délicatesse, fidélité et spiritualité.
              </p>
              
              <blockquote className="text-center text-green-700 italic">
                « Misaotra anao, Raiamandreny. Ianao no nandika sy nandray ny feon'ny lanitra ho tenin'ny tanindrazana. »
              </blockquote>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section>
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-green-800 mb-4">
                📞 Contact direction
              </h3>
              <p className="text-xl text-green-600">
                +261 34 11 361 57 (Yas)
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default About;
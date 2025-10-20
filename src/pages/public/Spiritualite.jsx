import React from 'react';

const Spiritualite = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12">
      <div className="container mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-4">
            Spiritualité & Témoignages
          </h1>
          <h2 className="text-2xl md:text-3xl text-green-600">
            C.A.S.T. Cantoria - Quand la foi devient vibration
          </h2>
        </div>

        {/* Introduction */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <blockquote className="text-xl italic text-green-700 mb-6">
                "Chanter dans le C.A.S.T. Cantoria, ce n'est pas interpréter de la musique, 
                c'est habiter une prière. Chaque répétition, chaque concert est une rencontre 
                où l'art devient chemin vers le divin."
              </blockquote>
              
              <p className="text-lg">
                L'expérience du <strong>C.A.S.T. - Chœur Artistique & Spirituel de Tanà</strong> 
                dépasse la dimension artistique pour toucher le cœur même de la foi.
              </p>
            </div>
          </div>
        </section>

        {/* Contenu Spirituel */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-green-700 mb-8 text-center">
              Méditations et réflexions
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Méditations */}
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-2xl font-semibold text-green-800 mb-4">
                  📖 Méditations
                </h3>
                <p className="text-green-700">
                  Réflexions sur les textes chantés, psaumes, évangiles, passages bibliques inspirants
                </p>
              </div>
              
              {/* Témoignages */}
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-2xl font-semibold text-green-800 mb-4">
                  💬 Témoignages
                </h3>
                <p className="text-green-700">
                  Récits de membres immergés dans la vie spirituelle, avancées intérieures, 
                  rencontres avec la foi
                </p>
              </div>
              
              {/* Prières */}
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-2xl font-semibold text-green-800 mb-4">
                  🙏 Prières et versets
                </h3>
                <p className="text-green-700">
                  Textes liturgiques et inspirants, partagés pour nourrir l'âme
                </p>
              </div>
              
              {/* Billets */}
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-2xl font-semibold text-green-800 mb-4">
                  ✍️ Billets spirituels
                </h3>
                <p className="text-green-700">
                  Pensées, méditations, réflexions rédigées par les fondateurs et membres du chœur
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section Inspiration */}
        <section>
          <div className="max-w-4xl mx-auto">
            <div className="bg-green-800 text-white p-8 rounded-lg text-center">
              <h3 className="text-2xl font-bold mb-4">
                L'Art comme Prière
              </h3>
              <p className="text-lg italic">
                "Dans le silence qui suit la dernière note, dans l'harmonie qui unit les voix, 
                nous découvrons que la musique est bien plus qu'un art - elle est la langue 
                de l'âme qui cherche le divin."
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Spiritualite;
import React from 'react';

const Concerts = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12">
      <div className="container mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-4">
            Concerts du C.A.S.T. Cantoria
          </h1>
        </div>

        {/* Introduction */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <p className="text-lg text-center mb-6">
                Les concerts du <strong>C.A.S.T. - Chœur Artistique & Spirituel de Tanà</strong> 
                ne sont pas simplement des prestations musicales, mais de véritables moments 
                d'offrande et de méditation.
              </p>
              
              <p className="text-lg text-center">
                Chaque prestation s'inscrit dans un cadre sacré, qu'il s'agisse de cathédrales 
                majestueuses ou d'églises plus modestes.
              </p>
            </div>
          </div>
        </section>

        {/* Lieux de Prédilection */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-green-700 mb-8 text-center">
              Nos lieux de prédilection
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold text-green-800 mb-3">
                  Cathédrale d'Andohalo
                </h3>
                <p className="text-green-600">
                  La rosace accueille les voix comme une couronne céleste
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold text-green-800 mb-3">
                  Paroisse Internationale Andohalo
                </h3>
                <p className="text-green-600">
                  Écrin acoustique exceptionnel
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold text-green-800 mb-3">
                  Église catholique de Faravohitra
                </h3>
                <p className="text-green-600">
                  Voûtes transformées en tambours spirituels
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold text-green-800 mb-3">
                  Saint Michel Itaosy
                </h3>
                <p className="text-green-600">
                  Sanctuaire de recueillement
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Prochain Concert */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-green-700 mb-8 text-center">
              🎵 Prochain concert du C.A.S.T. Cantoria
            </h2>
            
            <div className="bg-green-800 text-white p-8 rounded-lg text-center">
              <div className="text-2xl font-bold mb-4">
                Informations à venir...
              </div>
              <p className="text-lg mb-6">
                Restez connectés pour découvrir notre prochain événement musical et spirituel.
              </p>
            </div>
          </div>
        </section>

        {/* Réservation */}
        <section>
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white p-8 rounded-lg shadow-lg border-2 border-green-200">
              <h3 className="text-2xl font-bold text-green-800 mb-4">
                Pour réserver ou informations :
              </h3>
              
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <div className="bg-green-100 p-4 rounded-lg">
                  <div className="text-lg font-semibold text-green-800">📞 Téléphone</div>
                  <div className="text-xl text-green-600">+261 34 11 361 57 (Yas)</div>
                </div>
                
                <div className="bg-green-100 p-4 rounded-lg">
                  <div className="text-lg font-semibold text-green-800">📱 WhatsApp</div>
                  <div className="text-xl text-green-600">+261 32 91 828 83 (Orange)</div>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Concerts;
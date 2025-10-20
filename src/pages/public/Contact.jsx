import React from 'react';

const Contact = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12">
      <div className="container mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-4">
            Contactez le C.A.S.T. Cantoria
          </h1>
          <h2 className="text-2xl md:text-3xl text-green-600">
            Rejoindre notre mission
          </h2>
        </div>

        {/* Coordonnées Officielles */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-green-700 mb-8 text-center">
              Coordonnées officielles
            </h2>
            
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-4xl mb-4">📧</div>
                  <h3 className="text-xl font-semibold text-green-800 mb-2">Email</h3>
                  <p className="text-green-600">castcantoria@gmail.com</p>
                </div>
                
                <div className="text-center">
                  <div className="text-4xl mb-4">📞</div>
                  <h3 className="text-xl font-semibold text-green-800 mb-2">Téléphone</h3>
                  <p className="text-green-600">+261 34 11 361 57 (Mobile Yas)</p>
                </div>
                
                <div className="text-center">
                  <div className="text-4xl mb-4">📱</div>
                  <h3 className="text-xl font-semibold text-green-800 mb-2">WhatsApp</h3>
                  <p className="text-green-600">+261 32 91 828 83 (Mobile Orange)</p>
                </div>
                
                <div className="text-center">
                  <div className="text-4xl mb-4">🌐</div>
                  <h3 className="text-xl font-semibold text-green-800 mb-2">Site Web</h3>
                  <p className="text-green-600">cast-lumen.vercel.app</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contacts par Spécialité */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-green-700 mb-8 text-center">
              Contacts par spécialité
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-green-800 mb-2">
                  Pour l'administration
                </h3>
                <p className="text-green-600">ad-castcantoria@outlook.fr</p>
              </div>
              
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-green-800 mb-2">
                  Pour la direction artistique
                </h3>
                <p className="text-green-600">eric.rasamimanana@gmail.com</p>
              </div>
              
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-green-800 mb-2">
                  Pour la media et press
                </h3>
                <p className="text-green-600">zoelsonrandrianindrina@gmail.com</p>
              </div>
              
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-green-800 mb-2">
                  Pour la coordination technique
                </h3>
                <p className="text-green-600">tena.solution@gmail.com</p>
              </div>
            </div>
          </div>
        </section>

        {/* Relations Internationales */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-green-700 mb-8 text-center">
              Relations internationales
            </h2>
            
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="grid gap-4">
                <div>
                  <h3 className="font-semibold text-green-800">Liva ANDRIAMANALINARIVO</h3>
                  <p className="text-green-600">livaramanalinarivo16@gmail.com</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-green-800">Contacts diplomatiques</h3>
                  <p className="text-green-600">thr6827@gmail.com</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-green-800">Relations publiques</h3>
                  <p className="text-green-600">lovanarindra@yahoo.fr</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-green-800">Partenariats stratégiques</h3>
                  <p className="text-green-600">princi.narison@gmail.com</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-green-800">Coordination projets</h3>
                  <p className="text-green-600">andgela.ral@gmail.com</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Message d'adhésion */}
        <section>
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-green-800 text-white p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">
                Formulaire d'adhésion
              </h3>
              <p className="text-lg mb-4">
                Le C.A.S.T. Cantoria est ouvert à ceux qui ressentent l'appel du chant comme une vocation.
              </p>
              <p className="text-lg">
                Pour intégrer cette famille musicale et spirituelle, contactez-nous via l'un de nos canaux de communication.
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Contact;
import React from 'react'

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen bg-gradient-to-br from-primary/90 to-dark/90 text-light">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1511376868136-009c8cac6a6d?ixlib=rb-4.0.3')] bg-cover bg-center mix-blend-overlay"></div>
        
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-3xl">
            <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Quand l'art devient priere,
              <span className="text-accent block">la musique touche l'ame</span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 text-light/90 leading-relaxed">
              Fonde en 2003 a Antananarivo, le C.A.S.T. est un ensemble vocal dont l'essence 
              repose sur le souffle sacre de la musique.
            </p>
            
            <div className="flex space-x-4">
              <button className="bg-accent text-primary px-8 py-3 rounded-lg font-semibold hover:bg-accent/90 transition-colors">
                Decouvrir le Choeur
              </button>
              <button className="border-2 border-light text-light px-8 py-3 rounded-lg font-semibold hover:bg-light hover:text-dark transition-colors">
                Prochains Concerts
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* In Memoriam Section */}
      <section className="py-20 bg-light">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-1 bg-accent mx-auto mb-8"></div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-dark mb-8">
              In Memoriam
            </h2>
            
            <div className="bg-white p-8 rounded-lg shadow-lg text-left">
              <h3 className="font-serif text-2xl text-primary mb-4">
                Monsieur Lucien Emmanuel RANDRIANARIVELO (†)
              </h3>
              
              <p className="text-dark/80 mb-6 leading-relaxed">
                A l'image d'un orfevre du sacre, il a patiemment transcrit les partitions complexes 
                en grilles solfa accessibles, offrant a chaque choriste le don de comprehension.
              </p>
              
              <p className="text-dark/80 mb-6 leading-relaxed">
                Mais sa mission allait plus loin : il a offert une ame malgache aux chefs-d'oeuvre 
                classiques, traduisant leurs paroles avec delicatesse, fidelite et spiritualite.
              </p>
              
              <blockquote className="border-l-4 border-accent pl-4 italic text-dark/70 mb-6">
                "Misaotra anao, Raiamandreny. Ianao no nandika sy nandray ny feon'ny lanitra 
                ho tenin'ny tanindrazana."
              </blockquote>
              
              <p className="text-dark/60">
                Son heritage est immateriel, mais palpable a chaque instant, dans chaque vibration du choeur.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home

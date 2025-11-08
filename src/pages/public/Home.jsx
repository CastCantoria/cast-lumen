import React from 'react';
import { Link } from 'react-router-dom';
import HeroSlider from '../../components/sections/HeroSlider';

const Home = () => {
  const features = [
    {
      icon: "🎵",
      title: "Répertoire Sacré",
      description: "Découvrez notre collection de musique sacrée et spirituelle",
      image: "/images/partition-sacree.jpg",
      link: "/repertoire"
    },
    {
      icon: "🎭",
      title: "Concerts & Événements",
      description: "Assistez à nos prestations musicales dans les plus beaux lieux",
      image: "/images/concert1.jpg",
      link: "/events"
    },
    {
      icon: "👥",
      title: "Rejoindre C.A.S.T.",
      description: "Devenez membre de notre chorale artistique et spirituelle",
      image: "/images/chorale-1.jpg",
      link: "/join"
    },
    {
      icon: "🖼️",
      title: "Galerie Photos",
      description: "Parcourez nos moments forts en images et en vidéos",
      image: "/images/gallery/galerie1.jpg",
      link: "/gallery"
    }
  ];

  const stats = [
    { number: "50+", label: "Membres Actifs" },
    { number: "100+", label: "Pièces au Répertoire" },
    { number: "25+", label: "Concerts Annuels" },
    { number: "5", label: "Ans d'Existence" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Slider */}
      <HeroSlider />

      {/* Section Présentation */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <img 
                src="/images/cast-chorale.jpg" 
                alt="C.A.S.T. Cantoria en concert"
                className="rounded-2xl shadow-2xl w-full h-auto"
              />
            </div>
            <div className="lg:w-1/2">
              <h2 className="text-4xl font-bold text-gray-900 mb-6 font-serif">
                Bienvenue à C.A.S.T. Cantoria
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Le <strong>Chœur Artistique et Spirituel de Tana</strong> est une chorale d'exception 
                qui allie excellence musicale et dimension spirituelle. Fondée sur des valeurs 
                chrétiennes, notre mission est d'élever les âmes par la beauté du chant sacré.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Notre répertoire s'étend de la musique sacrée traditionnelle aux compositions 
                contemporaines, toujours dans le respect de notre vocation spirituelle et artistique.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  to="/about" 
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
                >
                  Notre Histoire
                </Link>
                <Link 
                  to="/contact" 
                  className="border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:border-blue-600 hover:text-blue-600 transition font-semibold"
                >
                  Nous Contacter
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Statistiques */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">C.A.S.T. en Chiffres</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Une communauté grandissante dédiée à l'excellence musicale et spirituelle
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Fonctionnalités */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-serif">Découvrez C.A.S.T.</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explorez les différentes facettes de notre chorale et de nos activités
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-2/5">
                    <img 
                      src={feature.image} 
                      alt={feature.title}
                      className="w-full h-48 md:h-full object-cover"
                    />
                  </div>
                  <div className="md:w-3/5 p-6">
                    <div className="text-3xl mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-600 mb-4">{feature.description}</p>
                    <Link 
                      to={feature.link}
                      className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold"
                    >
                      En savoir plus
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-900 to-purple-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6 font-serif">Prêt à Nous Rejoindre ?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-blue-100">
            Que vous soyez choriste passionné ou simplement intéressé par notre mission, 
            nous serions ravis de vous accueillir dans notre communauté.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/join"
              className="bg-white text-blue-900 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition transform hover:scale-105"
            >
              Postuler Maintenant
            </Link>
            <Link 
              to="/contact"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-900 transition"
            >
              Nous Contacter
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
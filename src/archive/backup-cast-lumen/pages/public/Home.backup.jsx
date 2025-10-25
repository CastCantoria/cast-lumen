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

      {/* contenu abrégé pour archive */}
    </div>
  );
};

export default Home;

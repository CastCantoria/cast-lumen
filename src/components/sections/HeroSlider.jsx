import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: "/images/hero/photo-choeur.jpeg",
      title: "C.A.S.T. Cantoria",
      subtitle: "Chœur Artistique & Spirituel de Tana",
      slogan: "L'excellence au service du sacré",
      description: "Une chorale d'exception au cœur de Madagascar"
    },
    {
      image: "/images/hero/inspiration1.jpg",
      title: "Musique Sacrée",
      subtitle: "Notre Passion",
      slogan: "La voix qui élève l'âme",
      description: "Découvrez notre répertoire de musique spirituelle"
    },
    {
      image: "/images/hero/inspiration3.jpg",
      title: "Concerts Spirituels",
      subtitle: "Nos Prestations",
      slogan: "Des moments de grâce partagés",
      description: "Vivez l'expérience unique de nos concerts"
    },
    {
      image: "/images/slide1.jpg",
      title: "Communauté",
      subtitle: "Notre Famille",
      slogan: "Une voix, un chœur, une mission",
      description: "Rejoignez notre communauté chorale passionnée"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative h-screen overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Image de fond */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url('${slide.image}')` }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          </div>

          {/* Contenu */}
          <div className="relative h-full flex items-center justify-center text-center text-white">
            <div className="max-w-4xl mx-auto px-6">
              <h1 className="text-5xl md:text-7xl font-bold mb-4 font-serif animate-fade-in">
                {slide.title}
              </h1>
              <h2 className="text-2xl md:text-3xl mb-6 text-gray-200 font-light">
                {slide.subtitle}
              </h2>
              <div className="text-xl md:text-2xl mb-6 text-gold font-semibold italic">
                "{slide.slogan}"
              </div>
              <p className="text-lg md:text-xl mb-8 text-gray-300 max-w-2xl mx-auto">
                {slide.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/about" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105"
                >
                  Découvrir C.A.S.T.
                </Link>
                <Link 
                  to="/events" 
                  className="border-2 border-white hover:bg-white hover:text-gray-900 text-white px-8 py-3 rounded-lg font-semibold transition-all"
                >
                  Nos Concerts
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Contrôles de navigation */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all"
      >
        ‹
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all"
      >
        ›
      </button>

      {/* Indicateurs de slide */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
            }`}
          />
        ))}
      </div>

      {/* Défilement vers le bas */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </div>
  );
};

export default HeroSlider;
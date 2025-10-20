// src/components/sections/HeroSlider.jsx
import React, { useState, useEffect } from 'react';

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: "/images/hero/inspiration1.jpg",
      title: "Quand l'art devient prière",
      subtitle: "la musique touche l'âme",
    },
    {
      image: "/images/chorale-1.jpg", 
      title: "Une cathédrale vivante",
      subtitle: "où chaque voix révèle le divin",
    },
    {
      image: "/images/chorale-2.jpg",
      title: "Harmonie sacrée",
      subtitle: "entre tradition et modernité",
    },
    {
      image: "/images/hero/photo-choeur.jpeg",
      title: "Âmes en prière",
      subtitle: "cœurs en harmonie",
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="relative h-96 md:h-[500px] overflow-hidden rounded-lg shadow-2xl">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Image de fond */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${slide.image}')` }}
          >
            {/* Overlay sombre pour meilleur contraste */}
            <div className="absolute inset-0 bg-black bg-opacity-60"></div>
          </div>
          
          {/* Contenu avec meilleur contraste */}
          <div className="relative h-full flex items-center justify-center text-center text-white px-4">
            <div className="transform transition-all duration-1000 delay-300 bg-black bg-opacity-40 p-8 rounded-2xl backdrop-blur-sm">
              <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4 animate-fade-in-up text-white drop-shadow-2xl">
                {slide.title}
              </h1>
              <p className="text-xl md:text-2xl italic animate-fade-in-up delay-500 text-cast-gold font-semibold drop-shadow-lg">
                {slide.subtitle}
              </p>
            </div>
          </div>
        </div>
      ))}
      
      {/* Indicateurs */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-4 h-4 rounded-full transition-all border-2 border-white ${
              index === currentSlide ? 'bg-cast-gold scale-125 border-cast-gold' : 'bg-transparent'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
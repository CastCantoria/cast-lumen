// src/components/layout/Footer.jsx
import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          {/* Brand Section */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-2">
              <span className="text-2xl">🎵</span>
              <strong className="text-xl font-serif">C.A.S.T. Cantoria</strong>
            </div>
            <p className="text-gray-400 mt-2 font-serif">Chœur Artistique & Spirituel de Tana</p>
          </div>
          
          {/* Info Section */}
          <div className="text-center md:text-right">
            <div className="mb-2">
              <span className="text-lg">🏛️</span>
              <p className="text-gray-400 inline-block ml-2">Fondé en 2003 à Antananarivo</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-center md:justify-end space-x-2">
                <span>📧</span>
                <p className="text-gray-400">castcantoria@gmail.com</p>
              </div>
              <div className="flex items-center justify-center md:justify-end space-x-2">
                <span>📞</span>
                <p className="text-gray-400">+261 34 11 316 57</p>
              </div>
              <div className="flex items-center justify-center md:justify-end space-x-2">
                <span>📱</span>
                <p className="text-gray-400">+261 32 91 828 83</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-gray-800 mt-6 pt-6 text-center">
          <p className="text-gray-400">
            &copy; 2003 - {currentYear} C.A.S.T. Cantoria - Tous droits réservés
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
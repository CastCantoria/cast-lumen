import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Remonter en haut de la page à chaque changement de route
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' // Comportement instantané pour une meilleure UX
    });
  }, [pathname]);

  return null; // Ce composant ne rend rien visuellement
};

export default ScrollToTop;
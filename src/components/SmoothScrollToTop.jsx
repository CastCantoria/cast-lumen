import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SmoothScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Attendre que le DOM soit complètement chargé
    const timer = setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth' // Animation fluide
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
};

export default SmoothScrollToTop;
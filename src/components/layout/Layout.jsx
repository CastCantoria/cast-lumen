import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function PageLayout({ children, gradient = true }) {
  const location = useLocation();

  useEffect(() => {
    // Remonter en haut de la page à chaque changement de route
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
  }, [location.pathname]);

  return (
    <div
      className={`w-screen h-screen ${
        gradient ? 'bg-gradient-cast text-white' : 'bg-white text-gray-900'
      } flex flex-col`}
    >
      {/* Header */}
      <header className="h-16 flex items-center justify-between px-6 bg-cast-green text-white">
        <h1 className="text-lg font-bold">C.A.S.T. Canetaria</h1>
        <nav className="space-x-4 text-sm">
          <a href="/" className="hover:underline">Accueil</a>
          <a href="/inscription" className="hover:underline">Inscription</a>
        </nav>
      </header>

      {/* Contenu */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-2xl">{children}</div>
      </main>

      {/* Footer */}
      <footer className="h-12 text-center text-sm bg-cast-green text-white flex items-center justify-center">
        © {new Date().getFullYear()} C.A.S.T. Canetaria
      </footer>
    </div>
  );
}
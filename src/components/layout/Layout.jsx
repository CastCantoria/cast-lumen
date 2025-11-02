import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  
  // Fermer la sidebar quand la route change (sur mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Vérifier si on est sur une page admin
  const isAdminPage = location.pathname.includes('/dashboard') || 
                     location.pathname.includes('/admin') ||
                     location.pathname.includes('/super-admin');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <Header 
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        isAdminPage={isAdminPage}
      />
      
      {/* Contenu principal avec sidebar */}
      <div className="flex flex-1 pt-16">
        {/* Sidebar Admin (seulement sur les pages admin) */}
        {isAdminPage && <AdminSidebar />}
        
        {/* Contenu principal */}
        <main className={`flex-1 transition-all duration-300 ${
          isAdminPage ? 'md:ml-64' : 'ml-0'
        }`}>
          <div className="p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
      
      {/* Footer */}
      <Footer />
      
      {/* Bouton toggle mobile pour admin */}
      {isAdminPage && (
        <>
          {/* Bouton flottant mobile */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="fixed bottom-6 right-6 z-50 md:hidden w-12 h-12 bg-cast-green text-white rounded-full shadow-lg flex items-center justify-center text-xl sidebar-trigger"
          >
            {sidebarOpen ? '✕' : '☰'}
          </button>
          
          {/* Overlay mobile quand sidebar ouverte */}
          {sidebarOpen && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Layout;
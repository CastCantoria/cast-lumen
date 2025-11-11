import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ModerationRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Rediriger vers le panel de modération principal
    navigate('/admin/media');
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-orange-50">
      <div className="text-center max-w-md mx-auto p-8">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-6"></div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Redirection en cours</h2>
        <p className="text-gray-600 mb-6">
          Vous êtes redirigé vers le panel de modération des médias...
        </p>
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-orange-200">
          <p className="text-sm text-orange-800">
            <strong>🛡️ Panel de Modération</strong><br/>
            Gestion des médias uploadés par la communauté C.A.S.T.
          </p>
        </div>
        
        {/* Lien manuel au cas où la redirection échoue */}
        <div className="mt-6">
          <a 
            href="/admin/media"
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
          >
            <span>🛡️</span>
            Accéder directement au panel
          </a>
        </div>
      </div>
    </div>
  );
};

export default ModerationRedirect;
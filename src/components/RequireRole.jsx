import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const RequireRole = ({ children, role }) => {
  const { userProfile, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Si pas de profil utilisateur ou rôle insuffisant
  if (!userProfile || !userProfile.role) {
    return <Navigate to="/login" replace />;
  }

  // Vérification des rôles
  const hasAccess = 
    role === 'admin' && (userProfile.role === 'admin' || userProfile.role === 'super-admin') ||
    role === 'super-admin' && userProfile.role === 'super-admin' ||
    role === 'membre' && (userProfile.role === 'membre' || userProfile.role === 'admin' || userProfile.role === 'super-admin');

  if (!hasAccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold text-red-600 mb-4">Accès Refusé</h1>
        <p className="text-gray-600 mb-8 text-lg">
          Vous n'avez pas les permissions nécessaires pour accéder à cette page.
        </p>
        <button 
          onClick={() => window.history.back()}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          ← Retour
        </button>
      </div>
    );
  }

  return children;
};

export default RequireRole;
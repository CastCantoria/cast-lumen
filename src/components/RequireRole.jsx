import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { hasMinRole } from '../../config/roles';

const RequireRole = ({ children, role }) => {
  const { userProfile, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Si pas de profil utilisateur
  if (!userProfile || !userProfile.role) {
    return <Navigate to="/login" replace />;
  }

  // Si aucun rôle requis, autoriser
  if (!role) return children;

  // Vérifier en utilisant la hiérarchie des rôles : un rôle supérieur (admin) accède aux pages nécessitant un rôle inférieur
  const allowed = hasMinRole(userProfile.role, role);

  if (!allowed) {
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
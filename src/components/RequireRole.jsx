import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';

export default function RequireRole({ children, role }) {
  const { userProfile, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Vérification des rôles
  const hasAccess = () => {
    switch (role) {
      case 'admin':
        return userProfile?.role === 'admin';
      case 'membre':
        return ['admin', 'membre'].includes(userProfile?.role);
      case 'public':
        return true;
      default:
        return false;
    }
  };

  if (!hasAccess()) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Accès Refusé</h1>
          <p className="text-gray-600">Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
        </div>
      </div>
    );
  }

  return children;
}
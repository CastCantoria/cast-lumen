// src/components/auth/RequireAuth.jsx
import { useAuth } from '../../contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

const RequireAuth = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Chargement...</div>
      </div>
    );
  }

  if (!currentUser) {
    // Rediriger vers /login en sauvegardant l'emplacement d'origine
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default RequireAuth;
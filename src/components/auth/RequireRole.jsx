// src/components/auth/RequireRole.jsx
import { useAuth } from '../../contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import { hasMinRole } from '../../../config/roles';

const RequireRole = ({ role, children }) => {
  const { currentUser, userProfile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Chargement...</div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Vérifier le rôle en tenant compte de la hiérarchie
  const userRole = userProfile?.role || 'visitor';
  // Si aucun rôle requis explicitement, autoriser
  if (role) {
    // Vérifier que l'utilisateur possède au moins le rôle requis
    const allowed = hasMinRole(userRole, role);
    if (!allowed) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
};

export default RequireRole;
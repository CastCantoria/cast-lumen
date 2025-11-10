import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

// ✅ Composant avec export named
export const RequireRole = ({ children, allowedRoles }) => {
  const { userProfile } = useAuth();

  if (!userProfile) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(userProfile.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

// ✅ Export default pour compatibilité
export default RequireRole;
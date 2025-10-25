import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthRedirectHandler = () => {
  const { isAuthenticated, userProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated && userProfile) {
      const currentPath = location.pathname + location.hash;
      console.log('🔍 AuthRedirectHandler - Chemin actuel:', currentPath);
      console.log('🔍 Rôle utilisateur:', userProfile.role);

      // Si l'utilisateur est sur /login ou /register, le rediriger vers le dashboard
      if (currentPath.includes('/login') || currentPath.includes('/register')) {
        console.log('🔄 Redirection depuis auth vers /dashboard');
        navigate('/dashboard');
        return;
      }

      // Si l'utilisateur est sur /unauthorized, le rediriger vers le dashboard
      if (currentPath.includes('/unauthorized')) {
        console.log('🔄 Correction unauthorized → dashboard');
        navigate('/dashboard');
        return;
      }
    }
  }, [isAuthenticated, userProfile, location, navigate]);

  return null;
};

export default AuthRedirectHandler;
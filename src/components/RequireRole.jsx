import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const RequireRole = ({ children, role }) => {
  const { userProfile, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh' 
      }}>
        <div>Chargement...</div>
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
      <div style={{ 
        padding: "100px 20px 20px 20px", 
        textAlign: "center",
        minHeight: "60vh"
      }}>
        <h1 style={{ fontSize: "2rem", marginBottom: "1rem", color: "#dc2626" }}>
          ⚠️ Accès Refusé
        </h1>
        <p style={{ fontSize: "1.2rem", marginBottom: "2rem", color: "#666" }}>
          Vous n'avez pas les permissions nécessaires pour accéder à cette page.
        </p>
        <button 
          onClick={() => window.history.back()}
          style={{
            padding: "12px 24px",
            backgroundColor: "#4F46E5",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "1rem"
          }}
        >
          ← Retour
        </button>
      </div>
    );
  }

  return children;
};

export default RequireRole;
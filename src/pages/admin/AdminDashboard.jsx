import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import AdminSidebar from "../../components/layout/AdminSidebar";

const SuperAdminDashboard = () => {
  const { userProfile } = useAuth();

  return (
    <div style={{ 
      minHeight: "100vh", 
      backgroundColor: "#f8fafc",
      display: "flex"
    }}>
      {/* Sidebar de navigation */}
      <AdminSidebar />
      
      {/* Contenu principal */}
      <div style={{ 
        flex: 1,
        marginLeft: "256px",
        paddingTop: "80px",
        paddingBottom: "40px",
        paddingLeft: "20px",
        paddingRight: "20px"
      }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          
          {/* En-tête du Dashboard */}
          <div style={{ 
            backgroundColor: "white", 
            borderRadius: "12px",
            padding: "30px",
            marginBottom: "30px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            border: "1px solid #e2e8f0"
          }}>
            <h1 style={{ 
              fontSize: "2rem", 
              fontWeight: "bold", 
              color: "#15803d",
              marginBottom: "8px"
            }}>
              Tableau de Bord Administration
            </h1>
            <p style={{ color: "#64748b", fontSize: "1.1rem" }}>
              Bienvenue, {userProfile?.displayName || 'Administrateur'} 👋
            </p>
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              marginTop: "15px",
              padding: "12px",
              backgroundColor: "#f0fdf4",
              borderRadius: "8px",
              border: "1px solid #bbf7d0"
            }}>
              <span style={{ 
                backgroundColor: "#15803d", 
                color: "white", 
                padding: "4px 12px", 
                borderRadius: "20px", 
                fontSize: "0.875rem",
                fontWeight: "600"
              }}>
                {userProfile?.role || 'admin'}
                {userProfile?.role === 'super-admin' && ' 👑'}
              </span>
              <span style={{ marginLeft: "12px", color: "#15803d", fontSize: "0.875rem" }}>
                Accès complet à toutes les fonctionnalités d'administration
              </span>
            </div>
          </div>

          {/* Cartes de statistiques */}
          <div style={{ 
            backgroundColor: "white", 
            borderRadius: "12px",
            padding: "25px",
            marginBottom: "30px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            border: "1px solid #e2e8f0"
          }}>
            <h2 style={{ 
              fontSize: "1.5rem", 
              fontWeight: "600", 
              color: "#1e293b",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}>
              <span>📈</span> Aperçu de la Plateforme
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
              <div style={{ textAlign: "center", padding: "20px", backgroundColor: "#f0fdf4", borderRadius: "8px" }}>
                <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#15803d" }}>0</div>
                <div style={{ color: "#64748b", fontWeight: "500" }}>Utilisateurs</div>
              </div>
              <div style={{ textAlign: "center", padding: "20px", backgroundColor: "#fef2f2", borderRadius: "8px" }}>
                <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#dc2626" }}>0</div>
                <div style={{ color: "#64748b", fontWeight: "500" }}>Événements</div>
              </div>
              <div style={{ textAlign: "center", padding: "20px", backgroundColor: "#faf5ff", borderRadius: "8px" }}>
                <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#7c3aed" }}>0</div>
                <div style={{ color: "#64748b", fontWeight: "500" }}>Morceaux</div>
              </div>
              <div style={{ textAlign: "center", padding: "20px", backgroundColor: "#fffbeb", borderRadius: "8px" }}>
                <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#ea580c" }}>0</div>
                <div style={{ color: "#64748b", fontWeight: "500" }}>Admins</div>
              </div>
            </div>
          </div>

          {/* Guide rapide */}
          <div style={{ 
            backgroundColor: "white", 
            borderRadius: "12px",
            padding: "25px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            border: "1px solid #e2e8f0"
          }}>
            <h2 style={{ 
              fontSize: "1.5rem", 
              fontWeight: "600", 
              color: "#1e293b",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}>
              <span>💡</span> Guide Rapide
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px" }}>
              <div style={{ padding: "15px", backgroundColor: "#f8fafc", borderRadius: "8px" }}>
                <h3 style={{ fontWeight: "600", color: "#15803d", marginBottom: "8px" }}>Gestion Utilisateurs</h3>
                <p style={{ color: "#64748b", fontSize: "0.9rem" }}>
                  Ajoutez, modifiez ou supprimez des utilisateurs et gérez leurs permissions.
                </p>
              </div>
              <div style={{ padding: "15px", backgroundColor: "#f8fafc", borderRadius: "8px" }}>
                <h3 style={{ fontWeight: "600", color: "#15803d", marginBottom: "8px" }}>Événements</h3>
                <p style={{ color: "#64748b", fontSize: "0.9rem" }}>
                  Créez et organisez des concerts, répétitions et autres activités.
                </p>
              </div>
              <div style={{ padding: "15px", backgroundColor: "#f8fafc", borderRadius: "8px" }}>
                <h3 style={{ fontWeight: "600", color: "#15803d", marginBottom: "8px" }}>Répertoire</h3>
                <p style={{ color: "#64748b", fontSize: "0.9rem" }}>
                  Gérez le catalogue musical avec partitions et informations détaillées.
                </p>
              </div>
              <div style={{ padding: "15px", backgroundColor: "#f8fafc", borderRadius: "8px" }}>
                <h3 style={{ fontWeight: "600", color: "#15803d", marginBottom: "8px" }}>Administration</h3>
                <p style={{ color: "#64748b", fontSize: "0.9rem" }}>
                  Configurez les paramètres système et surveillez l'activité.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
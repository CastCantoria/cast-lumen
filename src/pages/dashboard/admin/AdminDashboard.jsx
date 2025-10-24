import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { userProfile, currentUser } = useAuth();
  const [stats, setStats] = useState({
    totalMembers: 0,
    pendingRequests: 0,
    activeEvents: 0,
    totalRepertoire: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const members = usersSnapshot.docs.map(doc => doc.data())
        .filter(user => user.role === 'membre');

      setStats({
        totalMembers: members.length,
        pendingRequests: 0, // À implémenter
        activeEvents: 0,    // À implémenter
        totalRepertoire: 0  // À implémenter
      });
    } catch (error) {
      console.error('Erreur chargement dashboard admin:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#f8fafc"
      }}>
        <div style={{
          animation: "spin 1s linear infinite",
          borderRadius: "50%",
          height: "3rem",
          width: "3rem",
          border: "2px solid #2563eb",
          borderTopColor: "transparent"
        }}></div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #0ea5e9 100%)"
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        color: "white",
        padding: "1.5rem"
      }}>
        <div style={{
          maxWidth: "80rem",
          margin: "0 auto"
        }}>
          <h1 style={{
            fontSize: "1.875rem",
            fontWeight: "bold",
            marginBottom: "0.5rem"
          }}>
            Tableau de Bord Administrateur
          </h1>
          <p style={{ color: "#bfdbfe" }}>
            Gestion des membres et activités de C.A.S.T.
          </p>
        </div>
      </div>

      <div style={{
        maxWidth: "80rem",
        margin: "0 auto",
        padding: "1.5rem"
      }}>
        {/* Statistiques */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "1.5rem",
          marginBottom: "2rem"
        }}>
          <div style={{
            backgroundColor: "white",
            borderRadius: "0.5rem",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
            padding: "1.5rem",
            textAlign: "center"
          }}>
            <div style={{
              fontSize: "1.875rem",
              fontWeight: "bold",
              color: "#2563eb"
            }}>
              {stats.totalMembers}
            </div>
            <div style={{ color: "#4b5563" }}>Membres Actifs</div>
          </div>
          
          <div style={{
            backgroundColor: "white",
            borderRadius: "0.5rem",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
            padding: "1.5rem",
            textAlign: "center"
          }}>
            <div style={{
              fontSize: "1.875rem",
              fontWeight: "bold",
              color: "#ea580c"
            }}>
              {stats.pendingRequests}
            </div>
            <div style={{ color: "#4b5563" }}>Demandes en Attente</div>
          </div>
          
          <div style={{
            backgroundColor: "white",
            borderRadius: "0.5rem",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
            padding: "1.5rem",
            textAlign: "center"
          }}>
            <div style={{
              fontSize: "1.875rem",
              fontWeight: "bold",
              color: "#16a34a"
            }}>
              {stats.activeEvents}
            </div>
            <div style={{ color: "#4b5563" }}>Événements Actifs</div>
          </div>
          
          <div style={{
            backgroundColor: "white",
            borderRadius: "0.5rem",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
            padding: "1.5rem",
            textAlign: "center"
          }}>
            <div style={{
              fontSize: "1.875rem",
              fontWeight: "bold",
              color: "#7c3aed"
            }}>
              {stats.totalRepertoire}
            </div>
            <div style={{ color: "#4b5563" }}>Pièces au Répertoire</div>
          </div>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
          gap: "2rem"
        }}>
          {/* Gestion des Membres */}
          <div style={{
            backgroundColor: "white",
            borderRadius: "0.5rem",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
            padding: "1.5rem"
          }}>
            <h2 style={{
              fontSize: "1.25rem",
              fontWeight: "bold",
              marginBottom: "1rem",
              color: "#1f2937"
            }}>
              Gestion des Membres
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <Link 
                to="/admin/users" 
                style={{
                  width: "100%",
                  backgroundColor: "#2563eb",
                  color: "white",
                  padding: "0.75rem 1rem",
                  borderRadius: "0.5rem",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "center",
                  textDecoration: "none",
                  fontWeight: "500",
                  transition: "background-color 0.3s"
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = "#1d4ed8"}
                onMouseOut={(e) => e.target.style.backgroundColor = "#2563eb"}
              >
                👥 Voir tous les Membres
              </Link>
              
              <Link 
                to="/admin/admissions" 
                style={{
                  width: "100%",
                  backgroundColor: "#16a34a",
                  color: "white",
                  padding: "0.75rem 1rem",
                  borderRadius: "0.5rem",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "center",
                  textDecoration: "none",
                  fontWeight: "500",
                  transition: "background-color 0.3s"
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = "#15803d"}
                onMouseOut={(e) => e.target.style.backgroundColor = "#16a34a"}
              >
                ✅ Gérer les Admissions
              </Link>
              
              <Link 
                to="/admin/messages" 
                style={{
                  width: "100%",
                  backgroundColor: "#7c3aed",
                  color: "white",
                  padding: "0.75rem 1rem",
                  borderRadius: "0.5rem",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "center",
                  textDecoration: "none",
                  fontWeight: "500",
                  transition: "background-color 0.3s"
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = "#6d28d9"}
                onMouseOut={(e) => e.target.style.backgroundColor = "#7c3aed"}
              >
                📧 Envoyer un Message
              </Link>
            </div>
          </div>

          {/* Gestion des Événements */}
          <div style={{
            backgroundColor: "white",
            borderRadius: "0.5rem",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
            padding: "1.5rem"
          }}>
            <h2 style={{
              fontSize: "1.25rem",
              fontWeight: "bold",
              marginBottom: "1rem",
              color: "#1f2937"
            }}>
              Gestion des Événements
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <Link 
                to="/admin/events/create" 
                style={{
                  width: "100%",
                  backgroundColor: "#ea580c",
                  color: "white",
                  padding: "0.75rem 1rem",
                  borderRadius: "0.5rem",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "center",
                  textDecoration: "none",
                  fontWeight: "500",
                  transition: "background-color 0.3s"
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = "#c2410c"}
                onMouseOut={(e) => e.target.style.backgroundColor = "#ea580c"}
              >
                🎵 Créer un Événement
              </Link>
              
              <Link 
                to="/admin/calendar" 
                style={{
                  width: "100%",
                  backgroundColor: "#0d9488",
                  color: "white",
                  padding: "0.75rem 1rem",
                  borderRadius: "0.5rem",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "center",
                  textDecoration: "none",
                  fontWeight: "500",
                  transition: "background-color 0.3s"
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = "#0f766e"}
                onMouseOut={(e) => e.target.style.backgroundColor = "#0d9488"}
              >
                📅 Calendrier des Concerts
              </Link>
              
              <Link 
                to="/admin/statistics" 
                style={{
                  width: "100%",
                  backgroundColor: "#4f46e5",
                  color: "white",
                  padding: "0.75rem 1rem",
                  borderRadius: "0.5rem",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "center",
                  textDecoration: "none",
                  fontWeight: "500",
                  transition: "background-color 0.3s"
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = "#4338ca"}
                onMouseOut={(e) => e.target.style.backgroundColor = "#4f46e5"}
              >
                📊 Statistiques de Participation
              </Link>
            </div>
          </div>
        </div>

        {/* Actions Rapides */}
        <div style={{
          marginTop: "2rem",
          backgroundColor: "white",
          borderRadius: "0.5rem",
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
          padding: "1.5rem"
        }}>
          <h2 style={{
            fontSize: "1.25rem",
            fontWeight: "bold",
            marginBottom: "1rem",
            color: "#1f2937"
          }}>
            Actions Rapides
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem"
          }}>
            <Link 
              to="/admin/partitions/add" 
              style={{
                backgroundColor: "#4b5563",
                color: "white",
                padding: "0.5rem 1rem",
                borderRadius: "0.375rem",
                border: "none",
                cursor: "pointer",
                textAlign: "center",
                textDecoration: "none",
                fontWeight: "500",
                transition: "background-color 0.3s"
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = "#374151"}
              onMouseOut={(e) => e.target.style.backgroundColor = "#4b5563"}
            >
              📝 Ajouter une Partition
            </Link>
            
            <Link 
              to="/admin/gallery" 
              style={{
                backgroundColor: "#dc2626",
                color: "white",
                padding: "0.5rem 1rem",
                borderRadius: "0.375rem",
                border: "none",
                cursor: "pointer",
                textAlign: "center",
                textDecoration: "none",
                fontWeight: "500",
                transition: "background-color 0.3s"
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = "#b91c1c"}
              onMouseOut={(e) => e.target.style.backgroundColor = "#dc2626"}
            >
              🖼️ Gérer la Galerie
            </Link>
            
            <Link 
              to="/admin/articles/create" 
              style={{
                backgroundColor: "#ca8a04",
                color: "white",
                padding: "0.5rem 1rem",
                borderRadius: "0.375rem",
                border: "none",
                cursor: "pointer",
                textAlign: "center",
                textDecoration: "none",
                fontWeight: "500",
                transition: "background-color 0.3s"
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = "#a16207"}
              onMouseOut={(e) => e.target.style.backgroundColor = "#ca8a04"}
            >
              📰 Publier un Article
            </Link>
            
            <Link 
              to="/admin/invite" 
              style={{
                backgroundColor: "#16a34a",
                color: "white",
                padding: "0.5rem 1rem",
                borderRadius: "0.375rem",
                border: "none",
                cursor: "pointer",
                textAlign: "center",
                textDecoration: "none",
                fontWeight: "500",
                transition: "background-color 0.3s"
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = "#15803d"}
              onMouseOut={(e) => e.target.style.backgroundColor = "#16a34a"}
            >
              👥 Inviter un Membre
            </Link>
          </div>
        </div>

        {/* Section Informations */}
        <div style={{
          marginTop: "2rem",
          backgroundColor: "white",
          borderRadius: "0.5rem",
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
          padding: "1.5rem"
        }}>
          <h2 style={{
            fontSize: "1.25rem",
            fontWeight: "bold",
            marginBottom: "1rem",
            color: "#1f2937"
          }}>
            Informations Administrateur
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "1rem"
          }}>
            <div style={{
              backgroundColor: "#f0f9ff",
              padding: "1rem",
              borderRadius: "0.5rem",
              border: "1px solid #bae6fd"
            }}>
              <h3 style={{
                fontWeight: "600",
                color: "#0369a1",
                marginBottom: "0.5rem"
              }}>
                📋 Prochaines Actions
              </h3>
              <ul style={{ color: "#475569", fontSize: "0.875rem", listStyle: "none", padding: 0 }}>
                <li style={{ marginBottom: "0.25rem" }}>• Examiner les nouvelles demandes d'adhésion</li>
                <li style={{ marginBottom: "0.25rem" }}>• Planifier le prochain concert</li>
                <li style={{ marginBottom: "0.25rem" }}>• Mettre à jour le répertoire</li>
              </ul>
            </div>
            
            <div style={{
              backgroundColor: "#f0fdf4",
              padding: "1rem",
              borderRadius: "0.5rem",
              border: "1px solid #bbf7d0"
            }}>
              <h3 style={{
                fontWeight: "600",
                color: "#15803d",
                marginBottom: "0.5rem"
              }}>
                🎯 Objectifs du Mois
              </h3>
              <ul style={{ color: "#475569", fontSize: "0.875rem", listStyle: "none", padding: 0 }}>
                <li style={{ marginBottom: "0.25rem" }}>• Atteindre 60 membres actifs</li>
                <li style={{ marginBottom: "0.25rem" }}>• Organiser 3 concerts</li>
                <li style={{ marginBottom: "0.25rem" }}>• Ajouter 5 nouvelles partitions</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Styles d'animation */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default AdminDashboard;
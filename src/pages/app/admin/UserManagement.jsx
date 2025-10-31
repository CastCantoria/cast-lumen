import React, { useState } from 'react';
import AdminSidebar from '../../../components/layout/AdminSidebar';

const UserManagement = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'Jean Dupont',
      email: 'jean.dupont@email.com',
      role: 'membre',
      status: 'active',
      joinDate: '2024-01-15'
    },
    {
      id: 2,
      name: 'Admin User',
      email: 'admin@cast.com',
      role: 'admin',
      status: 'active',
      joinDate: '2024-01-10'
    }
  ]);

  const handleRoleChange = (userId, newRole) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    ));
  };

  const handleStatusChange = (userId, newStatus) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, status: newStatus } : user
    ));
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      setUsers(prev => prev.filter(user => user.id !== userId));
    }
  };

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
        padding: "80px 20px 40px 20px"
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          
          <div style={{
            backgroundColor: "white",
            borderRadius: "12px",
            padding: "24px",
            marginBottom: "24px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            border: "1px solid #e2e8f0"
          }}>
            <h1 style={{
              fontSize: "1.875rem",
              fontWeight: "bold",
              color: "#15803d",
              marginBottom: "8px"
            }}>
              Gestion des Utilisateurs
            </h1>
            <p style={{ color: "#64748b" }}>
              Gérez les membres et leurs permissions
            </p>
          </div>

          {/* Tableau des utilisateurs */}
          <div style={{
            backgroundColor: "white",
            borderRadius: "12px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            border: "1px solid #e2e8f0",
            overflow: "hidden"
          }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ 
                minWidth: "100%",
                borderCollapse: "collapse"
              }}>
                <thead style={{ backgroundColor: "#f9fafb" }}>
                  <tr>
                    <th style={{
                      padding: "12px 24px",
                      textAlign: "left",
                      fontSize: "0.75rem",
                      fontWeight: "500",
                      color: "#6b7280",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      borderBottom: "1px solid #e5e7eb"
                    }}>
                      Utilisateur
                    </th>
                    <th style={{
                      padding: "12px 24px",
                      textAlign: "left",
                      fontSize: "0.75rem",
                      fontWeight: "500",
                      color: "#6b7280",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      borderBottom: "1px solid #e5e7eb"
                    }}>
                      Rôle
                    </th>
                    <th style={{
                      padding: "12px 24px",
                      textAlign: "left",
                      fontSize: "0.75rem",
                      fontWeight: "500",
                      color: "#6b7280",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      borderBottom: "1px solid #e5e7eb"
                    }}>
                      Statut
                    </th>
                    <th style={{
                      padding: "12px 24px",
                      textAlign: "left",
                      fontSize: "0.75rem",
                      fontWeight: "500",
                      color: "#6b7280",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      borderBottom: "1px solid #e5e7eb"
                    }}>
                      Date d'adhésion
                    </th>
                    <th style={{
                      padding: "12px 24px",
                      textAlign: "left",
                      fontSize: "0.75rem",
                      fontWeight: "500",
                      color: "#6b7280",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      borderBottom: "1px solid #e5e7eb"
                    }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody style={{ backgroundColor: "white" }}>
                  {users.map(user => (
                    <tr key={user.id} style={{ 
                      borderBottom: "1px solid #e5e7eb",
                      transition: "background-color 0.3s"
                    }} 
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#f9fafb"}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = "white"}>
                      <td style={{ padding: "16px 24px" }}>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <div style={{
                            width: "40px",
                            height: "40px",
                            backgroundColor: "#dcfce7",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#15803d",
                            fontWeight: "bold",
                            fontSize: "1rem",
                            marginRight: "16px"
                          }}>
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <div style={{ 
                              fontSize: "0.875rem", 
                              fontWeight: "500", 
                              color: "#111827" 
                            }}>
                              {user.name}
                            </div>
                            <div style={{ 
                              fontSize: "0.875rem", 
                              color: "#6b7280",
                              marginTop: "2px"
                            }}>
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "16px 24px" }}>
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          style={{
                            fontSize: "0.875rem",
                            border: "1px solid #d1d5db",
                            borderRadius: "6px",
                            padding: "4px 8px",
                            outline: "none",
                            transition: "border-color 0.3s, box-shadow 0.3s"
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = "#ca8a04";
                            e.target.style.boxShadow = "0 0 0 3px rgba(202, 138, 4, 0.1)";
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = "#d1d5db";
                            e.target.style.boxShadow = "none";
                          }}
                        >
                          <option value="membre">Membre</option>
                          <option value="admin">Admin</option>
                          <option value="super-admin">Super Admin</option>
                        </select>
                      </td>
                      <td style={{ padding: "16px 24px" }}>
                        <select
                          value={user.status}
                          onChange={(e) => handleStatusChange(user.id, e.target.value)}
                          style={{
                            fontSize: "0.875rem",
                            border: "1px solid #d1d5db",
                            borderRadius: "6px",
                            padding: "4px 8px",
                            outline: "none",
                            transition: "border-color 0.3s, box-shadow 0.3s"
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = "#ca8a04";
                            e.target.style.boxShadow = "0 0 0 3px rgba(202, 138, 4, 0.1)";
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = "#d1d5db";
                            e.target.style.boxShadow = "none";
                          }}
                        >
                          <option value="active">Actif</option>
                          <option value="inactive">Inactif</option>
                          <option value="suspended">Suspendu</option>
                        </select>
                      </td>
                      <td style={{ 
                        padding: "16px 24px",
                        fontSize: "0.875rem",
                        color: "#6b7280",
                        whiteSpace: "nowrap"
                      }}>
                        {new Date(user.joinDate).toLocaleDateString('fr-FR')}
                      </td>
                      <td style={{ 
                        padding: "16px 24px",
                        fontSize: "0.875rem",
                        fontWeight: "500"
                      }}>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          style={{
                            color: "#dc2626",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            transition: "color 0.3s"
                          }}
                          onMouseOver={(e) => e.target.style.color = "#991b1b"}
                          onMouseOut={(e) => e.target.style.color = "#dc2626"}
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
import React, { useState, useEffect } from 'react';
import { db } from '../../../config/firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';
import AdminSidebar from '../../../components/layout/AdminSidebar';

const RepertoireManagement = () => {
  const [repertoire, setRepertoire] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadRepertoire();
  }, []);

  const loadRepertoire = async () => {
    try {
      const repSnapshot = await getDocs(collection(db, 'repertoire'));
      const repData = repSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRepertoire(repData);
    } catch (error) {
      console.error('Erreur chargement répertoire:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (itemData) => {
    try {
      await addDoc(collection(db, 'repertoire'), {
        ...itemData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      loadRepertoire();
      setShowAddModal(false);
    } catch (error) {
      console.error('Erreur ajout répertoire:', error);
    }
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
  };

  const handleSaveItem = async (itemData) => {
    try {
      const itemRef = doc(db, 'repertoire', itemData.id);
      await updateDoc(itemRef, {
        ...itemData,
        updatedAt: new Date()
      });
      loadRepertoire();
      setEditingItem(null);
    } catch (error) {
      console.error('Erreur mise à jour répertoire:', error);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce morceau ?')) {
      try {
        await deleteDoc(doc(db, 'repertoire', itemId));
        setRepertoire(repertoire.filter(r => r.id !== itemId));
      } catch (error) {
        console.error('Erreur suppression répertoire:', error);
      }
    }
  };

  const exportToCSV = () => {
    const csvContent = [
      ['ID', 'Titre', 'Compositeur', 'Genre', 'Durée', 'Difficulté', 'Statut'],
      ...repertoire.map(item => [
        item.id,
        item.title,
        item.composer,
        item.genre,
        item.duration,
        item.difficulty,
        item.status
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'repertoire-cast.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredRepertoire = repertoire.filter(item =>
    item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.composer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.genre?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div style={{ 
        minHeight: "100vh", 
        backgroundColor: "#f8fafc",
        display: "flex"
      }}>
        <AdminSidebar />
        <div style={{ 
          flex: 1,
          marginLeft: "256px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement du répertoire...</p>
          </div>
        </div>
      </div>
    );
  }

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
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px"
            }}>
              <div>
                <h1 style={{
                  fontSize: "1.875rem",
                  fontWeight: "bold",
                  color: "#15803d"
                }}>
                  Gestion du Répertoire
                </h1>
                <p style={{ color: "#64748b", marginTop: "8px" }}>
                  Administrez le répertoire musical
                </p>
              </div>
              <div style={{
                display: "flex",
                gap: "12px",
                flexWrap: "wrap"
              }}>
                <button
                  onClick={() => setShowAddModal(true)}
                  style={{
                    backgroundColor: "#15803d",
                    color: "white",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: "500",
                    transition: "background-color 0.3s"
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = "#ca8a04"}
                  onMouseOut={(e) => e.target.style.backgroundColor = "#15803d"}
                >
                  ➕ Ajouter
                </button>
                <button
                  onClick={exportToCSV}
                  style={{
                    backgroundColor: "#16a34a",
                    color: "white",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: "500",
                    transition: "background-color 0.3s"
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = "#15803d"}
                  onMouseOut={(e) => e.target.style.backgroundColor = "#16a34a"}
                >
                  📊 Exporter CSV
                </button>
              </div>
            </div>
          </div>

          {/* Barre de recherche */}
          <div style={{
            backgroundColor: "white",
            borderRadius: "12px",
            padding: "24px",
            marginBottom: "24px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            border: "1px solid #e2e8f0"
          }}>
            <input
              type="text"
              placeholder="🔍 Rechercher un morceau..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                maxWidth: "320px",
                padding: "8px 16px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
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
            />
          </div>

          {/* Tableau du répertoire */}
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
                      Morceau
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
                      Compositeur
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
                      Genre
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
                      Durée
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
                      Difficulté
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
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody style={{ backgroundColor: "white" }}>
                  {filteredRepertoire.map((item) => (
                    <tr key={item.id} style={{ 
                      borderBottom: "1px solid #e5e7eb",
                      transition: "background-color 0.3s"
                    }} 
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#f9fafb"}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = "white"}>
                      <td style={{ 
                        padding: "16px 24px",
                        fontSize: "0.875rem",
                        fontWeight: "500",
                        color: "#111827"
                      }}>
                        {item.title}
                      </td>
                      <td style={{ 
                        padding: "16px 24px",
                        fontSize: "0.875rem",
                        color: "#111827",
                        whiteSpace: "nowrap"
                      }}>
                        {item.composer}
                      </td>
                      <td style={{ padding: "16px 24px", whiteSpace: "nowrap" }}>
                        <span style={{
                          display: "inline-flex",
                          padding: "4px 8px",
                          fontSize: "0.75rem",
                          fontWeight: "600",
                          borderRadius: "9999px",
                          backgroundColor: "#e9d5ff",
                          color: "#7c3aed"
                        }}>
                          {item.genre}
                        </span>
                      </td>
                      <td style={{ 
                        padding: "16px 24px",
                        fontSize: "0.875rem",
                        color: "#111827",
                        whiteSpace: "nowrap"
                      }}>
                        {item.duration}
                      </td>
                      <td style={{ padding: "16px 24px", whiteSpace: "nowrap" }}>
                        <span style={{
                          display: "inline-flex",
                          padding: "4px 8px",
                          fontSize: "0.75rem",
                          fontWeight: "600",
                          borderRadius: "9999px",
                          backgroundColor: 
                            item.difficulty === 'facile' ? "#dcfce7" :
                            item.difficulty === 'moyen' ? "#fef3c7" :
                            "#fecaca",
                          color:
                            item.difficulty === 'facile' ? "#166534" :
                            item.difficulty === 'moyen' ? "#92400e" :
                            "#991b1b"
                        }}>
                          {item.difficulty}
                        </span>
                      </td>
                      <td style={{ padding: "16px 24px", whiteSpace: "nowrap" }}>
                        <span style={{
                          display: "inline-flex",
                          padding: "4px 8px",
                          fontSize: "0.75rem",
                          fontWeight: "600",
                          borderRadius: "9999px",
                          backgroundColor: 
                            item.status === 'appris' ? "#dcfce7" :
                            item.status === 'en-cours' ? "#dbeafe" :
                            "#f3f4f6",
                          color:
                            item.status === 'appris' ? "#166534" :
                            item.status === 'en-cours' ? "#1e40af" :
                            "#374151"
                        }}>
                          {item.status}
                        </span>
                      </td>
                      <td style={{ 
                        padding: "16px 24px",
                        whiteSpace: "nowrap",
                        fontSize: "0.875rem",
                        fontWeight: "500"
                      }}>
                        <button
                          onClick={() => handleEditItem(item)}
                          style={{
                            color: "#15803d",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            marginRight: "8px",
                            transition: "color 0.3s"
                          }}
                          onMouseOver={(e) => e.target.style.color = "#ca8a04"}
                          onMouseOut={(e) => e.target.style.color = "#15803d"}
                        >
                          ✏️ Modifier
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
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
                          🗑️ Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredRepertoire.length === 0 && (
              <div style={{ 
                textAlign: "center", 
                padding: "48px 24px" 
              }}>
                <div style={{ fontSize: "2.25rem", marginBottom: "16px" }}>🎵</div>
                <h3 style={{ 
                  fontSize: "1.125rem", 
                  fontWeight: "500", 
                  color: "#111827",
                  marginBottom: "8px"
                }}>
                  Aucun morceau trouvé
                </h3>
                <p style={{ color: "#6b7280" }}>
                  Commencez par ajouter votre premier morceau au répertoire.
                </p>
              </div>
            )}
          </div>

          {/* Modals pour ajouter/modifier */}
          {showAddModal && (
            <RepertoireModal
              onSave={handleAddItem}
              onClose={() => setShowAddModal(false)}
            />
          )}

          {editingItem && (
            <RepertoireModal
              item={editingItem}
              onSave={handleSaveItem}
              onClose={() => setEditingItem(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// Modal pour répertoire
const RepertoireModal = ({ item, onSave, onClose }) => {
  const [formData, setFormData] = useState(item || {
    title: '',
    composer: '',
    genre: 'classique',
    duration: '',
    difficulty: 'moyen',
    status: 'en-cours'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "16px",
      zIndex: 50
    }}>
      <div style={{
        backgroundColor: "white",
        borderRadius: "12px",
        maxWidth: "28rem",
        width: "100%",
        padding: "24px"
      }}>
        <h2 style={{
          fontSize: "1.25rem",
          fontWeight: "bold",
          color: "#15803d",
          marginBottom: "16px"
        }}>
          {item ? 'Modifier le morceau' : 'Nouveau morceau'}
        </h2>
        
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{
              display: "block",
              fontSize: "0.875rem",
              fontWeight: "500",
              color: "#374151",
              marginBottom: "4px"
            }}>
              Titre
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              style={{
                width: "100%",
                padding: "8px 12px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
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
              required
            />
          </div>

          <div>
            <label style={{
              display: "block",
              fontSize: "0.875rem",
              fontWeight: "500",
              color: "#374151",
              marginBottom: "4px"
            }}>
              Compositeur
            </label>
            <input
              type="text"
              value={formData.composer}
              onChange={(e) => setFormData({ ...formData, composer: e.target.value })}
              style={{
                width: "100%",
                padding: "8px 12px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
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
              required
            />
          </div>

          <div style={{ display: "flex", gap: "16px" }}>
            <div style={{ flex: 1 }}>
              <label style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: "500",
                color: "#374151",
                marginBottom: "4px"
              }}>
                Genre
              </label>
              <select
                value={formData.genre}
                onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
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
                <option value="classique">Classique</option>
                <option value="sacree">Sacrée</option>
                <option value="contemporain">Contemporain</option>
                <option value="traditionnel">Traditionnel</option>
                <option value="autre">Autre</option>
              </select>
            </div>

            <div style={{ flex: 1 }}>
              <label style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: "500",
                color: "#374151",
                marginBottom: "4px"
              }}>
                Durée
              </label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
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
                placeholder="Ex: 3:45"
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: "16px" }}>
            <div style={{ flex: 1 }}>
              <label style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: "500",
                color: "#374151",
                marginBottom: "4px"
              }}>
                Difficulté
              </label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
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
                <option value="facile">Facile</option>
                <option value="moyen">Moyen</option>
                <option value="difficile">Difficile</option>
              </select>
            </div>

            <div style={{ flex: 1 }}>
              <label style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: "500",
                color: "#374151",
                marginBottom: "4px"
              }}>
                Statut
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
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
                <option value="en-cours">En cours</option>
                <option value="appris">Appris</option>
                <option value="a-reviser">À réviser</option>
              </select>
            </div>
          </div>

          <div style={{ 
            display: "flex", 
            justifyContent: "flex-end", 
            gap: "12px",
            paddingTop: "16px"
          }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "8px 16px",
                color: "#6b7280",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontWeight: "500",
                transition: "color 0.3s"
              }}
              onMouseOver={(e) => e.target.style.color = "#374151"}
              onMouseOut={(e) => e.target.style.color = "#6b7280"}
            >
              Annuler
            </button>
            <button
              type="submit"
              style={{
                padding: "8px 16px",
                backgroundColor: "#15803d",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "500",
                transition: "background-color 0.3s"
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = "#ca8a04"}
              onMouseOut={(e) => e.target.style.backgroundColor = "#15803d"}
            >
              {item ? 'Sauvegarder' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RepertoireManagement;
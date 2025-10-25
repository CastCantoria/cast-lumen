import React, { useState, useEffect } from 'react';
import { db } from '../../../config/firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';
import AdminSidebar from '../../../components/layout/AdminSidebar';

const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const eventsSnapshot = await getDocs(collection(db, 'events'));
      const eventsData = eventsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEvents(eventsData);
    } catch (error) {
      console.error('Erreur chargement événements:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrage des événements
  const filteredEvents = events.filter(event => {
    const matchesSearch = 
      event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || event.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEvents = filteredEvents.slice(startIndex, startIndex + itemsPerPage);

  const handleAddEvent = async (eventData) => {
    try {
      await addDoc(collection(db, 'events'), {
        ...eventData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      loadEvents();
      setShowAddModal(false);
    } catch (error) {
      console.error('Erreur ajout événement:', error);
    }
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
  };

  const handleSaveEvent = async (eventData) => {
    try {
      const eventRef = doc(db, 'events', eventData.id);
      await updateDoc(eventRef, {
        ...eventData,
        updatedAt: new Date()
      });
      loadEvents();
      setEditingEvent(null);
    } catch (error) {
      console.error('Erreur mise à jour événement:', error);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
      try {
        await deleteDoc(doc(db, 'events', eventId));
        setEvents(events.filter(e => e.id !== eventId));
      } catch (error) {
        console.error('Erreur suppression événement:', error);
      }
    }
  };

  const exportToCSV = () => {
    const csvContent = [
      ['ID', 'Titre', 'Description', 'Date', 'Lieu', 'Type', 'Statut'],
      ...filteredEvents.map(event => [
        event.id,
        event.title,
        event.description,
        event.date,
        event.location,
        event.type,
        event.status
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `evenements-cast-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setTypeFilter('all');
    setStatusFilter('all');
    setCurrentPage(1);
  };

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
            <p className="mt-4 text-gray-600">Chargement des événements...</p>
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
                  Gestion des Événements
                </h1>
                <p style={{ color: "#64748b", marginTop: "8px" }}>
                  Organisez concerts et activités
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

          {/* Barre de recherche et filtres */}
          <div style={{
            backgroundColor: "white",
            borderRadius: "12px",
            padding: "24px",
            marginBottom: "24px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            border: "1px solid #e2e8f0"
          }}>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "16px",
              marginBottom: "16px"
            }}>
              <div>
                <label style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  color: "#374151",
                  marginBottom: "4px"
                }}>
                  🔍 Recherche
                </label>
                <input
                  type="text"
                  placeholder="Titre, description, lieu..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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
                  🎭 Type
                </label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
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
                  <option value="all">Tous les types</option>
                  <option value="concert">Concert</option>
                  <option value="repetition">Répétition</option>
                  <option value="rencontre">Rencontre</option>
                  <option value="autre">Autre</option>
                </select>
              </div>

              <div>
                <label style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  color: "#374151",
                  marginBottom: "4px"
                }}>
                  📊 Statut
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
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
                  <option value="all">Tous les statuts</option>
                  <option value="planifié">Planifié</option>
                  <option value="confirme">Confirmé</option>
                  <option value="annule">Annulé</option>
                  <option value="termine">Terminé</option>
                </select>
              </div>

              <div>
                <label style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  color: "#374151",
                  marginBottom: "4px"
                }}>
                  📄 Affichage
                </label>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
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
                  <option value="5">5 par page</option>
                  <option value="10">10 par page</option>
                  <option value="20">20 par page</option>
                  <option value="50">50 par page</option>
                  <option value={filteredEvents.length}>Tout afficher</option>
                </select>
              </div>
            </div>

            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <button
                onClick={resetFilters}
                style={{
                  color: "#6b7280",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  transition: "color 0.3s"
                }}
                onMouseOver={(e) => e.target.style.color = "#374151"}
                onMouseOut={(e) => e.target.style.color = "#6b7280"}
              >
                🔄 Réinitialiser les filtres
              </button>
              <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                {filteredEvents.length} événement(s) trouvé(s)
                {(searchTerm || typeFilter !== 'all' || statusFilter !== 'all') && 
                 ` (sur ${events.length} au total)`}
              </div>
            </div>
          </div>

          {/* Tableau des événements */}
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
                      Événement
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
                      Date
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
                      Lieu
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
                      Type
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
                  {paginatedEvents.map((event) => (
                    <tr key={event.id} style={{ 
                      borderBottom: "1px solid #e5e7eb",
                      transition: "background-color 0.3s"
                    }} 
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#f9fafb"}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = "white"}>
                      <td style={{ padding: "16px 24px" }}>
                        <div style={{ 
                          fontSize: "0.875rem", 
                          fontWeight: "500", 
                          color: "#111827" 
                        }}>
                          {event.title}
                        </div>
                        <div style={{ 
                          fontSize: "0.875rem", 
                          color: "#6b7280",
                          marginTop: "4px"
                        }}>
                          {event.description}
                        </div>
                      </td>
                      <td style={{ 
                        padding: "16px 24px",
                        fontSize: "0.875rem",
                        color: "#111827",
                        whiteSpace: "nowrap"
                      }}>
                        {event.date}
                      </td>
                      <td style={{ 
                        padding: "16px 24px",
                        fontSize: "0.875rem",
                        color: "#111827",
                        whiteSpace: "nowrap"
                      }}>
                        {event.location}
                      </td>
                      <td style={{ padding: "16px 24px", whiteSpace: "nowrap" }}>
                        <span style={{
                          display: "inline-flex",
                          padding: "4px 8px",
                          fontSize: "0.75rem",
                          fontWeight: "600",
                          borderRadius: "9999px",
                          backgroundColor: "#dbeafe",
                          color: "#1e40af"
                        }}>
                          {event.type}
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
                            event.status === 'confirme' ? "#dcfce7" :
                            event.status === 'annule' ? "#fecaca" :
                            event.status === 'termine' ? "#f3f4f6" :
                            "#fef3c7",
                          color:
                            event.status === 'confirme' ? "#166534" :
                            event.status === 'annule' ? "#991b1b" :
                            event.status === 'termine' ? "#374151" :
                            "#92400e"
                        }}>
                          {event.status}
                        </span>
                      </td>
                      <td style={{ 
                        padding: "16px 24px",
                        whiteSpace: "nowrap",
                        fontSize: "0.875rem",
                        fontWeight: "500"
                      }}>
                        <button
                          onClick={() => handleEditEvent(event)}
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
                          onClick={() => handleDeleteEvent(event.id)}
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

            {filteredEvents.length === 0 && (
              <div style={{ 
                textAlign: "center", 
                padding: "48px 24px" 
              }}>
                <div style={{ fontSize: "2.25rem", marginBottom: "16px" }}>🎭</div>
                <h3 style={{ 
                  fontSize: "1.125rem", 
                  fontWeight: "500", 
                  color: "#111827",
                  marginBottom: "8px"
                }}>
                  Aucun événement trouvé
                </h3>
                <p style={{ color: "#6b7280" }}>
                  Commencez par ajouter votre premier événement.
                </p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "24px",
              marginTop: "24px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #e2e8f0"
            }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}>
                <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                  Page {currentPage} sur {totalPages} • 
                  Affichage de {startIndex + 1} à {Math.min(startIndex + itemsPerPage, filteredEvents.length)} 
                  sur {filteredEvents.length} événements
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    style={{
                      padding: "8px 12px",
                      border: "1px solid #d1d5db",
                      borderRadius: "6px",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      color: "#374151",
                      backgroundColor: "white",
                      cursor: currentPage === 1 ? "not-allowed" : "pointer",
                      opacity: currentPage === 1 ? 0.5 : 1,
                      transition: "background-color 0.3s"
                    }}
                    onMouseOver={(e) => {
                      if (currentPage !== 1) e.target.style.backgroundColor = "#f9fafb";
                    }}
                    onMouseOut={(e) => {
                      if (currentPage !== 1) e.target.style.backgroundColor = "white";
                    }}
                  >
                    ← Précédent
                  </button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        style={{
                          padding: "8px 12px",
                          border: "1px solid #d1d5db",
                          borderRadius: "6px",
                          fontSize: "0.875rem",
                          fontWeight: "500",
                          backgroundColor: currentPage === pageNum ? "#15803d" : "white",
                          color: currentPage === pageNum ? "white" : "#374151",
                          cursor: "pointer",
                          transition: "background-color 0.3s, color 0.3s"
                        }}
                        onMouseOver={(e) => {
                          if (currentPage !== pageNum) {
                            e.target.style.backgroundColor = "#f9fafb";
                          }
                        }}
                        onMouseOut={(e) => {
                          if (currentPage !== pageNum) {
                            e.target.style.backgroundColor = "white";
                          }
                        }}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    style={{
                      padding: "8px 12px",
                      border: "1px solid #d1d5db",
                      borderRadius: "6px",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      color: "#374151",
                      backgroundColor: "white",
                      cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                      opacity: currentPage === totalPages ? 0.5 : 1,
                      transition: "background-color 0.3s"
                    }}
                    onMouseOver={(e) => {
                      if (currentPage !== totalPages) e.target.style.backgroundColor = "#f9fafb";
                    }}
                    onMouseOut={(e) => {
                      if (currentPage !== totalPages) e.target.style.backgroundColor = "white";
                    }}
                  >
                    Suivant →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modals pour ajouter/modifier */}
          {showAddModal && (
            <EventModal
              onSave={handleAddEvent}
              onClose={() => setShowAddModal(false)}
            />
          )}

          {editingEvent && (
            <EventModal
              event={editingEvent}
              onSave={handleSaveEvent}
              onClose={() => setEditingEvent(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// Modal pour événements
const EventModal = ({ event, onSave, onClose }) => {
  const [formData, setFormData] = useState(event || {
    title: '',
    description: '',
    date: '',
    location: '',
    type: 'concert',
    status: 'planifié'
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
          {event ? 'Modifier l\'événement' : 'Nouvel événement'}
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
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              style={{
                width: "100%",
                padding: "8px 12px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                outline: "none",
                resize: "vertical",
                minHeight: "80px",
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
              rows="3"
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
              Date
            </label>
            <input
              type="datetime-local"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
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
              Lieu
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
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
                Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
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
                <option value="concert">Concert</option>
                <option value="repetition">Répétition</option>
                <option value="rencontre">Rencontre</option>
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
                <option value="planifié">Planifié</option>
                <option value="confirme">Confirmé</option>
                <option value="annule">Annulé</option>
                <option value="termine">Terminé</option>
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
              {event ? 'Sauvegarder' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventManagement;
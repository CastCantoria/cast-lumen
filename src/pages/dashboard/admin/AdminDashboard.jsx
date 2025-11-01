// src/pages/dashboard/admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, deleteDoc, addDoc, query, where, orderBy } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useAuth } from '../../../contexts/AuthContext';
import { createTestMembers, getAllMembers } from '../../../services/memberService';

const AdminDashboard = () => {
  const { userProfile } = useAuth();
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [editingMember, setEditingMember] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMember, setNewMember] = useState({
    firstName: '',
    lastName: '',
    email: '',
    userType: 'member',
    role: '',
    vocalRange: '',
    status: 'pending',
    phone: '',
    address: ''
  });

  // Charger les membres depuis Firestore
  useEffect(() => {
    loadMembers();
  }, []);

  // Filtrer les membres en fonction de la recherche
  useEffect(() => {
    const filtered = members.filter(member => 
      member.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.status?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMembers(filtered);
    setCurrentPage(1);
  }, [searchTerm, members]);

  const loadMembers = async () => {
    try {
      setLoading(true);
      const result = await getAllMembers();
      if (result.success) {
        setMembers(result.members);
        setFilteredMembers(result.members);
      }
    } catch (error) {
      console.error('Erreur chargement membres:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour créer des membres de test
  const handleCreateTestMembers = async () => {
    try {
      setLoading(true);
      const result = await createTestMembers();
      if (result.success) {
        alert(result.message);
        await loadMembers(); // Recharger la liste des membres
      } else {
        alert('Erreur lors de la création des membres de test: ' + result.error);
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Une erreur est survenue lors de la création des membres de test.');
    } finally {
      setLoading(false);
    }
  };

  // Fonction de debug
  const debugFirestore = async () => {
    try {
      console.log('🔍 Debug Firestore...');
      
      const allUsersQuery = query(collection(db, 'users'));
      const allUsersSnapshot = await getDocs(allUsersQuery);
      
      console.log('📊 Total users:', allUsersSnapshot.size);
      
      allUsersSnapshot.forEach((doc) => {
        console.log('User:', doc.id, doc.data());
      });

      const membersQuery = query(
        collection(db, 'users'),
        where('userType', '==', 'member')
      );
      const membersSnapshot = await getDocs(membersQuery);
      
      console.log('🎵 Members found:', membersSnapshot.size);
      membersSnapshot.forEach((doc) => {
        console.log('Member:', doc.id, doc.data());
      });

    } catch (error) {
      console.error('❌ Erreur debug:', error);
    }
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMembers = filteredMembers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);

  // Gestion de l'édition
  const handleEditClick = (member) => {
    setEditingMember(member.id);
    setEditFormData(member);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveClick = async (memberId) => {
    try {
      await updateDoc(doc(db, 'users', memberId), {
        ...editFormData,
        updatedAt: new Date().toISOString()
      });
      
      setMembers(prev => prev.map(member => 
        member.id === memberId ? { ...editFormData, id: memberId } : member
      ));
      
      setEditingMember(null);
      setEditFormData({});
    } catch (error) {
      console.error('❌ Erreur mise à jour membre:', error);
    }
  };

  const handleCancelClick = () => {
    setEditingMember(null);
    setEditFormData({});
  };

  // Confirmation d'inscription
  const handleConfirmMember = async (memberId) => {
    try {
      await updateDoc(doc(db, 'users', memberId), {
        status: 'active',
        updatedAt: new Date().toISOString()
      });
      
      setMembers(prev => prev.map(member => 
        member.id === memberId ? { ...member, status: 'active' } : member
      ));
    } catch (error) {
      console.error('❌ Erreur confirmation membre:', error);
    }
  };

  // Suppression d'un membre
  const handleDeleteMember = async (memberId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce membre ?')) {
      try {
        await deleteDoc(doc(db, 'users', memberId));
        setMembers(prev => prev.filter(member => member.id !== memberId));
      } catch (error) {
        console.error('❌ Erreur suppression membre:', error);
      }
    }
  };

  // Ajout d'un nouveau membre
  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      const memberData = {
        ...newMember,
        displayName: `${newMember.firstName} ${newMember.lastName}`.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await addDoc(collection(db, 'users'), memberData);
      await loadMembers();
      setShowAddForm(false);
      setNewMember({
        firstName: '',
        lastName: '',
        email: '',
        userType: 'member',
        role: '',
        vocalRange: '',
        status: 'pending',
        phone: '',
        address: ''
      });
    } catch (error) {
      console.error('❌ Erreur ajout membre:', error);
    }
  };

  // Export CSV
  const exportToCSV = () => {
    const headers = ['Prénom', 'Nom', 'Email', 'Rôle vocal', 'Statut', 'Téléphone', 'Adresse', 'Date création'];
    const csvData = filteredMembers.map(member => [
      member.firstName || '',
      member.lastName || '',
      member.email || '',
      member.role || member.vocalRange || '',
      member.status || '',
      member.phone || '',
      member.address || '',
      member.createdAt ? new Date(member.createdAt).toLocaleDateString('fr-FR') : ''
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(field => `"${field}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `membres-cast-cantoria-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Pagination
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Chargement des membres...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Membres</h1>
          <p className="text-gray-600 mt-2">
            Administration des membres choristes - {filteredMembers.length} membre(s) trouvé(s)
          </p>
        </div>

        {members.length === 0 ? (
          <div className="text-center py-12 bg-white shadow rounded-lg">
            <h2 className="text-4xl mb-4">🎵</h2>
            <p className="text-xl text-gray-600 mb-4">Aucun membre trouvé</p>
            <p className="text-gray-500 mb-8">
              Commencez par ajouter des membres ou créez des membres de test pour démarrer.
            </p>
            <div className="space-x-4">
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Ajouter un membre
              </button>
              <button
                onClick={handleCreateTestMembers}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                disabled={loading}
              >
                {loading ? 'Création en cours...' : 'Créer membres test'}
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Barre d'outils */}
            <div className="bg-white shadow rounded-lg p-6 mb-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                {/* Recherche */}
                <div className="flex-1 w-full sm:max-w-md">
                  <input
                    type="text"
                    placeholder="Rechercher un membre..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cast-gold focus:border-cast-gold"
                  />
                </div>

                {/* Boutons d'action */}
                <div className="flex gap-3 flex-wrap">
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    <span>➕</span>
                    Ajouter un membre
                  </button>
                  <button
                    onClick={exportToCSV}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <span>📊</span>
                    Exporter CSV
                  </button>
                  {/* Bouton pour créer des membres de test */}
                  <button
                    onClick={handleCreateTestMembers}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                  >
                    <span>🎵</span>
                    Créer membres test
                  </button>
                  {/* Bouton debug (optionnel) */}
                  <button
                    onClick={debugFirestore}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
                  >
                    <span>🐛</span>
                    Debug
                  </button>
                </div>
              </div>
            </div>

            {/* Formulaire d'ajout */}
            {showAddForm && (
              <div className="bg-white shadow rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">Ajouter un nouveau membre</h3>
                <form onSubmit={handleAddMember} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Prénom *"
                    value={newMember.firstName}
                    onChange={(e) => setNewMember(prev => ({ ...prev, firstName: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cast-gold"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Nom *"
                    value={newMember.lastName}
                    onChange={(e) => setNewMember(prev => ({ ...prev, lastName: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cast-gold"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email *"
                    value={newMember.email}
                    onChange={(e) => setNewMember(prev => ({ ...prev, email: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cast-gold"
                    required
                  />
                  <select
                    value={newMember.role}
                    onChange={(e) => setNewMember(prev => ({ ...prev, role: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cast-gold"
                  >
                    <option value="">Sélectionner un rôle vocal</option>
                    <option value="Soprano">Soprano</option>
                    <option value="Alto">Alto</option>
                    <option value="Ténor">Ténor</option>
                    <option value="Basse">Basse</option>
                  </select>
                  <input
                    type="tel"
                    placeholder="Téléphone"
                    value={newMember.phone}
                    onChange={(e) => setNewMember(prev => ({ ...prev, phone: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cast-gold"
                  />
                  <input
                    type="text"
                    placeholder="Adresse"
                    value={newMember.address}
                    onChange={(e) => setNewMember(prev => ({ ...prev, address: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cast-gold"
                  />
                  <div className="md:col-span-2 flex gap-3 justify-end">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-cast-green text-white rounded-lg hover:bg-cast-gold hover:text-cast-green transition-colors"
                    >
                      Ajouter le membre
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Tableau des membres */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Membre
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rôle vocal
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date d'inscription
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentMembers.map((member) => (
                      <tr key={member.id} className="hover:bg-gray-50">
                        {editingMember === member.id ? (
                          // Mode édition
                          <>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex flex-col gap-2">
                                <input
                                  type="text"
                                  name="firstName"
                                  value={editFormData.firstName || ''}
                                  onChange={handleEditChange}
                                  className="px-2 py-1 border border-gray-300 rounded text-sm"
                                  placeholder="Prénom"
                                />
                                <input
                                  type="text"
                                  name="lastName"
                                  value={editFormData.lastName || ''}
                                  onChange={handleEditChange}
                                  className="px-2 py-1 border border-gray-300 rounded text-sm"
                                  placeholder="Nom"
                                />
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <input
                                type="email"
                                name="email"
                                value={editFormData.email || ''}
                                onChange={handleEditChange}
                                className="px-2 py-1 border border-gray-300 rounded text-sm w-full"
                                placeholder="Email"
                              />
                              <input
                                type="tel"
                                name="phone"
                                value={editFormData.phone || ''}
                                onChange={handleEditChange}
                                className="px-2 py-1 border border-gray-300 rounded text-sm w-full mt-1"
                                placeholder="Téléphone"
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <select
                                name="role"
                                value={editFormData.role || ''}
                                onChange={handleEditChange}
                                className="px-2 py-1 border border-gray-300 rounded text-sm w-full"
                              >
                                <option value="">Sélectionner</option>
                                <option value="Soprano">Soprano</option>
                                <option value="Alto">Alto</option>
                                <option value="Ténor">Ténor</option>
                                <option value="Basse">Basse</option>
                              </select>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <select
                                name="status"
                                value={editFormData.status || ''}
                                onChange={handleEditChange}
                                className="px-2 py-1 border border-gray-300 rounded text-sm w-full"
                              >
                                <option value="pending">En attente</option>
                                <option value="active">Actif</option>
                                <option value="inactive">Inactif</option>
                              </select>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {member.createdAt ? new Date(member.createdAt).toLocaleDateString('fr-FR') : '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleSaveClick(member.id)}
                                  className="text-green-600 hover:text-green-900"
                                  title="Enregistrer"
                                >
                                  💾
                                </button>
                                <button
                                  onClick={handleCancelClick}
                                  className="text-gray-600 hover:text-gray-900"
                                  title="Annuler"
                                >
                                  ❌
                                </button>
                              </div>
                            </td>
                          </>
                        ) : (
                          // Mode affichage
                          <>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 bg-cast-green rounded-full flex items-center justify-center text-white font-bold">
                                  {member.firstName?.charAt(0) || 'M'}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {member.firstName} {member.lastName}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{member.email}</div>
                              {member.phone && (
                                <div className="text-sm text-gray-500">{member.phone}</div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                {member.role || member.vocalRange || 'Non défini'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                member.status === 'active' 
                                  ? 'bg-green-100 text-green-800' 
                                  : member.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {member.status === 'active' ? 'Actif' : member.status === 'pending' ? 'En attente' : 'Inactif'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {member.createdAt ? new Date(member.createdAt).toLocaleDateString('fr-FR') : '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex gap-3">
                                <button
                                  onClick={() => handleEditClick(member)}
                                  className="text-blue-600 hover:text-blue-900"
                                  title="Éditer"
                                >
                                  ✏️
                                </button>
                                {member.status === 'pending' && (
                                  <button
                                    onClick={() => handleConfirmMember(member.id)}
                                    className="text-green-600 hover:text-green-900"
                                    title="Confirmer l'inscription"
                                  >
                                    ✅
                                  </button>
                                )}
                                <button
                                  onClick={() => handleDeleteMember(member.id)}
                                  className="text-red-600 hover:text-red-900"
                                  title="Supprimer"
                                >
                                  🗑️
                                </button>
                              </div>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                  <div className="flex-1 flex justify-between items-center">
                    <div className="text-sm text-gray-700">
                      Affichage de <span className="font-medium">{indexOfFirstItem + 1}</span> à{' '}
                      <span className="font-medium">
                        {Math.min(indexOfLastItem, filteredMembers.length)}
                      </span>{' '}
                      sur <span className="font-medium">{filteredMembers.length}</span> résultats
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => paginate(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                      >
                        Précédent
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                          key={page}
                          onClick={() => paginate(page)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md ${
                            currentPage === page
                              ? 'bg-cast-green text-white border-cast-green'
                              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                      >
                        Suivant
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Message "aucun membre trouvé" si filtre ne retourne rien */}
              {currentMembers.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">🎵</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun membre trouvé</h3>
                  <p className="text-gray-500 mb-6">
                    Commencez par ajouter des membres ou créez des membres de test pour démarrer.
                  </p>
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={() => setShowAddForm(true)}
                      className="px-4 py-2 bg-cast-green text-white rounded-lg hover:bg-cast-gold hover:text-cast-green transition-colors"
                    >
                      Ajouter un membre
                    </button>
                    <button
                      onClick={handleCreateTestMembers}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Créer membres test
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
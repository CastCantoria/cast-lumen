import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Search, UserPlus, Mail, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import SubPageHeader from '../layout/SubPageHeader';
import CollectionsBrowser from './CollectionsBrowser';
import { useAuthorization } from '../../hooks/useAuthorization';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCollections, setShowCollections] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMember, setNewMember] = useState({ displayName: '', email: '', role: 'registered-user', isActive: true });
  const { isSuperAdmin, hasMinRole } = useAuthorization();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [editingId, setEditingId] = useState(null);
  const [editFields, setEditFields] = useState({});

  useEffect(() => {
    const loadUsers = async () => {
      try {
        // Try to load both 'users' and 'members' collections and merge them.
        const [usersSnap, membersSnap] = await Promise.all([
          getDocs(collection(db, 'users')).catch(() => ({ docs: [] })),
          getDocs(collection(db, 'members')).catch(() => ({ docs: [] })),
        ]);

        const usersFetched = usersSnap.docs.map(d => ({ __collection: 'users', id: d.id, ...d.data() }));
        const membersFetched = membersSnap.docs.map(d => ({ __collection: 'members', id: d.id, ...d.data() }));

        // Merge and dedupe by email (preferred) or id
        const combined = [...usersFetched, ...membersFetched];
        const seen = new Map();
        for (const u of combined) {
          const key = (u.email || u.uid || u.id || '').toLowerCase();
          if (!seen.has(key)) seen.set(key, u);
        }

        const merged = Array.from(seen.values());
        setUsers(merged);
      } catch (err) {
        console.error('Erreur chargement utilisateurs:', err);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  const handleRoleChange = (userId, newRole) => {
    setUsers(prev => prev.map(u => (u.id === userId ? { ...u, role: newRole } : u)));
  };

  const handleSearch = (term) => setSearchTerm(term);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const filtered = users.filter(user =>
    (!searchTerm) ||
    (user.displayName && user.displayName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalRows = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / rowsPerPage));
  const paged = filtered.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  return (
    <div>
      <SubPageHeader title="Gestion des Membres" />
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-2">
            {/* Add member button for admins/super-admins */}
            {(isSuperAdmin || hasMinRole('admin')) && (
              <>
                <button onClick={() => setShowAddMember(s => !s)} className="px-3 py-1 border rounded bg-indigo-50">{showAddMember ? 'Annuler' : 'Ajouter un membre'}</button>
              </>
            )}
          <button onClick={() => setShowCollections(prev => !prev)} className="px-3 py-1 border rounded">
            {showCollections ? 'Masquer collections' : 'Afficher toutes les collections'}
          </button>
        </div>
          {showCollections && (
            <CollectionsBrowser />
          )}

          {showAddMember && (
            <div className="bg-white p-4 rounded shadow-sm border">
              <h3 className="font-medium mb-2">Ajouter un membre</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                <input placeholder="Nom complet" value={newMember.displayName} onChange={(e) => setNewMember(n => ({ ...n, displayName: e.target.value }))} className="border p-2 rounded" />
                <input placeholder="Email" value={newMember.email} onChange={(e) => setNewMember(n => ({ ...n, email: e.target.value }))} className="border p-2 rounded" />
                <select value={newMember.role} onChange={(e) => setNewMember(n => ({ ...n, role: e.target.value }))} className="border p-2 rounded">
                  {!isSuperAdmin && <option value="registered-user">Membre</option>}
                  {isSuperAdmin && <option value="super-admin">Super Admin</option>}
                  <option value="admin">Admin</option>
                  <option value="core-team">Core Team</option>
                  <option value="registered-user">Membre</option>
                </select>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2"><input type="checkbox" checked={newMember.isActive} onChange={(e) => setNewMember(n => ({ ...n, isActive: e.target.checked }))} /> Actif</label>
                  <button onClick={async () => {
                    try {
                      const docRef = await addDoc(collection(db, 'users'), newMember);
                      setUsers(prev => [{ id: docRef.id, ...newMember }, ...prev]);
                      setShowAddMember(false);
                      setNewMember({ displayName: '', email: '', role: 'registered-user', isActive: true });
                    } catch (err) {
                      console.error('Erreur ajout membre:', err);
                      alert('Échec ajout membre: ' + (err.message || err));
                    }
                  }} className="bg-green-600 text-white px-3 py-1 rounded">Créer</button>
                </div>
              </div>
            </div>
          )}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Membres ({users.length})</h2>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Rechercher un membre..."
              className="px-3 py-2 border rounded"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto bg-white rounded-lg border p-2">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Nom</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Prénom</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Email</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Statut</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Rôle</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Date d'inscription</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.map(user => {
                const createdAt = user.createdAt ? (user.createdAt.toDate ? user.createdAt.toDate() : new Date(user.createdAt)) : null;
                const firstName = user.firstName || user.givenName || (user.displayName ? user.displayName.split(' ')[0] : '');
                const lastName = user.lastName || user.familyName || (user.displayName ? user.displayName.split(' ').slice(1).join(' ') : '');
                const isEditing = editingId === user.id;
                return (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="px-3 py-2 align-top text-sm">
                      {isEditing ? (
                        <input className="border p-1 rounded w-36" value={editFields.firstName ?? firstName} onChange={(e) => setEditFields(f => ({ ...f, firstName: e.target.value }))} />
                      ) : (firstName)}
                    </td>
                    <td className="px-3 py-2 align-top text-sm">
                      {isEditing ? (
                        <input className="border p-1 rounded w-36" value={editFields.lastName ?? lastName} onChange={(e) => setEditFields(f => ({ ...f, lastName: e.target.value }))} />
                      ) : (lastName)}
                    </td>
                    <td className="px-3 py-2 align-top text-sm">
                      {isEditing ? (
                        <input className="border p-1 rounded w-56" value={editFields.email ?? user.email} onChange={(e) => setEditFields(f => ({ ...f, email: e.target.value }))} />
                      ) : (user.email)}
                    </td>
                    <td className="px-3 py-2 align-top text-sm">
                      {isEditing ? (
                        <label className="flex items-center gap-2"><input type="checkbox" checked={!!(editFields.isActive ?? user.isActive)} onChange={(e) => setEditFields(f => ({ ...f, isActive: e.target.checked }))} /> Actif</label>
                      ) : (
                        <span className={"inline-flex items-center px-3 py-1 rounded-full text-sm font-medium " + (user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800')}>
                          {user.isActive ? 'Actif' : 'Inactif'}
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2 align-top text-sm">
                      {isEditing ? (
                        <select className="border p-1 rounded" value={editFields.role ?? user.role} onChange={(e) => setEditFields(f => ({ ...f, role: e.target.value }))}>
                          <option value="super-admin">Super Admin</option>
                          <option value="admin">Admin</option>
                          <option value="core-team">Core Team</option>
                          <option value="registered-user">Membre</option>
                          <option value="soprano">Soprano</option>
                          <option value="alto">Alto</option>
                          <option value="tenor">Tenor</option>
                          <option value="bass">Bass</option>
                        </select>
                      ) : (user.role || '')}
                    </td>
                    <td className="px-3 py-2 align-top text-sm">{createdAt ? createdAt.toLocaleString() : '—'}</td>
                    <td className="px-3 py-2 align-top text-sm">
                      {isEditing ? (
                        <div className="flex gap-2">
                          <button className="bg-green-600 text-white px-2 py-1 rounded" onClick={async () => {
                            try {
                              const updated = {
                                firstName: editFields.firstName,
                                lastName: editFields.lastName,
                                email: editFields.email,
                                role: editFields.role,
                                isActive: !!editFields.isActive
                              };
                              await updateDoc(doc(db, 'users', user.id), updated);
                              try { await updateDoc(doc(db, 'members', user.id), updated); } catch (e) { /* ignore if missing */ }
                              // update local state
                              setUsers(prev => prev.map(u => u.id === user.id ? { ...u, ...updated } : u));
                              setEditingId(null);
                              setEditFields({});
                            } catch (err) {
                              console.error('Erreur sauvegarde utilisateur:', err);
                              alert('Échec sauvegarde: ' + (err.message || err));
                            }
                          }}>Enregistrer</button>
                          <button className="px-2 py-1 border rounded" onClick={() => { setEditingId(null); setEditFields({}); }}>Annuler</button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button className="px-2 py-1 border rounded" onClick={() => { setEditingId(user.id); setEditFields({ firstName, lastName, email: user.email, role: user.role, isActive: !!user.isActive }); }}>Éditer</button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Pagination controls */}
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <label className="text-sm">Lignes par page:</label>
              <select value={rowsPerPage} onChange={e => { const v = Number(e.target.value); setRowsPerPage(v); setPage(0); }} className="border rounded px-2 py-1">
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={50}>50</option>
                <option value={0}>Tout</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} className="px-2 py-1 border rounded">Préc</button>
              <div className="text-sm">{rowsPerPage === 0 ? 1 : page + 1} / {rowsPerPage === 0 ? 1 : totalPages} ({totalRows} lignes)</div>
              <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1 || rowsPerPage === 0} className="px-2 py-1 border rounded">Suiv</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
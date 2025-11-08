import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import SubPageHeader from '../../components/layout/SubPageHeader';

const normalizeRoleParam = (param) => {
  if (!param) return param;
  const p = param.toLowerCase();
  // Common plural -> singular mappings
  if (p.endsWith('s')) return p.replace(/s$/, '');
  return p;
};

const RoleListPage = () => {
  const { role } = useParams();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const roleKey = normalizeRoleParam(role);
        const q = query(collection(db, 'users'), where('role', '==', roleKey));
        const snap = await getDocs(q);
        setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error('Erreur chargement users par rôle:', err);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [role]);

  const title = `Liste des ${role || 'users'}`;

  return (
    <div>
      <SubPageHeader title={title} />
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4">{title}</h2>
        {loading ? (
          <div className="text-gray-600">Chargement...</div>
        ) : (
          <div className="bg-white rounded-lg border overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-3 py-2 text-left text-sm">Nom</th>
                  <th className="px-3 py-2 text-left text-sm">Email</th>
                  <th className="px-3 py-2 text-left text-sm">Rôle</th>
                  <th className="px-3 py-2 text-left text-sm">Inscription</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className="border-b hover:bg-gray-50">
                    <td className="px-3 py-2">{u.displayName || u.firstName || ''}</td>
                    <td className="px-3 py-2">{u.email}</td>
                    <td className="px-3 py-2">{u.role}</td>
                    <td className="px-3 py-2">{u.createdAt?.toDate ? u.createdAt.toDate().toLocaleString() : (u.createdAt ? new Date(u.createdAt).toLocaleString() : '—')}</td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr><td colSpan={4} className="p-6 text-center text-gray-500">Aucun utilisateur trouvé pour ce rôle.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoleListPage;

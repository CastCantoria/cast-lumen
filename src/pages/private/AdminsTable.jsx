import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getApp } from 'firebase/app';

const AdminsTable = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdmins = async () => {
      const db = getFirestore(getApp());
      const adminsCollection = collection(db, 'admins');
      const snapshot = await getDocs(adminsCollection);
      const adminsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAdmins(adminsList);
      setLoading(false);
    };

    fetchAdmins();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500">Chargement...</p>;
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Liste des Administrateurs</h2>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 px-4 py-2">Nom</th>
            <th className="border border-gray-300 px-4 py-2">Email</th>
            <th className="border border-gray-300 px-4 py-2">Rôle</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((admin, index) => (
            <tr key={admin.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="border border-gray-300 px-4 py-2">{admin.name}</td>
              <td className="border border-gray-300 px-4 py-2">{admin.email}</td>
              <td className="border border-gray-300 px-4 py-2">{admin.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminsTable;

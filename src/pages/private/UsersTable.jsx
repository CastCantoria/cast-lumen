import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getApp } from 'firebase/app';

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      const db = getFirestore(getApp());
      const usersCollection = collection(db, 'users');
      const snapshot = await getDocs(usersCollection);
      const usersList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersList);
      setLoading(false);
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500">Chargement...</p>;
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Liste des Utilisateurs</h2>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 px-4 py-2">Nom</th>
            <th className="border border-gray-300 px-4 py-2">Email</th>
            <th className="border border-gray-300 px-4 py-2">Rôle</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="border border-gray-300 px-4 py-2">{user.name}</td>
              <td className="border border-gray-300 px-4 py-2">{user.email}</td>
              <td className="border border-gray-300 px-4 py-2">{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;

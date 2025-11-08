import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getApp } from 'firebase/app';

const MembersTable = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      const db = getFirestore(getApp());
      const membersCollection = collection(db, 'members');
      const snapshot = await getDocs(membersCollection);
      const membersList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMembers(membersList);
      setLoading(false);
    };

    fetchMembers();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500">Chargement...</p>;
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Liste des Membres</h2>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 px-4 py-2">Nom</th>
            <th className="border border-gray-300 px-4 py-2">Email</th>
            <th className="border border-gray-300 px-4 py-2">Statut</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member, index) => (
            <tr key={member.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="border border-gray-300 px-4 py-2">{member.name}</td>
              <td className="border border-gray-300 px-4 py-2">{member.email}</td>
              <td className="border border-gray-300 px-4 py-2">{member.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MembersTable;

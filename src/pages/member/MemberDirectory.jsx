import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const MemberDirectory = () => {
  const [members] = React.useState([
    {
      id: 1,
      name: 'Marie Dupont',
      role: 'Soprano',
      email: 'marie.d@example.com',
      photoUrl: 'https://via.placeholder.com/150',
    },
    {
      id: 2, 
      name: 'Jean Martin',
      role: 'Ténor',
      email: 'jean.m@example.com',
      photoUrl: 'https://via.placeholder.com/150',
    },
    // Add more mock data as needed
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Annuaire des Membres</h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {members.map((member) => (
          <div
            key={member.id}
            className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center space-x-4">
              <img
                src={member.photoUrl}
                alt={member.name}
                className="w-16 h-16 rounded-full"
              />
              <div>
                <h2 className="text-lg font-medium text-gray-900">{member.name}</h2>
                <p className="text-sm text-gray-500">{member.role}</p>
              </div>
            </div>
            <div className="mt-4">
              <a
                href={`mailto:${member.email}`}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                {member.email}
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MemberDirectory;
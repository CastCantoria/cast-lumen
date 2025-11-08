import React from 'react';
import { NavLink } from 'react-router-dom';

const links = [
  { to: 'dashboard', label: 'Tableau de bord' },
  { to: 'events', label: 'Événements' },
  { to: 'profile', label: 'Profil' },
  { to: 'attendance', label: 'Présences' },
  { to: 'documents', label: 'Documents' },
  { to: 'messages', label: 'Messages' },
  { to: 'voice-recorder', label: "Enregistreur" },
  { to: 'metronome', label: 'Métronome' },
  { to: 'tuner', label: 'Accordeur' },
  { to: 'community', label: 'Communauté' },
  { to: 'forum', label: 'Forum' },
];

const MemberNavigation = () => {
  return (
    <nav className="w-64 bg-white border-r p-4 hidden md:block">
      <div className="mb-6 text-lg font-bold">Espace membre</div>
      <ul className="space-y-2">
        {links.map((l) => (
          <li key={l.to}>
            <NavLink
              to={l.to}
              className={({ isActive }) =>
                `block px-3 py-2 rounded ${isActive ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`
              }
            >
              {l.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default MemberNavigation;

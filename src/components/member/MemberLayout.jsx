import React from 'react';
import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const MemberLayout = () => {
  const { userProfile } = useAuth();

  const navigation = [
    {
      section: 'Général',
      items: [
        { name: 'Répétitions', to: '/member/rehearsals' },
        { name: 'Événements', to: '/member/events' },
        { name: 'Répertoire', to: '/member/repertoire' },
      ],
    },
    {
      section: 'Outils',
      items: [
        { name: 'Enregistreur', to: '/member/voice-recorder' },
        { name: 'Métronome', to: '/member/metronome' },
        { name: 'Accordeur', to: '/member/tuner' },
      ],
    },
    {
      section: 'Communauté',
      items: [
        { name: 'Forum', to: '/member/forum' },
        { name: 'Annuaire', to: '/member/directory' },
        { name: 'Messages', to: '/member/messages' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg fixed h-full">
          <div className="flex flex-col h-full">
            <div className="flex-1">
              <div className="px-4 py-6 border-b border-gray-200">
                <div className="flex items-center">
                  <img
                    src={userProfile?.photoURL || "https://via.placeholder.com/40"}
                    alt=""
                    className="h-10 w-10 rounded-full"
                  />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700">
                      {userProfile?.displayName}
                    </p>
                    <p className="text-xs font-medium text-gray-500">Membre</p>
                  </div>
                </div>
              </div>

              <nav className="px-4 py-4">
                {navigation.map((section) => (
                  <div key={section.section} className="mb-8">
                    <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {section.section}
                    </h3>
                    <div className="mt-3 space-y-1">
                      {section.items.map((item) => (
                        <Link
                          key={item.name}
                          to={item.to}
                          className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:text-gray-900 hover:bg-gray-50"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </nav>
            </div>

            <div className="p-4 border-t border-gray-200">
              <Link
                to="/settings"
                className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                Paramètres
              </Link>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 ml-64">
          <main className="py-6 px-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default MemberLayout;
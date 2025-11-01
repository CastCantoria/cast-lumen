import React from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import { useAuthorization } from '../../../../hooks/useAuthorization';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { userProfile } = useAuth();
  const { currentRole } = useAuthorization();

  const menuItems = [
    {
      title: "Gestion des Événements",
      items: [
        { to: "/dashboard/admin/events", label: "Liste des Événements" },
        { to: "/dashboard/admin/events/calendar", label: "Calendrier" },
        { to: "/dashboard/admin/events/bookings", label: "Réservations" }
      ]
    },
    {
      title: "Répertoire",
      items: [
        { to: "/dashboard/admin/repertoire", label: "Catalogue" },
        { to: "/dashboard/admin/repertoire/upload", label: "Ajouter Partition" }
      ]
    },
    {
      title: "Médiathèque",
      items: [
        { to: "/dashboard/admin/gallery", label: "Galerie Photos" },
        { to: "/dashboard/admin/media", label: "Média" }
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <header className="mb-8">
        <h1 className="text-2xl font-bold mb-2">
          Tableau de Bord Administrateur
        </h1>
        <p className="text-gray-600">
          Connecté en tant que {userProfile?.displayName} ({currentRole})
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((section, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">{section.title}</h2>
            <div className="space-y-3">
              {section.items.map((item, itemIdx) => (
                <Link
                  key={itemIdx}
                  to={item.to}
                  className="block w-full text-left px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Actions Rapides</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to="/dashboard/admin/events/create"
            className="btn bg-blue-50 hover:bg-blue-100"
          >
            Créer Événement
          </Link>
          <Link
            to="/dashboard/admin/repertoire/upload"
            className="btn bg-green-50 hover:bg-green-100"
          >
            Ajouter Partition
          </Link>
          <Link
            to="/dashboard/admin/gallery/upload"
            className="btn bg-purple-50 hover:bg-purple-100"
          >
            Upload Photos
          </Link>
          <Link
            to="/dashboard/admin/notices"
            className="btn bg-yellow-50 hover:bg-yellow-100"
          >
            Annonces
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
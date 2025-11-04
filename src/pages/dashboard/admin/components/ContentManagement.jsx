import React, { useState } from 'react';
import { usePermissions } from '../../../../services/permissionService';

const ContentManagement = () => {
  const { hasPermission } = usePermissions();
  const [content, setContent] = useState([
    {
      id: 1,
      title: 'Bienvenue à la chorale C.A.S.T.',
      type: 'page',
      status: 'published',
      author: 'Admin Principal',
      lastModified: '2024-01-15',
      views: 142
    },
    {
      id: 2,
      title: 'Calendrier des répétitions 2024',
      type: 'post',
      status: 'published',
      author: 'Gestionnaire',
      lastModified: '2024-01-14',
      views: 89
    },
    {
      id: 3,
      title: 'Nouveau concert annoncé',
      type: 'announcement',
      status: 'draft',
      author: 'Admin Principal',
      lastModified: '2024-01-13',
      views: 0
    }
  ]);

  const [showEditor, setShowEditor] = useState(false);

  if (!hasPermission('content:manage')) {
    return <div>Accès refusé</div>;
  }

  const getTypeColor = (type) => {
    const colors = {
      page: 'bg-blue-100 text-blue-800',
      post: 'bg-green-100 text-green-800',
      announcement: 'bg-purple-100 text-purple-800',
      news: 'bg-orange-100 text-orange-800'
    };
    return colors[type] || colors.post;
  };

  const getStatusColor = (status) => {
    const colors = {
      published: 'bg-green-100 text-green-800',
      draft: 'bg-yellow-100 text-yellow-800',
      archived: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || colors.draft;
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">📝 Gestion du Contenu</h2>
        <button
          onClick={() => setShowEditor(true)}
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          + Nouveau contenu
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-600">{content.length}</div>
          <div className="text-sm text-blue-800">Contenus total</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600">
            {content.filter(c => c.status === 'published').length}
          </div>
          <div className="text-sm text-green-800">Publiés</div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-yellow-600">
            {content.filter(c => c.status === 'draft').length}
          </div>
          <div className="text-sm text-yellow-800">Brouillons</div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-600">
            {content.reduce((acc, item) => acc + item.views, 0)}
          </div>
          <div className="text-sm text-purple-800">Vues totales</div>
        </div>
      </div>

      {/* Liste des contenus */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Titre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Auteur
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dernière modification
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vues
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {content.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {item.title}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(item.type)}`}>
                    {item.type === 'page' ? 'Page' : 
                     item.type === 'post' ? 'Article' : 
                     item.type === 'announcement' ? 'Annonce' : item.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                    {item.status === 'published' ? 'Publié' : 
                     item.status === 'draft' ? 'Brouillon' : 'Archivé'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.author}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.lastModified}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.views}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">
                    Éditer
                  </button>
                  <button className="text-green-600 hover:text-green-900 mr-3">
                    {item.status === 'published' ? 'Dépublier' : 'Publier'}
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Éditeur de contenu */}
      {showEditor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-lg font-bold">Éditeur de contenu</h3>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowEditor(false)}
                  className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors"
                >
                  Annuler
                </button>
                <button className="bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition-colors">
                  Sauvegarder brouillon
                </button>
                <button className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                  Publier
                </button>
              </div>
            </div>
            
            <div className="flex-1 p-6 overflow-auto">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titre
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-medium"
                    placeholder="Titre de votre contenu..."
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type de contenu
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="post">Article</option>
                      <option value="page">Page</option>
                      <option value="announcement">Annonce</option>
                      <option value="news">Actualité</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Statut
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="draft">Brouillon</option>
                      <option value="published">Publié</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contenu
                  </label>
                  <textarea
                    rows={15}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Commencez à rédiger votre contenu..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Extrait
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Court résumé de votre contenu..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentManagement;
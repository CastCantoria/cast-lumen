// src/pages/dashboard/admin/content/ContentDashboard.jsx
import React, { useState, useEffect } from 'react';

const ContentDashboard = () => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setContent([
        {
          id: '1',
          title: 'Bienvenue sur C.A.S.T.',
          type: 'article',
          status: 'published',
          category: 'news',
          views: 150,
          likes: 25,
          createdAt: new Date('2024-01-15')
        },
        {
          id: '2',
          title: 'Guide du nouveau membre',
          type: 'tutorial',
          status: 'draft',
          category: 'chorale',
          views: 0,
          likes: 0,
          createdAt: new Date('2024-01-20')
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'archived': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'article': return '📝';
      case 'news': return '📰';
      case 'tutorial': return '🎓';
      case 'announcement': return '📢';
      default: return '📄';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div className="flex items-center mb-4 sm:mb-0">
          <span className="text-2xl mr-3">📝</span>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Gestion du Contenu</h2>
            <p className="text-gray-600">{content.length} élément(s) de contenu</p>
          </div>
        </div>
        
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center">
          <span className="mr-2">+</span>
          Nouveau Contenu
        </button>
      </div>

      <div className="space-y-4">
        {content.map((item) => (
          <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
              <div className="flex items-start space-x-3 mb-3 sm:mb-0">
                <div className="text-2xl mt-1">
                  {getTypeIcon(item.type)}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="text-xs text-gray-500 capitalize">{item.type}</span>
                    <span className="text-xs text-gray-500">•</span>
                    <span className="text-xs text-gray-500 capitalize">{item.category}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                  {item.status === 'published' ? 'Publié' : 
                   item.status === 'draft' ? 'Brouillon' : 'Archivé'}
                </span>
                
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <span>👁️ {item.views}</span>
                  <span>❤️ {item.likes}</span>
                </div>
                
                <div className="flex space-x-1">
                  <button className="p-1 text-blue-600 hover:text-blue-800" title="Modifier">
                    ✏️
                  </button>
                  <button className="p-1 text-red-600 hover:text-red-800" title="Supprimer">
                    🗑️
                  </button>
                </div>
              </div>
            </div>
            
            <div className="text-xs text-gray-500 mt-2">
              Créé le: {item.createdAt.toLocaleDateString('fr-FR')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContentDashboard;
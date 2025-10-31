import React, { useState } from 'react';

const ArticlePublisher = () => {
  const [articles, setArticles] = useState([
    {
      id: 1,
      title: 'Nouveau Concert Annoncé',
      content: 'Nous sommes ravis de vous annoncer notre prochain concert...',
      author: 'Admin CAST',
      publishDate: '2024-01-15',
      status: 'published'
    }
  ]);

  const [newArticle, setNewArticle] = useState({
    title: '',
    content: '',
    category: 'actualites'
  });

  const handlePublish = (e) => {
    e.preventDefault();
    const article = {
      id: articles.length + 1,
      ...newArticle,
      author: 'Admin CAST',
      publishDate: new Date().toISOString().split('T')[0],
      status: 'published'
    };

    setArticles(prev => [...prev, article]);
    setNewArticle({ title: '', content: '', category: 'actualites' });
    alert('Article publié avec succès!');
  };

  const handleSaveDraft = () => {
    const article = {
      id: articles.length + 1,
      ...newArticle,
      author: 'Admin CAST',
      publishDate: new Date().toISOString().split('T')[0],
      status: 'draft'
    };

    setArticles(prev => [...prev, article]);
    setNewArticle({ title: '', content: '', category: 'actualites' });
    alert('Brouillon sauvegardé!');
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Publication d'Articles</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Éditeur d'article */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Nouvel Article</h3>
          
          <form onSubmit={handlePublish} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Titre
              </label>
              <input
                type="text"
                value={newArticle.title}
                onChange={(e) => setNewArticle(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Titre de l'article"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Catégorie
              </label>
              <select
                value={newArticle.category}
                onChange={(e) => setNewArticle(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="actualites">Actualités</option>
                <option value="concerts">Concerts</option>
                <option value="repetitions">Répétitions</option>
                <option value="communique">Communiqué</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contenu
              </label>
              <textarea
                value={newArticle.content}
                onChange={(e) => setNewArticle(prev => ({ ...prev, content: e.target.value }))}
                rows="8"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Contenu de l'article..."
                required
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition-colors"
              >
                Publier
              </button>
              <button
                type="button"
                onClick={handleSaveDraft}
                className="bg-gray-600 text-white py-2 px-6 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Sauvegarder le brouillon
              </button>
            </div>
          </form>
        </div>

        {/* Liste des articles */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Articles ({articles.length})
          </h3>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {articles.map(article => (
              <div key={article.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-800">{article.title}</h4>
                  <span className={`text-xs px-2 py-1 rounded ${
                    article.status === 'published' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {article.status === 'published' ? 'Publié' : 'Brouillon'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {article.content}
                </p>
                <div className="text-xs text-gray-500">
                  Par {article.author} • {article.publishDate}
                </div>
              </div>
            ))}
            
            {articles.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Aucun article publié
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticlePublisher;
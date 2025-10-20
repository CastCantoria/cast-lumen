// src/pages/public/Blog.jsx
import React, { useState } from 'react';
import { Calendar, User, Clock, Tag, Search } from 'lucide-react';

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');

  const blogPosts = [
    {
      id: 1,
      title: "L'Art du Chant Sacré à Travers les Siècles",
      excerpt: "Exploration des traditions du chant sacré depuis le grégorien jusqu'aux compositions contemporaines...",
      author: "Lucien Emmanuel",
      date: "2024-11-10",
      readTime: "5 min",
      category: "Histoire",
      image: "/images/chorale-1.jpg",
      featured: true
    },
    {
      id: 2,
      title: "Préparer son Audition pour une Chorale Sacrée",
      excerpt: "Conseils et techniques pour réussir son audition et intégrer une chorale de chant sacré...",
      author: "Marie Dubois",
      date: "2024-11-05",
      readTime: "3 min",
      category: "Conseils",
      image: "/images/chorale-2.jpg",
      featured: false
    }
  ];

  const categories = ['Tous', 'Histoire', 'Conseils', 'Spiritualité', 'Concerts', 'Annonces'];

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = searchTerm === '' || 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'Tous' || post.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20">
      {/* Hero Section */}
      <section className="bg-sacred-green text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog & Actualités</h1>
          <p className="text-xl text-golden opacity-90">
            Découvrez nos articles sur le chant sacré, la spiritualité et la vie de la chorale
          </p>
        </div>
      </section>

      {/* Recherche et Filtres */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Barre de recherche */}
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher un article..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sacred-green focus:border-transparent"
              />
            </div>

            {/* Filtres catégories */}
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-sacred-green text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Articles */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Article en vedette */}
          {filteredPosts.find(post => post.featured) && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Article en Vedette</h2>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  <div className="h-64 lg:h-full">
                    <img 
                      src={filteredPosts.find(post => post.featured).image} 
                      alt={filteredPosts.find(post => post.featured).title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-8">
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <span className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {filteredPosts.find(post => post.featured).author}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(filteredPosts.find(post => post.featured).date).toLocaleDateString('fr-FR')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {filteredPosts.find(post => post.featured).readTime}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {filteredPosts.find(post => post.featured).title}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {filteredPosts.find(post => post.featured).excerpt}
                    </p>
                    <button className="bg-sacred-green text-white px-6 py-2 rounded-lg hover:bg-green-800 transition-colors">
                      Lire l'article
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Liste des articles */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts
              .filter(post => !post.featured)
              .map(post => (
                <article key={post.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="flex items-center gap-1 text-sm text-golden font-semibold">
                        <Tag className="w-4 h-4" />
                        {post.category}
                      </span>
                      <span className="text-sm text-gray-500">{post.readTime}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{post.author}</span>
                      <span>{new Date(post.date).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>
                </article>
              ))}
          </div>

          {/* Message vide */}
          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Aucun article trouvé
              </h3>
              <p className="text-gray-500">
                Essayez de modifier vos critères de recherche
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Blog;
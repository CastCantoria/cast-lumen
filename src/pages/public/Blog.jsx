import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'Tous les Articles', icon: '📚' },
    { id: 'actualites', name: 'Actualités', icon: '📢' },
    { id: 'concerts', name: 'Concerts', icon: '🎵' },
    { id: 'spiritualite', name: 'Spiritualité', icon: '🙏' },
    { id: 'temoignages', name: 'Témoignages', icon: '👥' },
    { id: 'musique', name: 'Musique', icon: '🎼' }
  ];

  const blogPosts = [
    {
      id: 1,
      title: "Notre Concert de Noël : Une Nuit Magique",
      excerpt: "Retour sur notre célébration de Noël 2023 à la Cathédrale d'Andohalo...",
      category: "concerts",
      date: "26 Décembre 2023",
      author: "Père Lucien",
      image: "/images/concert1.jpg",
      readTime: "5 min",
      featured: true
    },
    {
      id: 2,
      title: "La Musique Sacrée : Pont Entre Ciel et Terre",
      excerpt: "Exploration de la dimension spirituelle de la musique sacrée à travers les siècles...",
      category: "spiritualite",
      date: "15 Décembre 2023",
      author: "Dr. Marie Rakoto",
      image: "/images/inspiration/inspiration2.jpg",
      readTime: "8 min",
      featured: true
    },
    {
      id: 3,
      title: "Témoignage : Mon Parcours à C.A.S.T.",
      excerpt: "Jean nous partage son expérience de 3 ans au sein de la chorale...",
      category: "temoignages",
      date: "8 Décembre 2023",
      author: "Jean R.",
      image: "/images/pcast01.jpg",
      readTime: "4 min",
      featured: false
    },
    {
      id: 4,
      title: "Préparer un Concert : Dans les Coulisses",
      excerpt: "Découvrez le travail intense qui précède chaque prestation...",
      category: "musique",
      date: "1 Décembre 2023",
      author: "Sarah M.",
      image: "/images/chorale-2.jpg",
      readTime: "6 min",
      featured: false
    },
    {
      id: 5,
      title: "Nouveaux Membres : Bienvenue !",
      excerpt: "Présentation de nos nouveaux choristes qui ont rejoint C.A.S.T. cet automne...",
      category: "actualites",
      date: "20 Novembre 2023",
      author: "Équipe C.A.S.T.",
      image: "/images/chorale-1.jpg",
      readTime: "3 min",
      featured: false
    },
    {
      id: 6,
      title: "Le Répertoire Baroque : Un Voyage Musical",
      excerpt: "Plongée dans les œuvres baroques qui font vibrer notre chorale...",
      category: "musique",
      date: "10 Novembre 2023",
      author: "Prof. Andriana",
      image: "/images/partition-sacree.jpg",
      readTime: "7 min",
      featured: false
    }
  ];

  const filteredPosts = activeCategory === 'all' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === activeCategory);

  const featuredPost = blogPosts.find(post => post.featured);

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-900 to-red-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6 font-serif">Blog C.A.S.T.</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-orange-100">
            Actualités, réflexions et récits de notre aventure chorale et spirituelle
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/about" 
              className="bg-white text-orange-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Notre Histoire
            </Link>
            <Link 
              to="/events" 
              className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-orange-900 transition"
            >
              Nos Concerts
            </Link>
          </div>
        </div>
      </section>

      {/* Article à la Une */}
      {featuredPost && (
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-8">
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-2/5">
                  <img 
                    src={featuredPost.image} 
                    alt={featuredPost.title}
                    className="w-full h-64 lg:h-full object-cover rounded-2xl shadow-lg"
                  />
                </div>
                <div className="lg:w-3/5">
                  <div className="flex items-center mb-4">
                    <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      À la Une
                    </span>
                    <span className="ml-4 text-gray-500">{featuredPost.date}</span>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">{featuredPost.title}</h2>
                  <p className="text-gray-600 text-lg mb-6">{featuredPost.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-600">
                      <span>✍️ {featuredPost.author}</span>
                      <span className="mx-4">•</span>
                      <span>⏱️ {featuredPost.readTime}</span>
                    </div>
                    <Link 
                      to={`/blog/${featuredPost.id}`}
                      className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition font-semibold"
                    >
                      Lire l'article
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Filtres et Articles */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          {/* Filtres */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Catégories</h2>
            <div className="flex flex-wrap gap-4">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center px-6 py-3 rounded-full font-semibold transition-all ${
                    activeCategory === category.id
                      ? 'bg-orange-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-100 shadow'
                  }`}
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Grille des Articles */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.filter(post => !post.featured).map(post => (
              <article key={post.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="relative">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-white bg-opacity-90 text-orange-600 px-3 py-1 rounded-full text-sm font-semibold">
                    {categories.find(cat => cat.id === post.category)?.name}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center text-gray-500 text-sm mb-3">
                    <span>{post.date}</span>
                    <span className="mx-2">•</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{post.title}</h3>
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 font-semibold">✍️ {post.author}</span>
                    <Link 
                      to={`/blog/${post.id}`}
                      className="text-orange-600 hover:text-orange-700 font-semibold"
                    >
                      Lire la suite →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Aucun article dans cette catégorie</h3>
              <p className="text-gray-600">De nouveaux contenus seront bientôt publiés.</p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-gradient-to-r from-red-600 to-orange-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ne Manquez Aucun Article</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-red-100">
            Inscrivez-vous à notre newsletter pour recevoir nos derniers articles directement dans votre boîte mail
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input 
              type="email" 
              placeholder="Votre email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="bg-white text-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
              S'abonner
            </button>
          </div>
          <p className="text-sm mt-4 text-red-200">
            📧 Pas de spam. Désabonnement à tout moment.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Vous Avez une Histoire à Partager ?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Que vous soyez membre, ancien membre ou simplement passionné, vos témoignages nous intéressent !
          </p>
          <Link 
            to="/contact"
            className="bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-orange-700 transition inline-flex items-center"
          >
            <span>Proposer un Article</span>
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Blog;
import React, { useState } from "react"

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Tous')

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
  ]

  const categories = ['Tous', 'Histoire', 'Conseils', 'Spiritualité', 'Concerts', 'Annonces']

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = searchTerm === '' || 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = selectedCategory === 'Tous' || post.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc", paddingTop: "80px" }}>
      {/* Hero Section */}
      <section style={{ backgroundColor: "#1a5632", color: "white", padding: "64px 0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 16px", textAlign: "center" }}>
          <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", marginBottom: "16px" }}>Blog & Actualités</h1>
          <p style={{ fontSize: "1.25rem", color: "#d4af37", opacity: 0.9 }}>
            Découvrez nos articles sur le chant sacré, la spiritualité et la vie de la chorale
          </p>
        </div>
      </section>

      {/* Recherche et Filtres */}
      <section style={{ padding: "32px 0", backgroundColor: "white" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 16px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", alignItems: "center", justifyContent: "space-between" }}>
            {/* Barre de recherche */}
            <div style={{ position: "relative", flex: 1, maxWidth: "512px" }}>
              <input
                type="text"
                placeholder="Rechercher un article..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ 
                  width: "100%", 
                  paddingLeft: "40px", 
                  paddingRight: "16px", 
                  paddingTop: "12px", 
                  paddingBottom: "12px", 
                  border: "1px solid #d1d5db", 
                  borderRadius: "8px",
                  outline: "none"
                }}
              />
            </div>

            {/* Filtres catégories */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "9999px",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    transition: "background-color 0.2s",
                    backgroundColor: selectedCategory === category ? "#1a5632" : "#f3f4f6",
                    color: selectedCategory === category ? "white" : "#374151"
                  }}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Articles */}
      <section style={{ padding: "48px 0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 16px" }}>
          {/* Liste des articles */}
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
            gap: "32px" 
          }}>
            {filteredPosts.map(post => (
              <article key={post.id} style={{ 
                backgroundColor: "white", 
                borderRadius: "12px", 
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                overflow: "hidden"
              }}>
                <img 
                  src={post.image} 
                  alt={post.title}
                  style={{ width: "100%", height: "192px", objectFit: "cover" }}
                />
                <div style={{ padding: "24px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                    <span style={{ fontSize: "0.875rem", color: "#d4af37", fontWeight: "600" }}>
                      {post.category}
                    </span>
                    <span style={{ fontSize: "0.875rem", color: "#6b7280" }}>{post.readTime}</span>
                  </div>
                  <h3 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#111827", marginBottom: "12px" }}>
                    {post.title}
                  </h3>
                  <p style={{ color: "#6b7280", marginBottom: "16px" }}>
                    {post.excerpt}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.875rem", color: "#6b7280" }}>
                    <span>{post.author}</span>
                    <span>{new Date(post.date).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Message vide */}
          {filteredPosts.length === 0 && (
            <div style={{ textAlign: "center", padding: "48px 0" }}>
              <h3 style={{ fontSize: "1.25rem", fontWeight: "600", color: "#6b7280", marginBottom: "8px" }}>
                Aucun article trouvé
              </h3>
              <p style={{ color: "#6b7280" }}>
                Essayez de modifier vos critères de recherche
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Blog

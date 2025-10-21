import React from "react"
import { HashRouter as Router, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./contexts/NewAuthContext"
import Header from "./components/layout/Header"
import Footer from "./components/layout/Footer"
import Home from "./pages/public/Home"
import About from "./pages/public/About"
import Repertoire from "./pages/public/Repertoire"
import Concerts from "./pages/public/Concerts"
import Galerie from "./pages/public/Galerie"
import Spiritualite from "./pages/public/Spiritualite"
import Blog from "./pages/public/Blog"
import Contact from "./pages/public/Contact"
import Login from "./pages/public/Login"
import Register from "./pages/public/Register"
import Join from "./pages/public/Join"
import JoinSuccess from "./pages/public/JoinSuccess" // ← AJOUTER CET IMPORT
import Dashboard from "./pages/private/Dashboard"
import RequireAuth from "./components/RequireAuth"
import RequireRole from "./components/RequireRole"

function App() {
  return (
    <AuthProvider>
      <Router>
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
          <Header />
          <main style={{ flexGrow: 1 }}>
            <Routes>
              {/* ==================== */}
              {/* ROUTES PUBLIQUES */}
              {/* ==================== */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/repertoire" element={<Repertoire />} />
              <Route path="/events" element={<Concerts />} />
              <Route path="/gallery" element={<Galerie />} />
              <Route path="/spirituality" element={<Spiritualite />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/join" element={<Join />} />
              <Route path="/join/success" element={<JoinSuccess />} /> {/* ← CETTE ROUTE EST MAINTENANT VALIDE */}

              {/* ==================== */}
              {/* ROUTES PRIVÉES - AUTH REQUISE */}
              {/* ==================== */}
              <Route 
                path="/dashboard" 
                element={
                  <RequireAuth>
                    <Dashboard />
                  </RequireAuth>
                } 
              />
              
              <Route 
                path="/profile" 
                element={
                  <RequireAuth>
                    <div style={{ padding: "80px 20px 20px 20px", textAlign: "center" }}>
                      Mon Profil - En construction
                    </div>
                  </RequireAuth>
                } 
              />

              {/* ==================== */}
              {/* ROUTES ADMIN */}
              {/* ==================== */}
              <Route 
                path="/admin" 
                element={
                  <RequireRole role="admin">
                    <div style={{ padding: "80px 20px 20px 20px", textAlign: "center" }}>
                      <h1>Espace Administration</h1>
                      <p>Interface d'administration complète</p>
                      <div style={{ marginTop: '20px' }}>
                        <button 
                          style={{ 
                            margin: '5px', 
                            padding: '10px 20px', 
                            backgroundColor: '#4F46E5', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '5px',
                            cursor: 'pointer'
                          }}
                        >
                          Gérer les Utilisateurs
                        </button>
                        <button 
                          style={{ 
                            margin: '5px', 
                            padding: '10px 20px', 
                            backgroundColor: '#10B981', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '5px',
                            cursor: 'pointer'
                          }}
                        >
                          Gérer les Événements
                        </button>
                        <button 
                          style={{ 
                            margin: '5px', 
                            padding: '10px 20px', 
                            backgroundColor: '#F59E0B', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '5px',
                            cursor: 'pointer'
                          }}
                        >
                          Gérer le Répertoire
                        </button>
                      </div>
                    </div>
                  </RequireRole>
                } 
              />

              <Route 
                path="/admin/users" 
                element={
                  <RequireRole role="admin">
                    <div style={{ padding: "80px 20px 20px 20px", textAlign: "center" }}>
                      Gestion des Utilisateurs - En construction
                    </div>
                  </RequireRole>
                } 
              />

              <Route 
                path="/admin/events" 
                element={
                  <RequireRole role="admin">
                    <div style={{ padding: "80px 20px 20px 20px", textAlign: "center" }}>
                      Gestion des Événements - En construction
                    </div>
                  </RequireRole>
                } 
              />

              {/* ==================== */}
              {/* ROUTES SUPER-ADMIN */}
              {/* ==================== */}
              <Route 
                path="/super-admin" 
                element={
                  <RequireRole role="super-admin">
                    <div style={{ padding: "80px 20px 20px 20px", textAlign: "center" }}>
                      <h1>Espace Super-Admin</h1>
                      <p>Gestion complète de la plateforme</p>
                      <div style={{ marginTop: '20px' }}>
                        <button 
                          style={{ 
                            margin: '5px', 
                            padding: '10px 20px', 
                            backgroundColor: '#7C3AED', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '5px',
                            cursor: 'pointer'
                          }}
                        >
                          Gérer les Admins
                        </button>
                        <button 
                          style={{ 
                            margin: '5px', 
                            padding: '10px 20px', 
                            backgroundColor: '#DC2626', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '5px',
                            cursor: 'pointer'
                          }}
                        >
                          Paramètres Système
                        </button>
                        <button 
                          style={{ 
                            margin: '5px', 
                            padding: '10px 20px', 
                            backgroundColor: '#475569', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '5px',
                            cursor: 'pointer'
                          }}
                        >
                          Logs et Analytics
                        </button>
                      </div>
                    </div>
                  </RequireRole>
                } 
              />

              {/* ==================== */}
              {/* ROUTES MEMBRES */}
              {/* ==================== */}
              <Route 
                path="/member" 
                element={
                  <RequireRole role="membre">
                    <div style={{ padding: "80px 20px 20px 20px", textAlign: "center" }}>
                      Espace Membre - En construction
                    </div>
                  </RequireRole>
                } 
              />

              <Route 
                path="/member/repertoire" 
                element={
                  <RequireRole role="membre">
                    <div style={{ padding: "80px 20px 20px 20px", textAlign: "center" }}>
                      Mon Répertoire Personnel - En construction
                    </div>
                  </RequireRole>
                } 
              />

              <Route 
                path="/member/events" 
                element={
                  <RequireRole role="membre">
                    <div style={{ padding: "80px 20px 20px 20px", textAlign: "center" }}>
                      Mes Événements - En construction
                    </div>
                  </RequireRole>
                } 
              />

              {/* ==================== */}
              {/* ROUTE 404 - PAGE NON TROUVÉE */}
              {/* ==================== */}
              <Route 
                path="*" 
                element={
                  <div style={{ 
                    padding: "100px 20px 20px 20px", 
                    textAlign: "center",
                    minHeight: "60vh",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center"
                  }}>
                    <h1 style={{ fontSize: "4rem", marginBottom: "1rem" }}>404</h1>
                    <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Page Non Trouvée</h2>
                    <p style={{ fontSize: "1.2rem", marginBottom: "2rem", color: "#666" }}>
                      La page que vous recherchez n'existe pas.
                    </p>
                    <button 
                      onClick={() => window.history.back()}
                      style={{
                        padding: "12px 24px",
                        backgroundColor: "#4F46E5",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontSize: "1rem"
                      }}
                    >
                      ← Retour
                    </button>
                  </div>
                } 
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
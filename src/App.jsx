import React from "react"
import { HashRouter as Router, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
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
import Login from "./auth/Login"
import Register from "./pages/public/Register"
import Join from "./pages/public/Join"
import JoinSuccess from "./pages/public/JoinSuccess"
import Dashboard from "./components/Dashboard/Dashboard"
import Profile from "./pages/private/Profile"
import RequireAuth from "./components/RequireAuth"
import RequireRole from "./components/RequireRole"

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
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
              <Route path="/join/success" element={<JoinSuccess />} />

              {/* ==================== */}
              {/* ROUTES PRIVÉES - AUTH REQUISE */}
              {/* ==================== */}
              <Route 
                path="/profile" 
                element={
                  <RequireAuth>
                    <Profile />
                  </RequireAuth>
                } 
              />

              {/* ==================== */}
              {/* DASHBOARD UNIFIÉ - ROUTE PRINCIPALE */}
              {/* ==================== */}
              <Route 
                path="/dashboard" 
                element={
                  <RequireRole role="membre">
                    <Dashboard />
                  </RequireRole>
                } 
              />

              {/* ==================== */}
              {/* DASHBOARD ADMIN/SUPER-ADMIN */}
              {/* ==================== */}
              <Route 
                path="/admin/*" 
                element={
                  <RequireRole role="admin">
                    <Dashboard />
                  </RequireRole>
                } 
              />

              <Route 
                path="/super-admin/*" 
                element={
                  <RequireRole role="super-admin">
                    <Dashboard />
                  </RequireRole>
                } 
              />

              {/* ==================== */}
              {/* ROUTES MEMBRES (ancienne structure - à supprimer progressivement) */}
              {/* ==================== */}
              <Route 
                path="/member/dashboard" 
                element={
                  <RequireRole role="membre">
                    <div className="pt-20 px-4">
                      <div className="max-w-6xl mx-auto py-8">
                        <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
                          <h1 className="text-3xl font-bold text-green-600 mb-2">Espace Membre</h1>
                          <p className="text-gray-600 mb-6">
                            Bienvenue dans votre espace personnel dédié aux membres actifs de CAST.
                          </p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                              <div className="text-3xl mb-3">👤</div>
                              <h3 className="font-semibold text-blue-700 mb-2">Mon Profil</h3>
                              <p className="text-blue-600 text-sm">Gérez vos informations personnelles</p>
                            </div>
                            
                            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                              <div className="text-3xl mb-3">🎭</div>
                              <h3 className="font-semibold text-green-700 mb-2">Mes Événements</h3>
                              <p className="text-green-600 text-sm">Consultez vos participations</p>
                            </div>
                            
                            <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                              <div className="text-3xl mb-3">📜</div>
                              <h3 className="font-semibold text-purple-700 mb-2">Mon Répertoire</h3>
                              <p className="text-purple-600 text-sm">Accédez à vos morceaux</p>
                            </div>
                          </div>

                          <div className="text-center py-6">
                            <p className="text-gray-600 mb-4">
                              🚀 <strong>Nouveau !</strong> Découvrez notre dashboard amélioré
                            </p>
                            <a 
                              href="/#/dashboard"
                              className="bg-cast-green text-white py-2 px-6 rounded-lg hover:bg-cast-gold transition-colors inline-block"
                            >
                              Accéder au nouveau Dashboard
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </RequireRole>
                } 
              />

              <Route 
                path="/member/repertoire" 
                element={
                  <RequireRole role="membre">
                    <div className="pt-20 px-4">
                      <div className="max-w-4xl mx-auto py-8">
                        <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
                          <h1 className="text-3xl font-bold text-green-600 mb-2">Mon Répertoire Personnel</h1>
                          <p className="text-gray-600 mb-6">
                            Gérez votre collection personnelle de morceaux et partitions.
                          </p>
                          <div className="text-center py-12">
                            <div className="text-6xl mb-4">🎵</div>
                            <p className="text-gray-500">Fonctionnalité en cours de développement...</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </RequireRole>
                } 
              />

              <Route 
                path="/member/events" 
                element={
                  <RequireRole role="membre">
                    <div className="pt-20 px-4">
                      <div className="max-w-4xl mx-auto py-8">
                        <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
                          <h1 className="text-3xl font-bold text-green-600 mb-2">Mes Événements</h1>
                          <p className="text-gray-600 mb-6">
                            Consultez vos participations aux concerts et activités.
                          </p>
                          <div className="text-center py-12">
                            <div className="text-6xl mb-4">🎭</div>
                            <p className="text-gray-500">Fonctionnalité en cours de développement...</p>
                          </div>
                        </div>
                      </div>
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
                  <div className="min-h-[60vh] flex flex-col items-center justify-center pt-20 px-4 text-center">
                    <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
                    <h2 className="text-3xl font-semibold text-gray-700 mb-4">Page Non Trouvée</h2>
                    <p className="text-xl text-gray-600 mb-8 max-w-md">
                      La page que vous recherchez n'existe pas ou a été déplacée.
                    </p>
                    <div className="space-y-3">
                      <button 
                        onClick={() => window.history.back()}
                        className="bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors text-lg block"
                      >
                        ← Retour à la page précédente
                      </button>
                      <a 
                        href="/#/"
                        className="bg-cast-green text-white py-3 px-6 rounded-lg hover:bg-cast-gold transition-colors text-lg block"
                      >
                        🏠 Retour à l'accueil
                      </a>
                    </div>
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
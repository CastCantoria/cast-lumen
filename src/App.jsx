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
import ProtectedRoute from "./components/auth/ProtectedRoute"
import Unauthorized from "./pages/Unauthorized"

// Import des nouveaux dashboards spécifiques
import SuperAdminDashboard from "./pages/dashboard/super-admin/SuperAdminDashboard"
import AdminDashboard from "./pages/dashboard/admin/AdminDashboard"
import MemberDashboard from "./pages/dashboard/member/MemberDashboard"

// CORRECTION : Commenter les imports manquants pour l'instant
// import RoleManagement from "./components/admin/RoleManagement"
// import UserManagement from "./components/admin/UserManagement"
// import EventManagement from "./pages/admin/EventManagement"
// import RepertoireManagement from "./pages/admin/RepertoireManagement"

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
              <Route path="/unauthorized" element={<Unauthorized />} />

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
              {/* DASHBOARD UNIFIÉ - ROUTE PRINCIPALE (Compatibilité) */}
              {/* ==================== */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute minRequiredRole="registered-user">
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />

              {/* ==================== */}
              {/* DASHBOARDS SPÉCIFIQUES PAR RÔLE (NOUVEAU) */}
              {/* ==================== */}
              
              {/* Super Admin Dashboard */}
              <Route 
                path="/super-admin" 
                element={
                  <ProtectedRoute requiredRole="super-admin">
                    <SuperAdminDashboard />
                  </ProtectedRoute>
                } 
              />

              {/* Admin Dashboard */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />

              {/* Member Dashboard */}
              <Route 
                path="/member" 
                element={
                  <ProtectedRoute requiredRole="registered-user">
                    <MemberDashboard />
                  </ProtectedRoute>
                } 
              />

              {/* ==================== */}
              {/* ADMIN - SOUS-ROUTES (TEMPORAIREMENT COMMENTÉES) */}
              {/* ==================== */}
              
              {/* 
              <Route 
                path="/admin/roles" 
                element={
                  <ProtectedRoute 
                    requiredPermission="manage_all_accounts"
                    unauthorizedRedirect="/admin"
                  >
                    <div className="pt-20">
                      <RoleManagement />
                    </div>
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="/admin/users" 
                element={
                  <ProtectedRoute 
                    requiredPermission="manage_users"
                    unauthorizedRedirect="/admin"
                  >
                    <div className="pt-20">
                      <UserManagement />
                    </div>
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="/admin/events" 
                element={
                  <ProtectedRoute 
                    requiredPermission="manage_content"
                    unauthorizedRedirect="/admin"
                  >
                    <div className="pt-20">
                      <EventManagement />
                    </div>
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="/admin/repertoire" 
                element={
                  <ProtectedRoute 
                    requiredPermission="manage_content"
                    unauthorizedRedirect="/admin"
                  >
                    <div className="pt-20">
                      <RepertoireManagement />
                    </div>
                  </ProtectedRoute>
                } 
              />
              */}

              {/* ==================== */}
              {/* MEMBER - SOUS-ROUTES (FONCTIONNELLES) */}
              {/* ==================== */}
              
              <Route 
                path="/member/repertoire" 
                element={
                  <ProtectedRoute 
                    requiredPermission="access_premium_content"
                    unauthorizedRedirect="/member"
                  >
                    <div className="pt-20 px-4">
                      <div className="max-w-6xl mx-auto py-8">
                        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
                          <h1 className="text-3xl font-bold text-green-600 mb-4">🎵 Mon Répertoire Personnel</h1>
                          <p className="text-gray-600 mb-6">
                            Accédez à votre collection personnelle de partitions et morceaux.
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200 text-center">
                              <div className="text-4xl mb-3">📖</div>
                              <h3 className="font-semibold text-blue-700 mb-2">Partitions</h3>
                              <p className="text-blue-600 text-sm">Vos partitions personnelles</p>
                            </div>
                            <div className="bg-green-50 p-6 rounded-lg border-2 border-green-200 text-center">
                              <div className="text-4xl mb-3">🎼</div>
                              <h3 className="font-semibold text-green-700 mb-2">Exercices</h3>
                              <p className="text-green-600 text-sm">Vos exercices vocaux</p>
                            </div>
                            <div className="bg-purple-50 p-6 rounded-lg border-2 border-purple-200 text-center">
                              <div className="text-4xl mb-3">⭐</div>
                              <h3 className="font-semibold text-purple-700 mb-2">Favoris</h3>
                              <p className="text-purple-600 text-sm">Vos morceaux préférés</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="/member/events" 
                element={
                  <ProtectedRoute 
                    requiredPermission="access_premium_content"
                    unauthorizedRedirect="/member"
                  >
                    <div className="pt-20 px-4">
                      <div className="max-w-6xl mx-auto py-8">
                        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
                          <h1 className="text-3xl font-bold text-orange-600 mb-4">🎭 Mes Événements</h1>
                          <p className="text-gray-600 mb-6">
                            Gérez votre participation aux concerts et activités.
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                              <h3 className="text-xl font-semibold text-gray-800 mb-3">Prochains Événements</h3>
                              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                <div className="font-semibold text-green-700">Concert de Noël</div>
                                <div className="text-sm text-green-600">24 Décembre 2024 • Cathédrale</div>
                                <div className="mt-2 bg-green-100 text-green-800 px-2 py-1 rounded text-xs inline-block">
                                  Confirmé
                                </div>
                              </div>
                              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                <div className="font-semibold text-blue-700">Répétition Générale</div>
                                <div className="text-sm text-blue-600">20 Décembre 2024 • Salle de répétition</div>
                                <div className="mt-2 bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs inline-block">
                                  Participation requise
                                </div>
                              </div>
                            </div>
                            <div className="space-y-4">
                              <h3 className="text-xl font-semibold text-gray-800 mb-3">Statistiques</h3>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="bg-purple-50 p-4 rounded-lg text-center">
                                  <div className="text-2xl font-bold text-purple-600">12</div>
                                  <div className="text-sm text-purple-700">Événements</div>
                                </div>
                                <div className="bg-teal-50 p-4 rounded-lg text-center">
                                  <div className="text-2xl font-bold text-teal-600">8</div>
                                  <div className="text-sm text-teal-700">Participations</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ProtectedRoute>
                } 
              />

              {/* ==================== */}
              {/* ROUTES DE COMPATIBILITÉ (ancienne structure) */}
              {/* ==================== */}
              
              <Route 
                path="/member/dashboard" 
                element={
                  <ProtectedRoute requiredRole="registered-user">
                    <MemberDashboard />
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="/admin/dashboard" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="/super-admin/dashboard" 
                element={
                  <ProtectedRoute requiredRole="super-admin">
                    <SuperAdminDashboard />
                  </ProtectedRoute>
                } 
              />

              {/* ==================== */}
              {/* ROUTES CORE-TEAM (NOUVEAU) */}
              {/* ==================== */}
              
              <Route 
                path="/core-team/media" 
                element={
                  <ProtectedRoute 
                    requiredPermission="publish_media"
                    unauthorizedRedirect="/member"
                  >
                    <div className="pt-20 px-4">
                      <div className="max-w-6xl mx-auto py-8">
                        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
                          <h1 className="text-3xl font-bold text-pink-600 mb-4">🎬 Gestion des Médias</h1>
                          <p className="text-gray-600 mb-6">
                            Espace dédié à la publication et gestion des contenus média.
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <button className="bg-blue-600 text-white p-6 rounded-lg hover:bg-blue-700 transition text-center">
                              <div className="text-3xl mb-3">📹</div>
                              <div className="font-semibold">Vidéos</div>
                              <div className="text-sm opacity-90 mt-2">Gérer les vidéos</div>
                            </button>
                            <button className="bg-green-600 text-white p-6 rounded-lg hover:bg-green-700 transition text-center">
                              <div className="text-3xl mb-3">🎵</div>
                              <div className="font-semibold">Audio</div>
                              <div className="text-sm opacity-90 mt-2">Gérer les enregistrements</div>
                            </button>
                            <button className="bg-purple-600 text-white p-6 rounded-lg hover:bg-purple-700 transition text-center">
                              <div className="text-3xl mb-3">🖼️</div>
                              <div className="font-semibold">Photos</div>
                              <div className="text-sm opacity-90 mt-2">Gérer la galerie</div>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ProtectedRoute>
                } 
              />

              {/* ==================== */}
              {/* ROUTE 404 - PAGE NON TROUVÉE */}
              {/* ==================== */}
              <Route 
                path="*" 
                element={
                  <div className="min-h-[60vh] flex flex-col items-center justify-center pt-20 px-4 text-center">
                    <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
                      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
                      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Non Trouvée</h2>
                      <p className="text-lg text-gray-600 mb-8">
                        La page que vous recherchez n'existe pas ou a été déplacée.
                      </p>
                      <div className="space-y-3">
                        <button 
                          onClick={() => window.history.back()}
                          className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors text-lg"
                        >
                          ← Retour
                        </button>
                        <a 
                          href="/#/"
                          className="w-full bg-cast-green text-white py-3 px-6 rounded-lg hover:bg-cast-gold transition-colors text-lg block text-center"
                        >
                          🏠 Accueil
                        </a>
                        <a 
                          href="/#/dashboard"
                          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors text-lg block text-center"
                        >
                          📊 Dashboard
                        </a>
                      </div>
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
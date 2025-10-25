import React from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

// 🌐 Pages publiques
import Home from "./pages/public/Home";
import About from "./pages/public/About";
import Repertoire from "./pages/public/Repertoire";
import Concerts from "./pages/public/Concerts";
import Galerie from "./pages/public/Galerie";
import Spiritualite from "./pages/public/Spiritualite";
import Blog from "./pages/public/Blog";
import Contact from "./pages/public/Contact";
import Join from "./pages/public/Join";
import JoinSuccess from "./pages/public/JoinSuccess";
import Unauthorized from "./pages/Unauthorized";

// 🔐 Pages d'authentification
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

// 🧱 Protection des routes
import RequireAuth from "./components/RequireAuth";

// 📊 Dashboard unique avec contenu dynamique
import Dashboard from "./components/Dashboard";

// 👤 Profil
import ProfilePage from "./pages/app/profile/ProfilePage";

// 🔄 Handler de redirection automatique
import AuthRedirectHandler from "./components/AuthRedirectHandler";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-gray-50">
          {/* Handler de redirection automatique */}
          <AuthRedirectHandler />
          
          {/* ✅ Header stylé */}
          <Header />

          {/* ✅ Contenu principal */}
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
              <Route path="/join" element={<Join />} />
              <Route path="/join/success" element={<JoinSuccess />} />
              <Route path="/unauthorized" element={<Unauthorized />} />

              {/* ==================== */}
              {/* AUTHENTIFICATION */}
              {/* ==================== */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* ==================== */}
              {/* DASHBOARD UNIQUE */}
              {/* ==================== */}
              <Route
                path="/dashboard"
                element={
                  <RequireAuth>
                    <Dashboard />
                  </RequireAuth>
                }
              />

              {/* ==================== */}
              {/* PROFIL UTILISATEUR */}
              {/* ==================== */}
              <Route
                path="/profile"
                element={
                  <RequireAuth>
                    <ProfilePage />
                  </RequireAuth>
                }
              />

              {/* ==================== */}
              {/* COMPATIBILITÉ ANCIENS LIENS - REDIRECTIONS */}
              {/* ==================== */}
              <Route path="/app/dashboard" element={<Navigate to="/dashboard" replace />} />
              <Route path="/app/super-admin" element={<Navigate to="/dashboard" replace />} />
              <Route path="/app/admin" element={<Navigate to="/dashboard" replace />} />
              <Route path="/app/member" element={<Navigate to="/dashboard" replace />} />
              <Route path="/app/profile" element={<Navigate to="/profile" replace />} />
              <Route path="/super-admin" element={<Navigate to="/dashboard" replace />} />
              <Route path="/admin" element={<Navigate to="/dashboard" replace />} />
              <Route path="/member" element={<Navigate to="/dashboard" replace />} />

              {/* ==================== */}
              {/* PAGE 404 */}
              {/* ==================== */}
              <Route
                path="*"
                element={
                  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex items-center justify-center">
                    <div className="text-center max-w-2xl mx-4">
                      <div className="bg-white rounded-2xl shadow-2xl p-8">
                        <div className="text-6xl mb-6">❌</div>
                        <h1 className="text-4xl font-bold text-gray-800 mb-4">Page Non Trouvée</h1>
                        <p className="text-xl text-gray-600 mb-6">
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
                            className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors text-lg block text-center"
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
                  </div>
                }
              />
            </Routes>
          </main>

          {/* ✅ Footer */}
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
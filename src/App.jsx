import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/NewAuthContext"; // ✅ correction
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
import Login from "./auth/Login";
import Register from "./pages/public/Register";
import Join from "./pages/public/Join";
import JoinSuccess from "./pages/public/JoinSuccess";
import Unauthorized from "./pages/Unauthorized";

// 🔐 Pages privées
import Profile from "./pages/private/Profile";
import Dashboard from "./components/Dashboard/Dashboard";

// 🧱 Protection des routes
import RequireAuth from "./components/RequireAuth";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// 🧩 Dashboards spécifiques par rôle
import SuperAdminDashboard from "./pages/dashboard/super-admin/SuperAdminDashboard";
import AdminDashboard from "./pages/dashboard/admin/AdminDashboard";
import MemberDashboard from "./pages/dashboard/member/MemberDashboard";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-gray-50">
          {/* ✅ Header fixe */}
          <Header />

          {/* ✅ Contenu avec marge supérieure pour ne pas être caché */}
          <main className="flex-1 pt-20">
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
              {/* ROUTES PRIVÉES */}
              {/* ==================== */}
              <Route
                path="/profile"
                element={
                  <RequireAuth>
                    <Profile />
                  </RequireAuth>
                }
              />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute minRequiredRole="registered-user">
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              {/* ==================== */}
              {/* DASHBOARDS PAR RÔLE */}
              {/* ==================== */}
              <Route
                path="/super-admin"
                element={
                  <ProtectedRoute requiredRole="super-admin">
                    <SuperAdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/member"
                element={
                  <ProtectedRoute requiredRole="registered-user">
                    <MemberDashboard />
                  </ProtectedRoute>
                }
              />

              {/* ==================== */}
              {/* PAGE 404 */}
              {/* ==================== */}
              <Route
                path="*"
                element={
                  <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
                    <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
                      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
                      <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                        Page Non Trouvée
                      </h2>
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
                          className="w-full bg-green-700 text-white py-3 px-6 rounded-lg hover:bg-green-800 transition-colors text-lg block text-center"
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

          {/* ✅ Footer global */}
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

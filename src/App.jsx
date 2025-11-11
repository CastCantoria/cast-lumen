import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Composants d'authentification
import RequireAuth from './components/auth/RequireAuth';
import RequireRole from './components/auth/RequireRole';

// Composant ScrollToTop
import ScrollToTop from './components/ScrollToTop';

// Pages publiques
import Home from './pages/public/Home';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import ForgotPassword from './pages/public/ForgotPassword';
import InscriptionPending from './pages/public/InscriptionPending';
import Unauthorized from './pages/public/Unauthorized';
import About from './pages/public/About';
import Contact from './pages/public/Contact';
import Join from './pages/public/Join';
import Spiritualite from './pages/public/Spiritualite';
import Repertoire from './pages/public/Repertoire';
import EventList from './pages/public/EventList';
import Gallery from './pages/public/Gallery';
import Events from './pages/public/Events';
import './styles/gallery-animations.css';

// Setup Admins
import SetupAdmins from './pages/admin/SetupAdmins';

// Pages privées
import Profile from './pages/private/Profile';
import Blog from './pages/private/Blog';
import Chat from './pages/private/Chat';
import Newsletter from './pages/private/Newsletter';

// Pages membres
import Scores from './pages/member/Scores';
import Rehearsals from './pages/member/Rehearsals';

// Pages médias et contenu (accessibles aux membres)
import MediaManager from './pages/admin/MediaManager';
import PartitionUpload from './pages/admin/PartitionUpload';
import NoticesManager from './pages/admin/NoticesManager';

// NOUVELLE PAGE DE MODÉRATION
import MediaModeration from './pages/admin/MediaModeration';

// Dashboards
import Dashboard from './components/dashboard/Dashboard';
import UserDashboard from './pages/dashboard/user/UserDashboard';
import MemberDashboard from './pages/dashboard/member/MemberDashboard';
import AdminDashboard from './pages/dashboard/admin/AdminDashboard';
import SuperAdminDashboard from './pages/dashboard/super-admin/SuperAdminDashboard';

// Layout
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App min-h-screen flex flex-col">
          {/* Composant pour remonter en haut à chaque changement de route */}
          <ScrollToTop />
          
          <Header />
          <main className="flex-grow">
            <Routes>
              {/* ==================== */}
              {/* ROUTES PUBLIQUES */}
              {/* ==================== */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/inscription-pending" element={<InscriptionPending />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="/setup-admins" element={<SetupAdmins />} />
              
              {/* Pages publiques */}
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/join" element={<Join />} />
              <Route path="/spiritualite" element={<Spiritualite />} />
              <Route path="/repertoire" element={<Repertoire />} />
              <Route path="/events" element={<EventList />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/concerts" element={<Events />} />

              {/* ==================== */}
              {/* ROUTES PROTÉGÉES - TOUS LES UTILISATEURS CONNECTÉS */}
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
              {/* ROUTES BLOG ET COMMUNAUTÉ - MEMBRES ET + */}
              {/* ==================== */}

              <Route 
                path="/blog" 
                element={
                  <RequireRole allowedRoles={['member', 'admin', 'moderator', 'super-admin']}>
                    <Blog />
                  </RequireRole>
                } 
              />

              {/* CHAT COMMUNAUTAIRE - ROUTE PRINCIPALE */}
              <Route 
                path="/chat" 
                element={
                  <RequireRole allowedRoles={['member', 'admin', 'moderator', 'super-admin']}>
                    <Chat />
                  </RequireRole>
                } 
              />

              <Route 
                path="/newsletter" 
                element={
                  <RequireRole allowedRoles={['member', 'admin', 'moderator', 'super-admin']}>
                    <Newsletter />
                  </RequireRole>
                } 
              />

              {/* ==================== */}
              {/* ROUTES MÉDIAS ET PARTITIONS - MEMBRES ET + */}
              {/* ==================== */}

              <Route 
                path="/media" 
                element={
                  <RequireRole allowedRoles={['member', 'admin', 'moderator', 'super-admin']}>
                    <MediaManager />
                  </RequireRole>
                } 
              />

              <Route 
                path="/upload-partition" 
                element={
                  <RequireRole allowedRoles={['member', 'admin', 'moderator', 'super-admin']}>
                    <PartitionUpload />
                  </RequireRole>
                } 
              />

              <Route 
                path="/annonces" 
                element={
                  <RequireRole allowedRoles={['member', 'admin', 'moderator', 'super-admin']}>
                    <NoticesManager />
                  </RequireRole>
                } 
              />

              {/* ==================== */}
              {/* ROUTES MODÉRATION MÉDIAS - ADMIN ET MODÉRATEURS */}
              {/* ==================== */}

              {/* NOUVELLE ROUTE DE MODÉRATION */}
              <Route 
                path="/admin/media" 
                element={
                  <RequireRole allowedRoles={['admin', 'moderator', 'super-admin']}>
                    <MediaModeration />
                  </RequireRole>
                } 
              />

              {/* Ancienne route MediaManager pour compatibilité */}
              <Route 
                path="/admin/media-manager" 
                element={
                  <RequireRole allowedRoles={['admin', 'moderator', 'super-admin']}>
                    <MediaManager />
                  </RequireRole>
                } 
              />

              {/* ==================== */}
              {/* ROUTES RÉPERTOIRE ET RÉPÉTITIONS - MEMBRES ET + */}
              {/* ==================== */}

              <Route 
                path="/partitions" 
                element={
                  <RequireRole allowedRoles={['member', 'admin', 'moderator', 'super-admin']}>
                    <Scores />
                  </RequireRole>
                } 
              />

              <Route 
                path="/repetitions" 
                element={
                  <RequireRole allowedRoles={['member', 'admin', 'moderator', 'super-admin']}>
                    <Rehearsals />
                  </RequireRole>
                } 
              />

              {/* ==================== */}
              {/* DASHBOARDS PAR RÔLE */}
              {/* ==================== */}

              {/* Route dashboard principal - Redirige automatiquement */}
              <Route 
                path="/dashboard" 
                element={
                  <RequireAuth>
                    <Dashboard />
                  </RequireAuth>
                } 
              />

              {/* Dashboard Utilisateur (accès: user uniquement) */}
              <Route 
                path="/dashboard/user" 
                element={
                  <RequireRole allowedRoles={['user']}>
                    <UserDashboard />
                  </RequireRole>
                } 
              />

              {/* Dashboard Membre (accès: member, admin, moderator, super-admin) */}
              <Route 
                path="/dashboard/member" 
                element={
                  <RequireRole allowedRoles={['member', 'admin', 'moderator', 'super-admin']}>
                    <MemberDashboard />
                  </RequireRole>
                } 
              />

              {/* Dashboard Admin (accès: admin, moderator, super-admin) */}
              <Route 
                path="/dashboard/admin" 
                element={
                  <RequireRole allowedRoles={['admin', 'moderator', 'super-admin']}>
                    <AdminDashboard />
                  </RequireRole>
                } 
              />

              {/* Dashboard Super Admin (accès: super-admin uniquement) */}
              <Route 
                path="/dashboard/super-admin" 
                element={
                  <RequireRole allowedRoles={['super-admin']}>
                    <SuperAdminDashboard />
                  </RequireRole>
                } 
              />

              {/* ==================== */}
              {/* REDIRECTIONS POUR COMPATIBILITÉ */}
              {/* ==================== */}

              {/* Redirections des anciennes URLs */}
              <Route path="/super-admin" element={<Navigate to="/dashboard/super-admin" replace />} />
              <Route path="/admin/*" element={<Navigate to="/dashboard/admin" replace />} />
              <Route path="/member-dashboard/*" element={<Navigate to="/dashboard/member" replace />} />

              {/* ==================== */}
              {/* ROUTES FONCTIONNELLES */}
              {/* ==================== */}

              {/* Redirection automatique après connexion */}
              <Route path="/redirect" element={
                <RequireAuth>
                  <Dashboard />
                </RequireAuth>
              } />

              {/* Route 404 améliorée */}
              <Route path="*" element={
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                  <div className="text-center p-8 max-w-md mx-auto">
                    <div className="text-6xl mb-4">🔍</div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Page non trouvée</h1>
                    <p className="text-gray-600 mb-6">
                      La page que vous recherchez n'existe pas ou a été déplacée.
                    </p>
                    
                    <div className="space-y-3 mb-6">
                      <p className="text-sm text-gray-500">Essayer ces pages :</p>
                      <div className="flex flex-col gap-2">
                        <a href="/dashboard" className="text-blue-600 hover:text-blue-800 font-medium">
                          📊 Mon Tableau de Bord
                        </a>
                        <a href="/" className="text-blue-600 hover:text-blue-800 font-medium">
                          🏠 Page d'Accueil
                        </a>
                        <a href="/blog" className="text-green-600 hover:text-green-800 font-medium">
                          ✍️ Blog Communautaire
                        </a>
                        <a href="/chat" className="text-emerald-600 hover:text-emerald-800 font-medium">
                          💬 Chat Communautaire
                        </a>
                        <a href="/media" className="text-purple-600 hover:text-purple-800 font-medium">
                          🎵 Médias Partagés
                        </a>
                        <a href="/gallery" className="text-indigo-600 hover:text-indigo-800 font-medium">
                          🖼️ Galerie Publique
                        </a>
                        {(window.location.pathname.includes('admin') || window.location.pathname.includes('moderation')) && (
                          <a href="/admin/media" className="text-orange-600 hover:text-orange-800 font-medium">
                            🛡️ Panel de Modération
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
                      <p className="text-sm text-blue-800">
                        <strong>Espace Membre :</strong> Les choristes peuvent ajouter des médias, proposer des partitions, participer au blog et au chat communautaire.
                      </p>
                    </div>
                  </div>
                </div>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Composants d'authentification
import RequireAuth from './components/auth/RequireAuth';
import RequireRole from './components/auth/RequireRole';
import RouteGuard from './components/auth/RouteGuard';
import AuthRedirectHandler from './components/auth/AuthRedirectHandler';

// Layouts
import SuperAdminLayout from './layouts/SuperAdminLayout';
import AdminLayout from './layouts/AdminLayout';
import MemberLayout from './layouts/MemberLayout';

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

// Pages privées
import Profile from './pages/private/Profile';
import Blog from './pages/private/Blog';
import Chat from './pages/private/Chat';
import Newsletter from './pages/private/Newsletter';

// Pages membres
import Scores from './pages/member/Scores';
import Rehearsals from './pages/member/Rehearsals';

// Dashboard et sous-pages (ancienne structure)
import Dashboard from './components/dashboard/Dashboard';
import UserDashboard from './pages/dashboard/user/UserDashboard';

// Nouveaux dashboards (architecture WordPress-like)
import SuperAdminDashboard from './components/super-admin/SuperAdminDashboard';
import AdminDashboard from './pages/dashboard/admin/AdminDashboard';
import MemberDashboard from './pages/dashboard/member/MemberDashboard';

// Composants Super Admin
import PlatformSettings from './pages/dashboard/super-admin/components/PlatformSettings';
import UserManagement from './pages/dashboard/super-admin/components/UserManagement';
import SystemAnalytics from './pages/dashboard/super-admin/components/SystemAnalytics';
import BackupRestore from './pages/dashboard/super-admin/components/BackupRestore';

// Composants Admin
import MemberManagement from './pages/dashboard/admin/components/MemberManagement';
import EventManagement from './pages/dashboard/admin/components/EventManagement';
import ContentManagement from './pages/dashboard/admin/components/ContentManagement';
import QuickStats from './pages/dashboard/admin/components/QuickStats';

// Composants Membre
import PersonalSchedule from './pages/dashboard/member/components/PersonalSchedule';
import MyPartitions from './pages/dashboard/member/components/MyPartitions';
import MyProfile from './pages/dashboard/member/components/MyProfile';
import EventRSVP from './pages/dashboard/member/components/EventRSVP';

// Layout
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow">
            <Routes>
              {/* Routes publiques */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/inscription-pending" element={<InscriptionPending />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              
              {/* Pages publiques */}
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/join" element={<Join />} />
              <Route path="/spiritualite" element={<Spiritualite />} />
              <Route path="/repertoire" element={<Repertoire />} />
              <Route path="/events" element={<EventList />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/concerts" element={<Events />} />

              {/* Routes privées pour les utilisateurs authentifiés */}
              <Route 
                path="/profile" 
                element={
                  <RequireAuth>
                    <Profile />
                  </RequireAuth>
                } 
              />

              {/* Routes utilisateur de base */}
              <Route 
                path="/blog" 
                element={
                  <RequireRole role="user">
                    <Blog />
                  </RequireRole>
                } 
              />
              <Route 
                path="/chat" 
                element={
                  <RequireRole role="user">
                    <Chat />
                  </RequireRole>
                } 
              />
              <Route 
                path="/newsletter" 
                element={
                  <RequireRole role="user">
                    <Newsletter />
                  </RequireRole>
                } 
              />

              {/* Routes membres (ancienne structure) */}
              <Route 
                path="/partitions" 
                element={
                  <RequireRole role="member">
                    <Scores />
                  </RequireRole>
                } 
              />
              <Route 
                path="/repetitions" 
                element={
                  <RequireRole role="member">
                    <Rehearsals />
                  </RequireRole>
                } 
              />

              {/* Route dashboard principal - Redirige vers le bon dashboard (ancienne structure) */}
              <Route 
                path="/dashboard" 
                element={
                  <RequireAuth>
                    <Dashboard />
                  </RequireAuth>
                } 
              />

              {/* Dashboards spécifiques (ancienne structure) */}
              <Route 
                path="/dashboard/user" 
                element={
                  <RequireRole role="user">
                    <UserDashboard />
                  </RequireRole>
                } 
              />

              {/* ==================================================================== */}
              {/* REDIRECTIONS POUR LES ANCIENNES URLS - CORRECTION DU 404 */}
              {/* ==================================================================== */}

              {/* Redirection pour l'ancienne URL Super Admin */}
              <Route 
                path="/dashboard/super-admin/*" 
                element={<Navigate to="/super-admin/dashboard" replace />} 
              />

              {/* Redirection pour l'ancienne URL Admin */}
              <Route 
                path="/dashboard/admin/*" 
                element={<Navigate to="/admin/dashboard" replace />} 
              />

              {/* ==================================================================== */}
              {/* NOUVELLE ARCHITECTURE WORDPRESS-LIKE - RÔLES SÉPARÉS */}
              {/* ==================================================================== */}

              {/* Routes Super Admin - Complètement séparées */}
              <Route path="/super-admin/*" element={
                <RouteGuard requiredPermission="platform:manage">
                  <SuperAdminLayout>
                    <Routes>
                      {/* Route par défaut : redirige vers le dashboard */}
                      <Route index element={<Navigate to="/super-admin/dashboard" replace />} />
                      <Route path="dashboard" element={<SuperAdminDashboard />} />
                      <Route path="platform-settings" element={<PlatformSettings />} />
                      <Route path="user-management" element={<UserManagement />} />
                      <Route path="system-analytics" element={<SystemAnalytics />} />
                      <Route path="backup-restore" element={<BackupRestore />} />
                      
                      {/* Redirection pour les routes inexistantes */}
                      <Route path="*" element={<Navigate to="/super-admin/dashboard" replace />} />
                    </Routes>
                  </SuperAdminLayout>
                </RouteGuard>
              } />

              {/* Routes Admin */}
              <Route path="/admin/*" element={
                <RouteGuard requiredPermission="members:manage">
                  <AdminLayout>
                    <Routes>
                      {/* Route par défaut : redirige vers le dashboard */}
                      <Route index element={<Navigate to="/admin/dashboard" replace />} />
                      <Route path="dashboard" element={<AdminDashboard />} />
                      <Route path="members" element={<MemberManagement />} />
                      <Route path="events" element={<EventManagement />} />
                      <Route path="content" element={<ContentManagement />} />
                      <Route path="stats" element={<QuickStats />} />
                      
                      {/* Redirection pour les routes inexistantes */}
                      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
                    </Routes>
                  </AdminLayout>
                </RouteGuard>
              } />

              {/* Routes Membre - Intégrées au site */}
              <Route path="/member-dashboard/*" element={
                <RouteGuard>
                  <MemberLayout>
                    <Routes>
                      {/* Route par défaut : dashboard membre */}
                      <Route index element={<MemberDashboard />} />
                      <Route path="schedule" element={<PersonalSchedule />} />
                      <Route path="partitions" element={<MyPartitions />} />
                      <Route path="profile" element={<MyProfile />} />
                      <Route path="events" element={<EventRSVP />} />
                      
                      {/* Redirection pour les routes inexistantes */}
                      <Route path="*" element={<Navigate to="/member-dashboard" replace />} />
                    </Routes>
                  </MemberLayout>
                </RouteGuard>
              } />

              {/* Redirection automatique après connexion */}
              <Route path="/redirect" element={<AuthRedirectHandler />} />

              {/* Route 404 */}
              <Route path="*" element={
                <div className="container mx-auto p-8 text-center">
                  <h1 className="text-4xl font-bold mb-4">404</h1>
                  <p className="text-xl">Page non trouvée</p>
                  <div className="mt-6">
                    <p className="text-gray-600 mb-4">Essayez ces URLs :</p>
                    <div className="flex flex-col gap-2 max-w-md mx-auto">
                      <a href="/super-admin/dashboard" className="text-blue-600 hover:underline">
                        /super-admin/dashboard
                      </a>
                      <a href="/admin/dashboard" className="text-blue-600 hover:underline">
                        /admin/dashboard
                      </a>
                      <a href="/member-dashboard" className="text-blue-600 hover:underline">
                        /member-dashboard
                      </a>
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
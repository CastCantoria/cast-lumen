// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Composants d'authentification
import RequireAuth from './components/auth/RequireAuth';
import RequireRole from './components/auth/RequireRole';

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

// Dashboard et sous-pages
import Dashboard from './components/dashboard/Dashboard';
import UserDashboard from './pages/dashboard/user/UserDashboard';
import MemberDashboard from './pages/dashboard/member/MemberDashboard';
import AdminDashboard from './pages/dashboard/admin/AdminDashboard';
import SuperAdminDashboard from './pages/dashboard/admin/SuperAdminDashboard';

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

              {/* Routes membres */}
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

              {/* Route dashboard principal - Redirige vers le bon dashboard */}
              <Route 
                path="/dashboard" 
                element={
                  <RequireAuth>
                    <Dashboard />
                  </RequireAuth>
                } 
              />

              {/* Dashboards spécifiques */}
              <Route 
                path="/dashboard/user" 
                element={
                  <RequireRole role="user">
                    <UserDashboard />
                  </RequireRole>
                } 
              />
              
              <Route 
                path="/dashboard/member" 
                element={
                  <RequireRole role="member">
                    <MemberDashboard />
                  </RequireRole>
                } 
              />
              
              <Route 
                path="/dashboard/admin" 
                element={
                  <RequireRole role="admin">
                    <AdminDashboard />
                  </RequireRole>
                } 
              />

              <Route 
                path="/dashboard/super-admin/*" 
                element={
                  <RequireRole role="super-admin">
                    <SuperAdminDashboard />
                  </RequireRole>
                } 
              />

              {/* Route 404 */}
              <Route path="*" element={
                <div className="container mx-auto p-8 text-center">
                  <h1 className="text-4xl font-bold mb-4">404</h1>
                  <p className="text-xl">Page non trouvée</p>
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
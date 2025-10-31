import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Composants d'authentification
import RequireAuth from './components/auth/RequireAuth';
import RequireRole from './components/auth/RequireRole';

// Pages
import Home from './pages/public/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Unauthorized from './pages/public/Unauthorized';

// Dashboard et sous-pages
import Dashboard from './components/dashboard/Dashboard';
import UserDashboard from './pages/dashboard/user/UserDashboard';
import MemberDashboard from './pages/dashboard/member/MemberDashboard';
import AdminDashboard from './pages/dashboard/admin/AdminDashboard';

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
              <Route path="/unauthorized" element={<Unauthorized />} />

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
                  <RequireAuth>
                    <UserDashboard />
                  </RequireAuth>
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
// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import EventDetails from './pages/public/EventDetails';
import Gallery from './pages/public/Gallery';
import Events from './pages/public/Events';
import Videos from './pages/public/Videos';
import Partners from './pages/public/Partners';
import FAQ from './pages/public/FAQ';
import Help from './pages/help/Help';
import Support from './pages/help/Support';

// Pages privées
import Profile from './pages/private/Profile';
// ProfileEdit and Settings live under pages/account
import ProfileEdit from './pages/account/ProfileEdit'; // AJOUT
import Settings from './pages/account/Settings'; // AJOUT
// Documents and Messages live under pages/common
import Documents from './pages/common/Documents'; // AJOUT
import Messages from './pages/common/Messages'; // AJOUT
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

// Pages admin
import EventsList from './pages/admin/EventsList';
import EventCreation from './pages/admin/EventCreation';
import EventCalendar from './pages/admin/EventCalendar';
import EventBookings from './pages/admin/EventBookings';
import RepertoireList from './pages/admin/RepertoireList';
import PartitionUpload from './pages/admin/PartitionUpload';
import GalleryList from './pages/admin/GalleryList';
import GalleryUpload from './pages/admin/GalleryUpload';
import MediaManager from './pages/admin/MediaManager';
import NoticesManager from './pages/admin/NoticesManager';

// Member Pages
import MemberLayout from './components/member/MemberLayout';
import MemberEvents from './pages/member/MemberEvents';
import MemberProfile from './pages/member/MemberProfile';
import MemberMessages from './pages/member/MemberMessages';
import MemberDocuments from './pages/member/MemberDocuments';
import VoiceRecorder from './pages/member/VoiceRecorder';
import Metronome from './pages/member/Metronome';
import Tuner from './pages/member/Tuner';
import Attendance from './pages/member/Attendance';
import Community from './pages/member/Community';
import Forum from './pages/member/Forum';

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
              <Route path="/events/details/:id" element={<EventDetails />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/concerts" element={<Events />} />
              <Route path="/videos" element={<Videos />} />
              <Route path="/partenaires" element={<Partners />} />
              <Route path="/faq" element={<FAQ />} />

              {/* Routes d'assistance */}
              <Route path="/help" element={<Help />} />
              <Route path="/support" element={<Support />} />

              {/* Routes privées pour les utilisateurs authentifiés */}
              <Route
                path="/profile"
                element={
                  <RequireAuth>
                    <Profile />
                  </RequireAuth>
                }
              />
              <Route
                path="/profile/edit"
                element={
                  <RequireAuth>
                    <ProfileEdit />
                  </RequireAuth>
                }
              />
              <Route
                path="/settings"
                element={
                  <RequireAuth>
                    <Settings />
                  </RequireAuth>
                }
              />
              <Route
                path="/documents"
                element={
                  <RequireAuth>
                    <Documents />
                  </RequireAuth>
                }
              />
              <Route
                path="/messages"
                element={
                  <RequireAuth>
                    <Messages />
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
                path="/member/*"
                element={
                  <RequireRole role="member">
                    <MemberLayout />
                  </RequireRole>
                }
              >
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<MemberDashboard />} />
                <Route path="events" element={<MemberEvents />} />
                <Route path="profile" element={<MemberProfile />} />
                <Route path="attendance" element={<Attendance />} />
                <Route path="messages" element={<MemberMessages />} />
                <Route path="documents" element={<MemberDocuments />} />
                <Route path="voice-recorder" element={<VoiceRecorder />} />
                <Route path="metronome" element={<Metronome />} />
                <Route path="tuner" element={<Tuner />} />
                <Route path="community" element={<Community />} />
                <Route path="forum" element={<Forum />} />
              </Route>

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
              
              {/* Routes admin with nested sub-pages */}
              <Route 
                path="/dashboard/admin/*" 
                element={
                  <RequireRole role="admin">
                    <AdminDashboard />
                  </RequireRole>
                }
              >
                <Route path="" element={<EventsList />} />
                <Route path="events" element={<EventsList />} />
                <Route path="events/create" element={<EventCreation />} />
                <Route path="events/calendar" element={<EventCalendar />} />
                <Route path="events/bookings" element={<EventBookings />} />
                <Route path="repertoire" element={<RepertoireList />} />
                <Route path="repertoire/upload" element={<PartitionUpload />} />
                <Route path="gallery" element={<GalleryList />} />
                <Route path="gallery/upload" element={<GalleryUpload />} />
                <Route path="media" element={<MediaManager />} />
                <Route path="notices" element={<NoticesManager />} />
              </Route>

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
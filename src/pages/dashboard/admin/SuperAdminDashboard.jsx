import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminNavigation from '../../../components/admin/AdminNavigation';
import AdminSidebar from '../../../components/admin/AdminSidebar';
import AdmissionManagement from '../../app/dashboards/super-admin/admissions/AdmissionManagement';
import MessageCenter from '../../app/dashboards/super-admin/messages/MessageCenter';
import EventCreation from '../../app/dashboards/super-admin/events/create';
import EventCalendar from '../../app/dashboards/super-admin/events/calendar';
import Statistics from '../../app/dashboards/super-admin/statistics';
import PartitionAdd from '../../app/dashboards/super-admin/partitions/add';
import GalleryManager from '../../app/dashboards/super-admin/gallery';
import ArticleCreation from '../../app/dashboards/super-admin/articles/create';
import MemberInvite from '../../app/dashboards/super-admin/invite';
import UserProfile from '../../app/dashboards/super-admin/users/[id]';

const SuperAdminDashboard = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1">
        <AdminNavigation />
        <div className="p-8">
          <Routes>
            {/* Dashboard principal */}
            <Route 
              index 
              element={
                <div>
                  <h1 className="text-3xl font-semibold mb-6">Dashboard Super Admin</h1>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Statistiques */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                      <h2 className="text-xl font-semibold mb-4">Statistiques</h2>
                    </div>

                    {/* Actions rapides */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                      <h2 className="text-xl font-semibold mb-4">Actions rapides</h2>
                    </div>

                    {/* Notifications */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                      <h2 className="text-xl font-semibold mb-4">Notifications</h2>
                    </div>
                  </div>
                </div>
              }
            />

            {/* Routes des fonctionnalités */}
            <Route path="admissions" element={<AdmissionManagement />} />
            <Route path="messages" element={<MessageCenter />} />
            <Route path="events/create" element={<EventCreation />} />
            <Route path="events/calendar" element={<EventCalendar />} />
            <Route path="statistics" element={<Statistics />} />
            <Route path="partitions/add" element={<PartitionAdd />} />
            <Route path="gallery" element={<GalleryManager />} />
            <Route path="articles/create" element={<ArticleCreation />} />
            <Route path="invite" element={<MemberInvite />} />
            <Route path="users/:id" element={<UserProfile />} />

            {/* Route 404 pour le dashboard */}
            <Route path="*" element={
              <div className="text-center py-12">
                <h2 className="text-2xl font-semibold text-gray-900">Page non trouvée</h2>
                <p className="mt-2 text-gray-600">Cette page n'existe pas dans le dashboard super admin.</p>
              </div>
            } />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
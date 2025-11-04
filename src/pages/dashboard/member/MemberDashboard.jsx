import React from 'react';
import { usePermissions } from '../../../services/permissionService';
import PersonalSchedule from './components/PersonalSchedule';
import MyPartitions from './components/MyPartitions';
import EventRSVP from './components/EventRSVP';
import MyProfile from './components/MyProfile';
import QuickActions from './components/QuickActions';

const MemberDashboard = () => {
  const { hasPermission, userProfile } = usePermissions();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Membre */}
      <div className="bg-gradient-to-r from-green-900 to-emerald-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl sm:text-3xl font-bold">Mon Espace Membre</h1>
              <p className="text-green-200 mt-1">
                Bienvenue, {userProfile?.displayName || 'Cher membre'} !
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center">
                <span className="mr-2">🎵</span>
                MEMBRE
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <QuickActions />
      </div>

      {/* Contenu Membre */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {hasPermission('schedule:view') && <PersonalSchedule />}
          {hasPermission('partitions:view') && <MyPartitions />}
          {hasPermission('events:rsvp') && <EventRSVP />}
          {hasPermission('profile:update') && <MyProfile />}
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;
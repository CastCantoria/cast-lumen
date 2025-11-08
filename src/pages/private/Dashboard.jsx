import React from 'react';
import { useAuth } from '../../contexts/NewAuthContext';
import SuperAdminDashboard from './super-admin/SuperAdminDashboard';
import AdminDashboard from './admin/AdminDashboard';
import MemberDashboard from './member/MemberDashboard';
import UserDashboard from './user/UserDashboard';

const Dashboard = () => {
  const { userProfile, loading } = useAuth();

  if (loading) {
    return <div>Chargement...</div>;
  }

  const renderDashboard = () => {
    switch (userProfile?.role) {
      case 'super-admin':
        return <SuperAdminDashboard />;
      case 'admin':
        return <AdminDashboard />;
      case 'member':
        return <MemberDashboard />;
      default:
        return <UserDashboard />;
    }
  };

  return renderDashboard();
};

export default Dashboard;
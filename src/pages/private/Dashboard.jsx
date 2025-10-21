import React from 'react';
import { useAuth } from '../../contexts/NewAuthContext';
import SuperAdminDashboard from '../dashboard/super-admin/SuperAdminDashboard';
import AdminDashboard from '../dashboard/admin/AdminDashboard';
import MemberDashboard from '../dashboard/member/MemberDashboard';
import UserDashboard from '../dashboard/user/UserDashboard';

const Dashboard = () => {
  const { userProfile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Routing intelligent selon le rôle
  const renderDashboardByRole = () => {
    const role = userProfile?.role || 'user';
    
    switch (role) {
      case 'super-admin':
        return <SuperAdminDashboard />;
      case 'admin':
        return <AdminDashboard />;
      case 'membre':
        return <MemberDashboard />;
      case 'user':
      default:
        return <UserDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderDashboardByRole()}
    </div>
  );
};

export default Dashboard;
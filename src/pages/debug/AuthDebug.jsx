import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { usePermissions } from '../../hooks/usePermissions';

const AuthDebug = () => {
  const { user, userProfile, loading: authLoading } = useAuth();
  const { hasRole, hasPermission, loading: permLoading } = usePermissions();

  if (authLoading || permLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Debug Authentification</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Utilisateur Firebase</h2>
          <pre className="text-sm bg-gray-100 p-3 rounded">
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Profil Firestore</h2>
          <pre className="text-sm bg-gray-100 p-3 rounded">
            {JSON.stringify(userProfile, null, 2)}
          </pre>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Permissions</h2>
          <div className="space-y-2">
            <p><strong>Rôle:</strong> {userProfile?.role || 'Aucun'}</p>
            <p><strong>Super Admin:</strong> {hasRole('super-admin') ? '✅' : '❌'}</p>
            <p><strong>Admin:</strong> {hasRole('admin') ? '✅' : '❌'}</p>
            <p><strong>Member:</strong> {hasRole('member') ? '✅' : '❌'}</p>
            <p><strong>Platform Manage:</strong> {hasPermission('platform:manage') ? '✅' : '❌'}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Actions</h2>
          <div className="space-y-2">
            <a href="/super-admin/dashboard" className="block bg-blue-500 text-white px-4 py-2 rounded text-center">
              Aller au Super Admin Dashboard
            </a>
            <a href="/admin/dashboard" className="block bg-green-500 text-white px-4 py-2 rounded text-center">
              Aller au Admin Dashboard
            </a>
            <a href="/member-dashboard" className="block bg-purple-500 text-white px-4 py-2 rounded text-center">
              Aller au Member Dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthDebug;
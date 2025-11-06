// src/layouts/AdminLayout.jsx
import React from 'react';

const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* CONTENU PRINCIPAL SEULEMENT - PAS DE HEADER */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
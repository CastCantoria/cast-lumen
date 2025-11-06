// src/pages/dashboard/member/MemberDashboard.jsx
import React from 'react';
import { useAuth } from '../../../contexts/AuthContext';

const MemberDashboard = () => {
  const { userProfile } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* 🎵 Header Membre */}
      <div className="bg-gradient-to-r from-green-900 to-emerald-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl sm:text-3xl font-bold">Mon Espace Membre CAST</h1>
              <p className="text-green-200 mt-1">
                Bienvenue, {userProfile?.displayName || 'Cher membre'} !
              </p>
              <p className="text-green-300 text-sm mt-1">
                Accès complet aux ressources musicales et événements
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center shadow-lg">
                <span className="mr-2 text-lg">🎵</span>
                MEMBRE ACTIF
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 📊 Statistiques rapides */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-4 text-center">
            <div className="text-2xl text-green-600 mb-1">📅</div>
            <div className="text-lg font-bold text-gray-900">3</div>
            <div className="text-xs text-gray-600">Répétitions</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 text-center">
            <div className="text-2xl text-blue-600 mb-1">🎵</div>
            <div className="text-lg font-bold text-gray-900">12</div>
            <div className="text-xs text-gray-600">Partitions</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 text-center">
            <div className="text-2xl text-purple-600 mb-1">👥</div>
            <div className="text-lg font-bold text-gray-900">2</div>
            <div className="text-xs text-gray-600">Événements</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 text-center">
            <div className="text-2xl text-orange-600 mb-1">⭐</div>
            <div className="text-lg font-bold text-gray-900">Actif</div>
            <div className="text-xs text-gray-600">Statut</div>
          </div>
        </div>
      </div>

      {/* 📦 Contenu Membre */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Carte Répétitions */}
          <div className="bg-white rounded-xl shadow-lg border border-green-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📅 Mes Répétitions</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Répétition Soprano</p>
                  <p className="text-sm text-gray-600">Lundi - 18:00-20:00</p>
                </div>
                <span className="bg-green-500 text-white px-2 py-1 rounded text-xs">Confirmé</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Répétition Générale</p>
                  <p className="text-sm text-gray-600">Samedi - 14:00-17:00</p>
                </div>
                <span className="bg-yellow-500 text-white px-2 py-1 rounded text-xs">En attente</span>
              </div>
            </div>
          </div>

          {/* Carte Partitions */}
          <div className="bg-white rounded-xl shadow-lg border border-blue-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🎵 Mes Partitions</h3>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="font-medium text-gray-900">Ave Maria</p>
                <p className="text-sm text-gray-600">Schubert - Soprano</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="font-medium text-gray-900">Hallelujah</p>
                <p className="text-sm text-gray-600">Cohen - Tous voix</p>
              </div>
            </div>
          </div>

          {/* Carte Événements */}
          <div className="bg-white rounded-xl shadow-lg border border-purple-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">👥 Mes Événements</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Concert Printemps</p>
                  <p className="text-sm text-gray-600">15 Mars - Confirmé</p>
                </div>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">✅</span>
              </div>
            </div>
          </div>

          {/* Carte Profil Membre */}
          <div className="bg-white rounded-xl shadow-lg border border-orange-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">👤 Mon Profil Membre</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Voix:</span>
                <span className="font-medium">{userProfile?.vocalRange || 'Non définie'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Statut:</span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Actif</span>
              </div>
              <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition-colors mt-4">
                Gérer mon profil
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;
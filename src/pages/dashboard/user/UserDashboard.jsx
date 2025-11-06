// src/pages/dashboard/user/UserDashboard.jsx
import React from 'react';
import { useAuth } from '../../../contexts/AuthContext';

const UserDashboard = () => {
  const { userProfile } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* 👤 Header Utilisateur */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl sm:text-3xl font-bold">Mon Espace Personnel</h1>
              <p className="text-blue-200 mt-1">
                Bienvenue, {userProfile?.displayName || 'Cher utilisateur'} !
              </p>
              <p className="text-blue-300 text-sm mt-1">
                Découvrez CAST Cantoria et ses activités
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center shadow-lg">
                <span className="mr-2 text-lg">👤</span>
                UTILISATEUR
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 📊 Introduction */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Bienvenue dans la communauté CAST !</h2>
          <p className="text-gray-600 mb-4">
            En tant qu'utilisateur, vous avez accès aux informations publiques de la chorale. 
            Pour devenir membre et accéder à l'ensemble des fonctionnalités, contactez-nous.
          </p>
          <div className="flex flex-wrap gap-3">
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">🎵 Concerts publics</span>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">📅 Calendrier</span>
            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">👥 Communauté</span>
          </div>
        </div>
      </div>

      {/* 📦 Contenu Utilisateur */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Carte Calendrier */}
          <div className="bg-white rounded-xl shadow-lg border border-blue-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📅 Événements Publics</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Concert de Printemps</p>
                  <p className="text-sm text-gray-600">15 Mars 2024 - 20:00</p>
                </div>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Gratuit</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Portes Ouvertes</p>
                  <p className="text-sm text-gray-600">22 Mars 2024 - 14:00</p>
                </div>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Découverte</span>
              </div>
            </div>
          </div>

          {/* Carte Ressources */}
          <div className="bg-white rounded-xl shadow-lg border border-green-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📚 Ressources</h3>
            <div className="space-y-3">
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="font-medium text-gray-900">Présentation CAST</p>
                <p className="text-sm text-gray-600">Découvrez notre chorale</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="font-medium text-gray-900">Répertoire Public</p>
                <p className="text-sm text-gray-600">Extraits musicaux</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="font-medium text-gray-900">Devenir Membre</p>
                <p className="text-sm text-gray-600">Processus d'admission</p>
              </div>
            </div>
          </div>

          {/* Carte Activités */}
          <div className="bg-white rounded-xl shadow-lg border border-purple-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🎪 Activités</h3>
            <div className="space-y-3">
              <div className="flex items-center p-3 bg-purple-50 rounded-lg">
                <span className="text-2xl mr-3">🎵</span>
                <div>
                  <p className="font-medium text-gray-900">Atelier Chant</p>
                  <p className="text-sm text-gray-600">Tous les mercredis</p>
                </div>
              </div>
              <div className="flex items-center p-3 bg-purple-50 rounded-lg">
                <span className="text-2xl mr-3">👥</span>
                <div>
                  <p className="font-medium text-gray-900">Rencontres</p>
                  <p className="text-sm text-gray-600">Événements communautaires</p>
                </div>
              </div>
            </div>
          </div>

          {/* Carte Profil */}
          <div className="bg-white rounded-xl shadow-lg border border-orange-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">👤 Mon Compte</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Nom:</span>
                <span className="font-medium">{userProfile?.displayName || 'Non défini'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">{userProfile?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Rôle:</span>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Utilisateur</span>
              </div>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors mt-4">
                Modifier mon profil
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { moderationService } from '../../services/moderationService';

const Dashboard = () => {
  const { currentUser, userProfile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalMedia: 0,
    pendingModeration: 0,
    approvedMedia: 0,
    usersCount: 0
  });
  const [loading, setLoading] = useState(true);

  // 🔍 LOGS DE DÉBOGAGE
  console.log("🔍 Dashboard Router - Loading:", authLoading);
  console.log("🔍 Dashboard Router - CurrentUser:", currentUser?.email);
  console.log("🔍 Dashboard Router - UserProfile:", userProfile);
  console.log("🔍 Dashboard Router - Rôle:", userProfile?.role);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (userProfile) {
        try {
          setLoading(true);
          
          // Charger les statistiques de modération
          const moderationStats = await moderationService.getModerationStats();
          
          // Ici vous pouvez ajouter d'autres appels pour les statistiques utilisateurs, etc.
          setStats({
            totalMedia: moderationStats.total,
            pendingModeration: moderationStats.pending,
            approvedMedia: moderationStats.approved,
            usersCount: 0 // À implémenter si vous avez un service users
          });
          
        } catch (error) {
          console.error('Erreur chargement dashboard:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadDashboardData();
  }, [userProfile]);

  // État de chargement avec UI améliorée
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-gray-600 text-lg font-medium">
            Chargement de votre tableau de bord...
          </div>
        </div>
      </div>
    );
  }

  // Si pas d'utilisateur, rediriger vers login
  if (!currentUser) {
    console.log("🔍 Dashboard Router - Redirection vers /login (pas de currentUser)");
    return <Navigate to="/login" replace />;
  }

  // Si pas de profil utilisateur, attendre ou rediriger
  if (!userProfile) {
    console.log("🔍 Dashboard Router - Profil utilisateur non chargé, attente...");
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-gray-600 text-lg font-medium">
            Finalisation de votre profil...
          </div>
          <p className="text-gray-500 text-sm mt-2">
            Email: {currentUser.email}
          </p>
        </div>
      </div>
    );
  }

  // Redirection basée sur le rôle pour les dashboards spécifiques
  const canAccessModeration = userProfile && moderationService.canAutoApprove(userProfile.role);

  // Si l'utilisateur a un rôle spécifique, rediriger vers le dashboard correspondant
  if (userProfile.role && userProfile.role !== 'user') {
    console.log(`🔍 Dashboard Router - Redirection vers /dashboard/${userProfile.role}`);
    switch (userProfile.role) {
      case 'super-admin':
        return <Navigate to="/dashboard/super-admin" replace />;
      case 'admin':
        return <Navigate to="/dashboard/admin" replace />;
      case 'member':
        return <Navigate to="/dashboard/member" replace />;
      default:
        // Fallback pour les rôles non reconnus
        console.warn(`🔍 Dashboard Router - Rôle non reconnu: ${userProfile.role}, redirection vers user dashboard`);
        return <Navigate to="/dashboard/user" replace />;
    }
  }

  // Dashboard principal pour les utilisateurs avec rôle 'user' ou sans rôle spécifique
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                  <span className="text-2xl text-white">📊</span>
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                    Tableau de Bord
                  </h1>
                  <p className="text-gray-600 mt-2 text-lg">
                    Bienvenue, {userProfile?.displayName || userProfile?.email || 'Utilisateur'}
                  </p>
                </div>
              </div>
              
              {/* Rôle et informations */}
              <div className="flex flex-wrap gap-4 mt-4">
                <div className="text-sm text-gray-500 bg-white px-4 py-2 rounded-lg border border-gray-200">
                  <span className="font-medium text-gray-700">Rôle :</span>{' '}
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    userProfile?.role === 'super-admin' 
                      ? 'bg-purple-100 text-purple-800'
                      : userProfile?.role === 'admin'
                      ? 'bg-blue-100 text-blue-800'
                      : userProfile?.role === 'moderator'
                      ? 'bg-orange-100 text-orange-800'
                      : userProfile?.role === 'member'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {userProfile?.role || 'user'}
                  </span>
                </div>
                <div className="text-sm text-gray-500 bg-white px-4 py-2 rounded-lg border border-gray-200">
                  <span className="font-medium text-gray-700">Membre depuis :</span>{' '}
                  {userProfile?.createdAt ? 
                    new Date(userProfile.createdAt.toDate()).toLocaleDateString('fr-FR') 
                    : 'Date inconnue'
                  }
                </div>
              </div>
            </div>
            
            {/* Actions rapides */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate('/gallery')}
                className="px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center gap-2"
              >
                <span>👁️</span>
                Voir la galerie
              </button>
              <button
                onClick={() => navigate('/upload')}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center gap-2"
              >
                <span>📤</span>
                Uploader un média
              </button>
            </div>
          </div>
        </div>

        {/* Carte de modération pour admin/super-admin */}
        {canAccessModeration && (
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-xl p-6 mb-8 text-white">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-3">
                  <div className="p-2 bg-white bg-opacity-20 rounded-xl">
                    <span className="text-2xl">🛡️</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Panel de Modération</h2>
                    <p className="text-blue-100 mt-1">
                      Gérez les médias uploadés par les membres de la communauté
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-4 mt-4">
                  <div className="text-sm bg-white bg-opacity-20 px-3 py-2 rounded-lg">
                    <span className="font-medium">⏳ En attente :</span>{' '}
                    <span className="font-bold">{stats.pendingModeration}</span>
                  </div>
                  <div className="text-sm bg-white bg-opacity-20 px-3 py-2 rounded-lg">
                    <span className="font-medium">✅ Approuvés :</span>{' '}
                    <span className="font-bold">{stats.approvedMedia}</span>
                  </div>
                  <div className="text-sm bg-white bg-opacity-20 px-3 py-2 rounded-lg">
                    <span className="font-medium">📊 Total :</span>{' '}
                    <span className="font-bold">{stats.totalMedia}</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => navigate('/admin/media')}
                className="group px-8 py-4 bg-white text-blue-600 rounded-xl hover:bg-gray-50 transition-all duration-300 font-bold flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <span className="text-lg">🛡️</span>
                <div className="text-left">
                  <div className="text-sm opacity-80">Accéder à</div>
                  <div className="text-lg">la modération des médias</div>
                </div>
                <span className="text-xl group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>
          </div>
        )}

        {/* Statistiques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Carte Médias Totaux */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Médias Totaux</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {loading ? '...' : stats.totalMedia}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <span className="text-2xl text-blue-600">📊</span>
              </div>
            </div>
            <div className="mt-4">
              <button
                onClick={() => navigate('/gallery')}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
              >
                Voir la galerie
              </button>
            </div>
          </div>

          {/* Carte En Attente */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">En Attente</p>
                <p className="text-3xl font-bold text-yellow-600 mt-2">
                  {loading ? '...' : stats.pendingModeration}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-xl">
                <span className="text-2xl text-yellow-600">⏳</span>
              </div>
            </div>
            <div className="mt-4">
              {canAccessModeration ? (
                <button
                  onClick={() => navigate('/admin/media')}
                  className="w-full px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm font-medium"
                >
                  Modérer
                </button>
              ) : (
                <div className="text-xs text-gray-500 text-center">
                  Réservé aux modérateurs
                </div>
              )}
            </div>
          </div>

          {/* Carte Approuvés */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approuvés</p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {loading ? '...' : stats.approvedMedia}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <span className="text-2xl text-green-600">✅</span>
              </div>
            </div>
            <div className="mt-4">
              <button
                onClick={() => navigate('/gallery')}
                className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
              >
                Voir dans galerie
              </button>
            </div>
          </div>

          {/* Carte Utilisateurs */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Utilisateurs</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">
                  {loading ? '...' : stats.usersCount || '0'}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <span className="text-2xl text-purple-600">👥</span>
              </div>
            </div>
            <div className="mt-4">
              {userProfile?.role === 'super-admin' ? (
                <button
                  onClick={() => navigate('/admin/users')}
                  className="w-full px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm font-medium"
                >
                  Gérer les utilisateurs
                </button>
              ) : (
                <div className="text-xs text-gray-500 text-center">
                  {userProfile?.role === 'admin' ? 'Super-admin seulement' : 'Réservé aux admins'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions rapides selon le rôle */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Section Upload */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span>📤</span>
              Upload de Médias
            </h3>
            <p className="text-gray-600 mb-4">
              Partagez vos partitions, enregistrements audio, vidéos et images avec la communauté.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/upload')}
                className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <span>📤</span>
                Uploader un nouveau média
              </button>
              <div className="text-xs text-gray-500 text-center">
                Formats supportés: PDF, JPG, PNG, MP3, MP4, DOCX, etc.
              </div>
            </div>
          </div>

          {/* Section Galerie */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span>🎵</span>
              Galerie des Médias
            </h3>
            <p className="text-gray-600 mb-4">
              Découvrez tous les médias approuvés par la communauté C.A.S.T. Cantoria.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/gallery')}
                className="w-full px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <span>👁️</span>
                Explorer la galerie
              </button>
              <div className="text-xs text-gray-500 text-center">
                Partitions, audio, vidéos et images partagés
              </div>
            </div>
          </div>
        </div>

        {/* Informations supplémentaires pour les administrateurs */}
        {(userProfile?.role === 'admin' || userProfile?.role === 'super-admin') && (
          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-yellow-900 mb-3 flex items-center gap-2">
              <span>⚡</span>
              Actions Administrateur
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => navigate('/admin/media')}
                className="p-4 bg-white border border-yellow-300 rounded-xl hover:bg-yellow-50 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🛡️</span>
                  <div>
                    <div className="font-semibold text-yellow-800">Modération</div>
                    <div className="text-sm text-yellow-600">Gérer les médias en attente</div>
                  </div>
                </div>
              </button>
              
              {userProfile?.role === 'super-admin' && (
                <button
                  onClick={() => navigate('/admin/users')}
                  className="p-4 bg-white border border-yellow-300 rounded-xl hover:bg-yellow-50 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">👥</span>
                    <div>
                      <div className="font-semibold text-yellow-800">Utilisateurs</div>
                      <div className="text-sm text-yellow-600">Gérer les comptes</div>
                    </div>
                  </div>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Section pour les utilisateurs réguliers */}
        {userProfile?.role === 'user' && (
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <span>👋</span>
              Bienvenue dans C.A.S.T. Cantoria
            </h3>
            <p className="text-blue-800 mb-4">
              En tant que nouveau membre, vous pouvez explorer la galerie et uploader vos premiers médias.
              Vos uploads seront soumis à modération avant d'être visibles par la communauté.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => navigate('/gallery')}
                className="p-4 bg-white border border-blue-300 rounded-xl hover:bg-blue-50 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">👁️</span>
                  <div>
                    <div className="font-semibold text-blue-800">Explorer la galerie</div>
                    <div className="text-sm text-blue-600">Découvrez les médias partagés</div>
                  </div>
                </div>
              </button>
              
              <button
                onClick={() => navigate('/upload')}
                className="p-4 bg-white border border-blue-300 rounded-xl hover:bg-blue-50 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📤</span>
                  <div>
                    <div className="font-semibold text-blue-800">Partager un média</div>
                    <div className="text-sm text-blue-600">Uploader partitions, audio, vidéos</div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
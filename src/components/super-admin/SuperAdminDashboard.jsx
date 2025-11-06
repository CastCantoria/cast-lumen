// src/components/super-admin/SuperAdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { statsService } from '../../services/statsService';
import './SuperAdminDashboard.css';

const SuperAdminDashboard = () => {
  const [systemStats, setSystemStats] = useState({
    totalUsers: 0,
    activeEvents: 0,
    storageUsed: { used: 0, unit: 'GB', percentage: 0 },
    systemHealth: {},
    lastUpdated: null
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Charger les données au montage du composant
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      console.log('🔄 Chargement des données du dashboard...');
      
      // Charger les statistiques et l'activité en parallèle
      const [stats, activity] = await Promise.all([
        statsService.getGlobalStats(),
        statsService.getRecentActivity(5)
      ]);

      setSystemStats(stats);
      setRecentActivity(activity);
      
      console.log('✅ Données chargées avec succès');

    } catch (err) {
      console.error('❌ Erreur chargement dashboard:', err);
      setError('Erreur lors du chargement des données');
      // Charger des données mockées en cas d'erreur
      setSystemStats({
        totalUsers: 1234,
        activeEvents: 45,
        storageUsed: { used: 2.3, unit: 'GB', percentage: 65 },
        systemHealth: {
          api: { status: 'healthy', responseTime: 120, uptime: 99.9 },
          database: { status: 'healthy', responseTime: 45, uptime: 100 },
          storage: { status: 'warning', usage: 85, monitoring: true }
        },
        lastUpdated: new Date().toISOString()
      });
      setRecentActivity(statsService.getMockActivities());
    } finally {
      setLoading(false);
    }
  };

  // Formater la date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleTimeString('fr-FR');
  };

  // Formater le timestamp d'activité
  const formatActivityTime = (timestamp) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffMinutes = Math.floor((now - activityTime) / (1000 * 60));
    
    if (diffMinutes < 1) return 'À l\'instant';
    if (diffMinutes < 60) return `Il y a ${diffMinutes} min`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `Il y a ${diffHours} h`;
    
    return activityTime.toLocaleDateString('fr-FR');
  };

  if (loading) {
    return (
      <div className="super-admin-dashboard">
        <div className="dashboard-header">
          <h1>Tableau de Bord Super Admin</h1>
        </div>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="super-admin-dashboard">
      {/* Header avec actions rapides et recherche */}
      <div className="dashboard-header">
        <div>
          <h1>Tableau de Bord Super Admin</h1>
          <p>Vue d'ensemble du système et outils d'administration</p>
          {systemStats.lastUpdated && (
            <p className="last-updated">
              Dernière mise à jour: {formatDate(systemStats.lastUpdated)}
            </p>
          )}
        </div>
        <div className="header-actions">
          <button 
            onClick={loadDashboardData}
            className="btn btn-secondary"
            disabled={loading}
          >
            🔄 Actualiser
          </button>
          <button className="btn btn-primary">
            📦 Backup System
          </button>
        </div>
      </div>

      {error && (
        <div className="error-banner">
          ⚠️ {error}
        </div>
      )}

      {/* Métriques principales */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-content">
            <div>
              <p className="stat-label">Utilisateurs Totaux</p>
              <h3 className="stat-value">{systemStats.totalUsers.toLocaleString()}</h3>
              <span className="trend positive">👥 Communauté</span>
            </div>
            <div className="stat-icon-wrapper bg-blue">
              <span className="stat-icon">👥</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <div>
              <p className="stat-label">Événements Actifs</p>
              <h3 className="stat-value">{systemStats.activeEvents}</h3>
              <span className="trend positive">📅 En cours</span>
            </div>
            <div className="stat-icon-wrapper bg-green">
              <span className="stat-icon">📅</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <div>
              <p className="stat-label">Stockage Utilisé</p>
              <h3 className="stat-value">
                {systemStats.storageUsed.used}{systemStats.storageUsed.unit}
              </h3>
              <span className="trend neutral">
                {systemStats.storageUsed.percentage}% utilisé
              </span>
            </div>
            <div className="stat-icon-wrapper bg-purple">
              <span className="stat-icon">💾</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <div>
              <p className="stat-label">Performance</p>
              <h3 className="stat-value">
                {systemStats.systemHealth.api?.uptime || 99.8}%
              </h3>
              <span className="trend positive">⚡ Stable</span>
            </div>
            <div className="stat-icon-wrapper bg-yellow">
              <span className="stat-icon">⚡</span>
            </div>
          </div>
        </div>
      </div>

      {/* Santé système et activité */}
      <div className="content-grid">
        <div className="system-health-panel">
          <h3>État du Système</h3>
          <div className="health-metrics">
            <div className="health-item">
              <div className="health-header">
                <span className="health-status healthy">API Gateway</span>
                <span className="health-percent">
                  {systemStats.systemHealth.api?.uptime || 99.9}%
                </span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill healthy-fill"></div>
              </div>
              <div className="health-detail">
                Response: {systemStats.systemHealth.api?.responseTime || 120}ms
              </div>
            </div>

            <div className="health-item">
              <div className="health-header">
                <span className="health-status healthy">Base de données</span>
                <span className="health-percent">
                  {systemStats.systemHealth.database?.uptime || 100}%
                </span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill healthy-fill full"></div>
              </div>
              <div className="health-detail">
                Response: {systemStats.systemHealth.database?.responseTime || 45}ms
              </div>
            </div>

            <div className="health-item">
              <div className="health-header">
                <span className={`health-status ${
                  systemStats.storageUsed.percentage > 80 ? 'warning' : 'healthy'
                }`}>
                  Stockage
                </span>
                <span className="health-percent">
                  {systemStats.storageUsed.percentage}%
                </span>
              </div>
              <div className="progress-bar">
                <div 
                  className={`progress-fill ${
                    systemStats.storageUsed.percentage > 80 ? 'warning-fill' : 'healthy-fill'
                  }`}
                  style={{ width: `${systemStats.storageUsed.percentage}%` }}
                ></div>
              </div>
              <div className="health-detail">
                {systemStats.storageUsed.used}{systemStats.storageUsed.unit} utilisés
              </div>
            </div>
          </div>
        </div>

        <div className="activity-logs">
          <div className="activity-header">
            <h3>Activité Récente</h3>
            <button 
              onClick={loadDashboardData}
              className="btn-refresh"
              title="Actualiser l'activité"
            >
              🔄
            </button>
          </div>
          <div className="logs-list">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity) => (
                <div key={activity.id} className="log-entry">
                  <div className={`log-icon ${activity.type}`}>
                    {activity.type === 'settings' ? '⚙️' : 
                     activity.type === 'backup' ? '📦' : '👤'}
                  </div>
                  <div className="log-details">
                    <div className="log-header">
                      <span className="log-user">{activity.user}</span>
                      <span className="log-time">
                        {formatActivityTime(activity.timestamp)}
                      </span>
                    </div>
                    <p className="log-action">{activity.action}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-activity">
                <p>Aucune activité récente</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Outils rapides */}
      <div className="admin-tools">
        <h3>Outils d'Administration Rapides</h3>
        <div className="tools-grid">
          <Link to="/super-admin/user-management" className="tool-card">
            <span className="tool-icon">👥</span>
            <span className="tool-title">Gestion Utilisateurs</span>
            <span className="tool-desc">Gérer les accès et rôles</span>
          </Link>
          
          <Link to="/super-admin/platform-settings" className="tool-card">
            <span className="tool-icon">⚙️</span>
            <span className="tool-title">Paramètres Système</span>
            <span className="tool-desc">Configuration globale</span>
          </Link>
          
          <Link to="/super-admin/system-analytics" className="tool-card">
            <span className="tool-icon">📊</span>
            <span className="tool-title">Analytics</span>
            <span className="tool-desc">Statistiques détaillées</span>
          </Link>
          
          <Link to="/super-admin/backup-restore" className="tool-card">
            <span className="tool-icon">📦</span>
            <span className="tool-title">Sauvegarde</span>
            <span className="tool-desc">Manuelle/automatique</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
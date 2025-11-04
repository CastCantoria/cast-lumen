// src/components/super-admin/SuperAdminDashboard.jsx
import React, { useState } from 'react';
import './SuperAdminDashboard.css';

const SuperAdminDashboard = () => {
  const [systemStats] = useState({
    totalUsers: 1234,
    activeEvents: 45,
    storageUsed: 2.3,
    systemHealth: 'healthy'
  });

  const [recentActivity] = useState([
    { time: '14:30', user: 'admin@system', action: 'a modifié les paramètres globaux', type: 'settings' },
    { time: '14:25', user: 'system', action: 'sauvegarde automatique effectuée', type: 'backup' },
    { time: '14:15', user: 'superadmin', action: 'a créé un nouvel utilisateur admin', type: 'user' }
  ]);

  return (
    <div className="super-admin-dashboard">
      {/* Header avec actions rapides et recherche */}
      <div className="dashboard-header">
        <div>
          <h1>Tableau de Bord Super Admin</h1>
          <p>Vue d'ensemble du système et outils d'administration</p>
        </div>
        <div className="header-actions">
          <div className="search-container">
            <input 
              type="text" 
              placeholder="Rechercher..." 
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
          <button className="btn btn-primary">
            📦 Backup System
          </button>
          <button className="btn btn-secondary">
            🗑️ Clear Cache
          </button>
        </div>
      </div>

      {/* Métriques principales */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-content">
            <div>
              <p className="stat-label">Utilisateurs Totaux</p>
              <h3 className="stat-value">1,234</h3>
              <span className="trend positive">↗ +12% ce mois</span>
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
              <h3 className="stat-value">45</h3>
              <span className="trend positive">↗ +5% cette semaine</span>
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
              <h3 className="stat-value">2.3GB</h3>
              <span className="trend neutral">→ +0.3% aujourd'hui</span>
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
              <h3 className="stat-value">99.8%</h3>
              <span className="trend positive">✓ Stable</span>
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
                <span className="health-percent">99.9%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill healthy-fill"></div>
              </div>
              <div className="health-detail">Response: 120ms</div>
            </div>

            <div className="health-item">
              <div className="health-header">
                <span className="health-status healthy">Base de données</span>
                <span className="health-percent">100%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill healthy-fill full"></div>
              </div>
              <div className="health-detail">Response: 45ms</div>
            </div>

            <div className="health-item">
              <div className="health-header">
                <span className="health-status warning">Stockage</span>
                <span className="health-percent">85%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill warning-fill"></div>
              </div>
              <div className="health-detail">Monitoring actif</div>
            </div>
          </div>
        </div>

        <div className="activity-logs">
          <div className="activity-header">
            <h3>Activité Récente</h3>
            <div className="activity-filters">
              <button className="filter-btn active">Tous</button>
              <button className="filter-btn">Système</button>
              <button className="filter-btn">Utilisateurs</button>
            </div>
          </div>
          <div className="logs-list">
            {recentActivity.map((activity, index) => (
              <div key={index} className="log-entry">
                <div className={`log-icon ${activity.type}`}>
                  {activity.type === 'settings' ? '⚙️' : activity.type === 'backup' ? '📦' : '👤'}
                </div>
                <div className="log-details">
                  <div className="log-header">
                    <span className="log-user">{activity.user}</span>
                    <span className="log-time">{activity.time}</span>
                  </div>
                  <p className="log-action">{activity.action}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Outils rapides */}
      <div className="admin-tools">
        <h3>Outils d'Administration Rapides</h3>
        <div className="tools-grid">
          <button className="tool-card">
            <span className="tool-icon">👥</span>
            <span className="tool-title">Gestion Utilisateurs</span>
            <span className="tool-desc">Gérer les accès</span>
          </button>
          
          <button className="tool-card">
            <span className="tool-icon">⚙️</span>
            <span className="tool-title">Paramètres Système</span>
            <span className="tool-desc">Configuration</span>
          </button>
          
          <button className="tool-card">
            <span className="tool-icon">📊</span>
            <span className="tool-title">Analytics</span>
            <span className="tool-desc">Statistiques détaillées</span>
          </button>
          
          <button className="tool-card">
            <span className="tool-icon">📦</span>
            <span className="tool-title">Sauvegarde</span>
            <span className="tool-desc">Manuelle/auto</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
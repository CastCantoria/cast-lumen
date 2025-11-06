import React, { useState, useEffect } from 'react';

const AdminAuditLog = () => {
  const [auditLogs, setAuditLogs] = useState([]);
  const [filter, setFilter] = useState('all');
  const [dateRange, setDateRange] = useState('7days');

  useEffect(() => {
    // Simulation des logs d'audit
    const logs = [
      {
        id: 1,
        admin: 'superadmin@cast.fr',
        action: 'user_created',
        target: 'nouveau@membre.fr',
        details: 'Création d\'un nouvel utilisateur',
        ip: '192.168.1.1',
        timestamp: '2024-01-15 14:30:25',
        severity: 'info'
      },
      {
        id: 2,
        admin: 'admin@cast.fr',
        action: 'permission_modified',
        target: 'utilisateur@test.fr',
        details: 'Modification des permissions utilisateur',
        ip: '192.168.1.100',
        timestamp: '2024-01-15 13:15:42',
        severity: 'warning'
      },
      {
        id: 3,
        admin: 'superadmin@cast.fr',
        action: 'settings_updated',
        target: 'platform_settings',
        details: 'Mise à jour des paramètres de la plateforme',
        ip: '192.168.1.1',
        timestamp: '2024-01-15 12:05:18',
        severity: 'info'
      },
      {
        id: 4,
        admin: 'moderator@cast.fr',
        action: 'content_deleted',
        target: 'event_12345',
        details: 'Suppression d\'un événement',
        ip: '192.168.1.150',
        timestamp: '2024-01-15 11:30:55',
        severity: 'warning'
      },
      {
        id: 5,
        admin: 'admin@cast.fr',
        action: 'backup_created',
        target: 'system_backup',
        details: 'Création d\'une sauvegarde manuelle',
        ip: '192.168.1.100',
        timestamp: '2024-01-15 10:20:33',
        severity: 'info'
      }
    ];
    setAuditLogs(logs);
  }, []);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'info': return 'text-blue-600 bg-blue-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      case 'critical': return 'text-red-800 bg-red-200';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'user_created': return '👤';
      case 'permission_modified': return '🔐';
      case 'settings_updated': return '⚙️';
      case 'content_deleted': return '🗑️';
      case 'backup_created': return '💾';
      default: return '📝';
    }
  };

  const filteredLogs = filter === 'all' 
    ? auditLogs 
    : auditLogs.filter(log => log.severity === filter);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">👁️ Journal d'Audit Administrateur</h2>

      {/* Filtres et contrôles */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filtre par sévérité
            </label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">Tous les événements</option>
              <option value="info">Information</option>
              <option value="warning">Avertissement</option>
              <option value="error">Erreur</option>
              <option value="critical">Critique</option>
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Période
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="7days">7 derniers jours</option>
              <option value="30days">30 derniers jours</option>
              <option value="90days">3 derniers mois</option>
              <option value="1year">1 an</option>
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recherche
            </label>
            <input
              type="text"
              placeholder="Rechercher..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
      </div>

      {/* Statistiques d'audit */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-600">{auditLogs.length}</div>
          <div className="text-sm text-gray-600">Événements total</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-yellow-600">
            {auditLogs.filter(log => log.severity === 'warning').length}
          </div>
          <div className="text-sm text-gray-600">Avertissements</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-red-600">
            {auditLogs.filter(log => log.severity === 'error').length}
          </div>
          <div className="text-sm text-gray-600">Erreurs</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-600">5</div>
          <div className="text-sm text-gray-600">Admins actifs</div>
        </div>
      </div>

      {/* Journal d'audit */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Journal des activités administrateur</h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredLogs.map((log) => (
            <div key={log.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-lg">{getActionIcon(log.action)}</span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium text-gray-900">{log.admin}</p>
                      <span className={`px-2 py-1 text-xs rounded-full ${getSeverityColor(log.severity)}`}>
                        {log.severity}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{log.timestamp}</p>
                  </div>
                  
                  <p className="text-sm text-gray-900 mt-1">{log.details}</p>
                  
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-sm text-gray-600">
                      Cible: <span className="font-medium">{log.target}</span>
                    </span>
                    <span className="text-sm text-gray-600">
                      IP: <span className="font-mono">{log.ip}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredLogs.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <span className="text-4xl mb-2 block">📝</span>
            Aucun événement d'audit trouvé
          </div>
        )}
      </div>

      {/* Actions de journal */}
      <div className="mt-6 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
        <div className="text-sm text-gray-600">
          Affichage de {filteredLogs.length} événements sur {auditLogs.length} total
        </div>
        
        <div className="flex space-x-3">
          <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">
            Exporter le journal
          </button>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors">
            Archiver les anciens logs
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminAuditLog;
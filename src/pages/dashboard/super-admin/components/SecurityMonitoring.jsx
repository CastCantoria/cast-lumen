import React, { useState, useEffect } from 'react';

const SecurityMonitoring = () => {
  const [securityLogs, setSecurityLogs] = useState([]);
  const [threatLevel, setThreatLevel] = useState('low');
  const [activeAlerts, setActiveAlerts] = useState(2);

  useEffect(() => {
    // Simulation des logs de sécurité
    const logs = [
      { id: 1, type: 'login', user: 'admin@cast.fr', ip: '192.168.1.100', timestamp: '2024-01-15 14:30:25', status: 'success' },
      { id: 2, type: 'failed_login', user: 'unknown@test.fr', ip: '203.0.113.42', timestamp: '2024-01-15 14:25:10', status: 'failed' },
      { id: 3, type: 'password_change', user: 'user@cast.fr', ip: '192.168.1.150', timestamp: '2024-01-15 13:45:33', status: 'success' },
      { id: 4, type: 'permission_change', user: 'superadmin@cast.fr', ip: '192.168.1.1', timestamp: '2024-01-15 12:15:07', status: 'success' },
      { id: 5, type: 'suspicious_activity', user: 'test@example.com', ip: '198.51.100.23', timestamp: '2024-01-15 11:30:55', status: 'alert' }
    ];
    setSecurityLogs(logs);
  }, []);

  const getThreatLevelColor = (level) => {
    switch (level) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLogStatusColor = (status) => {
    switch (status) {
      case 'success': return 'text-green-600';
      case 'failed': return 'text-red-600';
      case 'alert': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">🔒 Monitoring de Sécurité</h2>

      {/* Alertes en temps réel */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Niveau de menace</p>
              <p className={`text-xl font-bold capitalize ${getThreatLevelColor(threatLevel).split(' ')[1]}`}>
                {threatLevel}
              </p>
            </div>
            <div className={`p-3 rounded-full ${getThreatLevelColor(threatLevel).split(' ')[0]}`}>
              <span className="text-2xl">🛡️</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Alertes actives</p>
              <p className="text-xl font-bold text-yellow-600">{activeAlerts}</p>
            </div>
            <div className="p-3 rounded-full bg-yellow-100">
              <span className="text-2xl">⚠️</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Connexions (24h)</p>
              <p className="text-xl font-bold text-blue-600">247</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <span className="text-2xl">🔐</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tentatives échouées</p>
              <p className="text-xl font-bold text-red-600">12</p>
            </div>
            <div className="p-3 rounded-full bg-red-100">
              <span className="text-2xl">🚫</span>
            </div>
          </div>
        </div>
      </div>

      {/* Logs de sécurité */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Journal de sécurité en temps réel</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilisateur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IP
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Horodatage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {securityLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 capitalize">
                      {log.type.replace('_', ' ')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{log.user}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-mono">{log.ip}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{log.timestamp}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium capitalize ${getLogStatusColor(log.status)}`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Actions de sécurité */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions de sécurité rapides</h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="font-medium text-gray-900">Forcer la déconnexion de tous les utilisateurs</div>
              <div className="text-sm text-gray-600">Déconnecte immédiatement toutes les sessions actives</div>
            </button>
            
            <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="font-medium text-gray-900">Scanner les vulnérabilités</div>
              <div className="text-sm text-gray-600">Lance un scan de sécurité complet</div>
            </button>
            
            <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="font-medium text-gray-900">Révoquer tous les tokens</div>
              <div className="text-sm text-gray-600">Invalide tous les tokens d'accès existants</div>
            </button>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Paramètres de sécurité</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">Authentification à deux facteurs</div>
                <div className="text-sm text-gray-600">Recommandé pour tous les administrateurs</div>
              </div>
              <button className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600">
                Activer
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">Limite de tentatives de connexion</div>
                <div className="text-sm text-gray-600">5 tentatives maximum</div>
              </div>
              <div className="text-sm text-gray-600">Activé</div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">Expiration des sessions</div>
                <div className="text-sm text-gray-600">24 heures</div>
              </div>
              <div className="text-sm text-gray-600">Configuré</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityMonitoring;
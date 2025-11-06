import React, { useState } from 'react';

const AdvancedReporting = () => {
  const [reportType, setReportType] = useState('user_activity');
  const [dateRange, setDateRange] = useState('7days');
  const [generating, setGenerating] = useState(false);

  const reportTemplates = [
    { id: 'user_activity', name: 'Activité des utilisateurs', icon: '👥' },
    { id: 'event_performance', name: 'Performance des événements', icon: '📅' },
    { id: 'financial', name: 'Rapport financier', icon: '💰' },
    { id: 'system_usage', name: 'Utilisation système', icon: '📊' },
    { id: 'security_audit', name: 'Audit de sécurité', icon: '🔒' },
    { id: 'content_analytics', name: 'Analytics de contenu', icon: '📝' }
  ];

  const handleGenerateReport = async () => {
    setGenerating(true);
    try {
      // Simulation de génération de rapport
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('Rapport généré avec succès !');
    } catch (error) {
      alert('Erreur lors de la génération du rapport');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">📋 Rapports Avancés</h2>

      {/* Sélection du rapport */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Générateur de rapports</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type de rapport
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {reportTemplates.map(template => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
          </div>

          <div>
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
              <option value="custom">Période personnalisée</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleGenerateReport}
            disabled={generating}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors flex items-center"
          >
            {generating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Génération...
              </>
            ) : (
              <>
                <span className="mr-2">📄</span>
                Générer le rapport
              </>
            )}
          </button>
        </div>
      </div>

      {/* Templates de rapports */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Modèles de rapports</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reportTemplates.map(template => (
            <div
              key={template.id}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                reportType === template.id
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-purple-300'
              }`}
              onClick={() => setReportType(template.id)}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{template.icon}</span>
                <div>
                  <div className="font-medium text-gray-900">{template.name}</div>
                  <div className="text-sm text-gray-600">Rapport détaillé</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rapports récents */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Rapports récents</h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {[
            { id: 1, name: 'user_activity_2024_01', date: '2024-01-15', type: 'Activité utilisateurs', status: 'completed' },
            { id: 2, name: 'financial_q4_2023', date: '2024-01-10', type: 'Rapport financier', status: 'completed' },
            { id: 3, name: 'security_audit_jan', date: '2024-01-05', type: 'Audit sécurité', status: 'completed' }
          ].map(report => (
            <div key={report.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600">📊</span>
                </div>
                <div>
                  <div className="font-medium text-gray-900">{report.name}</div>
                  <div className="text-sm text-gray-600">
                    {report.type} • Généré le {report.date}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  Terminé
                </span>
                <button className="text-purple-600 hover:text-purple-800 text-sm">
                  Télécharger
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdvancedReporting;
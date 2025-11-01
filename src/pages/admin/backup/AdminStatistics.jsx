import React, { useEffect, useState } from 'react';
import SubPageHeader from '../../components/layout/SubPageHeader';
import { statsService } from '../../services/statsService';

const AdminStatistics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const s = await statsService.getAllStatistics();
        setStats(s);
      } catch (e) {
        setError(e.message || String(e));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div>
      <SubPageHeader title="Statistiques" backLabel="Retour au Dashboard" />
      <div className="p-6">
        {loading && <div>Chargement des statistiques…</div>}
        {error && <div className="text-red-600">Erreur: {error}</div>}
        {stats && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold">Utilisateurs</h3>
              <pre className="text-sm">{JSON.stringify(stats.userStats, null, 2)}</pre>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold">Événements</h3>
              <div>Actifs: {stats.eventCount?.active ?? '—'}</div>
              <div>Total: {stats.eventCount?.total ?? '—'}</div>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold">Revenus mensuels</h3>
              <div>Total: {stats.monthlyRevenue?.total ?? 0} €</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminStatistics;

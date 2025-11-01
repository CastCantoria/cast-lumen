import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../../config/firebase';

const formatDate = (ts) => {
  if (!ts) return 'Date inconnue';
  try {
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    }).format(d);
  } catch (e) {
    return String(ts);
  }
};

const MemberEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [monthFilter, setMonthFilter] = useState('all');
  const [sectionFilter, setSectionFilter] = useState('');
  const [rsvpLoading, setRsvpLoading] = useState(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const q = query(collection(db, 'events'), orderBy('date', 'asc'));
        const snap = await getDocs(q);
        const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        if (mounted) setEvents(items);
      } catch (err) {
        console.error('Erreur fetch events:', err);
        if (mounted) setError('Impossible de charger les événements');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => { mounted = false; };
  }, []);

  const handleRSVP = async (eventId) => {
    if (!auth || !auth.currentUser) {
      alert('Vous devez être connecté pour vous inscrire.');
      return;
    }

    setRsvpLoading(eventId);
    try {
      await addDoc(collection(db, 'events', eventId, 'registrations'), {
        userId: auth.currentUser.uid,
        email: auth.currentUser.email || null,
        createdAt: serverTimestamp()
      });
      alert('Inscription enregistrée.');
    } catch (err) {
      console.error('Erreur RSVP:', err);
      alert('Impossible de s\'inscrire.');
    } finally {
      setRsvpLoading(null);
    }
  };

  const filteredEvents = events.filter((ev) => {
    // monthFilter: ev.date is Firestore Timestamp or JS Date
    if (monthFilter !== 'all' && ev.date) {
      const d = ev.date.toDate ? ev.date.toDate() : new Date(ev.date);
      const m = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
      if (m !== monthFilter) return false;
    }
    if (sectionFilter) {
      const sec = (ev.section || '').toLowerCase();
      if (!sec.includes(sectionFilter.toLowerCase())) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Événements</h1>

      <div className="flex gap-4 items-center">
        <div>
          <label className="text-sm block">Mois</label>
          <select value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)} className="px-3 py-2 border rounded">
            <option value="all">Tous</option>
            {/* generate next 12 months */}
            {Array.from({length:12}).map((_,i) => {
              const d = new Date(); d.setMonth(d.getMonth()+i);
              const val = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
              const label = d.toLocaleString('fr-FR', { month: 'long', year: 'numeric' });
              return <option key={val} value={val}>{label}</option>;
            })}
          </select>
        </div>

        <div>
          <label className="text-sm block">Section</label>
          <input value={sectionFilter} onChange={(e) => setSectionFilter(e.target.value)} placeholder="ex: soprano" className="px-3 py-2 border rounded" />
        </div>
      </div>

      {loading ? (
        <div className="p-6 bg-white rounded shadow text-center">Chargement des événements...</div>
      ) : error ? (
        <div className="p-6 bg-red-50 rounded shadow text-red-700">{error}</div>
      ) : events.length === 0 ? (
        <div className="p-6 bg-white rounded shadow text-center">Aucun événement trouvé.</div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredEvents.map(ev => (
            <div key={ev.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold">{ev.title || 'Sans titre'}</h2>
                  <p className="text-sm text-gray-600">{ev.location || ''} {ev.section ? `• ${ev.section}` : ''}</p>
                </div>
                <div className="text-sm text-gray-500">{formatDate(ev.date)}</div>
              </div>
              {ev.description && <p className="mt-2 text-gray-700">{ev.description}</p>}
              <div className="mt-3">
                <button disabled={rsvpLoading===ev.id} onClick={() => handleRSVP(ev.id)} className="px-3 py-1 bg-green-600 text-white rounded">{rsvpLoading===ev.id ? 'Inscription...' : 'S\'inscrire'}</button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default MemberEvents;
import React, { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from "../lib/firebase";

// A small admin UI to browse a set of known top-level collections,
// filter/sort documents, add a new document, and export the current view as CSV.

const KNOWN_COLLECTIONS = [
  'Tout',
  'users',
  'events',
  'joinRequests',
  'repertoire',
  'registrations',
  'members',
  'admins',
];

function toCSV(rows) {
  if (!rows || rows.length === 0) return '';
  const keys = Array.from(rows.reduce((s, r) => {
    Object.keys(r).forEach(k => s.add(k));
    return s;
  }, new Set()));

  const header = keys.join(',');
  const lines = rows.map(r => keys.map(k => {
    let v = r[k];
    if (v === undefined || v === null) return '';
    if (typeof v === 'object') v = JSON.stringify(v).replace(/\n/g, ' ');
    return '"' + String(v).replace(/"/g, '""') + '"';
  }).join(','));

  return [header, ...lines].join('\n');
}

export default function CollectionsBrowser({ initial = 'users' }) {
  const [collectionName, setCollectionName] = useState(initial);
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('');
  const [sortKey, setSortKey] = useState('');
  const [addJson, setAddJson] = useState('{\n  \n}');
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editJson, setEditJson] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => { load(); }, [collectionName]);

  const load = async () => {
    setLoading(true);
    try {
      if (collectionName === 'Tout') {
        // fetch all known collections and merge
        const all = [];
        await Promise.all(KNOWN_COLLECTIONS.filter(c => c !== 'Tout').map(async (c) => {
          try {
            const snap = await getDocs(collection(db, c));
            snap.docs.forEach(d => all.push({ __collection: c, id: d.id, ...d.data() }));
          } catch (e) {
            console.warn('Erreur lecture collection', c, e);
          }
        }));
        setDocs(all);
      } else {
        const snap = await getDocs(collection(db, collectionName));
        const fetched = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setDocs(fetched);
      }
    } catch (err) {
      console.error('Erreur chargement collection', collectionName, err);
      setDocs([]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = docs.filter(d => {
    if (!filter) return true;
    const s = filter.toLowerCase();
    return Object.values(d).some(v => String(v).toLowerCase().includes(s));
  });

  const sorted = sortKey ? [...filtered].sort((a, b) => {
    const av = a[sortKey]; const bv = b[sortKey];
    if (av == null) return 1; if (bv == null) return -1;
    if (typeof av === 'string') return av.localeCompare(String(bv));
    if (av > bv) return 1; if (av < bv) return -1; return 0;
  }) : filtered;

  const onExport = () => {
    const csv = toCSV(sorted);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${collectionName}-${new Date().toISOString()}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const startEdit = (row) => {
    setEditingId(row.id);
    setEditJson(JSON.stringify(row, null, 2));
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditJson('');
  };

  const saveEdit = async (row) => {
    try {
      const parsed = JSON.parse(editJson);
      const target = collectionName === 'Tout' ? (row.__collection || 'users') : collectionName;
      // Remove helper keys from parsed before saving
      const { id, __collection, ...toSave } = parsed;
      await updateDoc(doc(db, target, row.id), toSave);
      await load();
      cancelEdit();
    } catch (err) {
      console.error('Erreur sauvegarde:', err);
      alert('Erreur sauvegarde: ' + (err.message || err));
    }
  };

  const onAdd = async () => {
    try {
      setAdding(true);
      const parsed = JSON.parse(addJson);
      await addDoc(collection(db, collectionName), parsed);
      setAddJson('{\n  \n}');
      await load();
    } catch (err) {
      console.error('Erreur ajout doc:', err);
      alert('Échec ajout document: ' + (err.message || err));
    } finally {
      setAdding(false);
    }
  };

  const keys = Array.from(sorted.reduce((s, r) => { Object.keys(r).forEach(k => s.add(k)); return s; }, new Set()));

  // pagination calculations
  const totalRows = sorted.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / rowsPerPage));
  const paged = sorted.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 overflow-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-600">Collection</label>
          <select value={collectionName} onChange={e => setCollectionName(e.target.value)} className="border rounded px-2 py-1">
            {KNOWN_COLLECTIONS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input className="border rounded px-2 py-1" placeholder="Filtrer..." value={filter} onChange={e => setFilter(e.target.value)} />
          <select className="border rounded px-2 py-1" value={sortKey} onChange={e => setSortKey(e.target.value)}>
            <option value="">Trier par...</option>
            {keys.map(k => <option value={k} key={k}>{k}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onExport} className="bg-green-600 text-white px-3 py-1 rounded">Exporter CSV</button>
          <button onClick={load} className="bg-blue-600 text-white px-3 py-1 rounded">Recharger</button>
        </div>
      </div>

      {loading ? (
        <div className="text-center p-6">Chargement...</div>
      ) : (
        <div className="overflow-x-auto">
          {sorted.length === 0 ? (
            <div className="text-gray-500">Aucun document</div>
          ) : (
            <>
            <table className="min-w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  {keys.map(k => (
                    <th key={k} className="px-3 py-2 text-left text-xs font-medium text-gray-600 border">{k}</th>
                  ))}
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paged.map(d => (
                  <tr key={d.id} className="border-b hover:bg-gray-50">
                    {keys.map(k => (
                      <td key={k} className="px-3 py-2 align-top text-sm">
                        {editingId === d.id ? (
                          // while editing, show nothing per-cell, editing happens in editor below
                          null
                        ) : (
                          typeof d[k] === 'object' ? <pre className="whitespace-pre-wrap text-xs">{JSON.stringify(d[k], null, 2)}</pre> : String(d[k] ?? '')
                        )}
                      </td>
                    ))}
                    <td className="px-3 py-2 align-top text-sm">
                      {editingId === d.id ? (
                        <div className="flex gap-2">
                          <button onClick={() => saveEdit(d)} className="bg-green-600 text-white px-2 py-1 rounded">Enregistrer</button>
                          <button onClick={cancelEdit} className="px-2 py-1 border rounded">Annuler</button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button onClick={() => startEdit(d)} className="px-2 py-1 border rounded">Modifier</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Inline editor area for the editing row */}
            {editingId && (
              <div className="mt-3 p-3 border rounded bg-white">
                <label className="text-sm font-medium">Éditer JSON</label>
                <textarea rows={10} className="w-full border rounded mt-2 p-2 font-mono text-xs" value={editJson} onChange={e => setEditJson(e.target.value)} />
                <div className="flex gap-2 mt-2">
                  <button onClick={() => {
                    const row = sorted.find(r => r.id === editingId) || paged.find(r => r.id === editingId);
                    saveEdit(row);
                  }} className="bg-green-600 text-white px-3 py-1 rounded">Enregistrer</button>
                  <button onClick={cancelEdit} className="px-3 py-1 border rounded">Annuler</button>
                </div>
              </div>
            )}
            </>
          )}
        </div>
      )}

      {/* Pagination controls */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <label className="text-sm">Lignes par page:</label>
          <select value={rowsPerPage} onChange={e => { setRowsPerPage(Number(e.target.value)); setPage(0); }} className="border rounded px-2 py-1">
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} className="px-2 py-1 border rounded">Préc</button>
          <div className="text-sm">{page + 1} / {totalPages} ({totalRows} lignes)</div>
          <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1} className="px-2 py-1 border rounded">Suiv</button>
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-sm text-gray-600">Ajouter un document (JSON)</label>
        <textarea className="w-full border rounded p-2 mt-2" rows={6} value={addJson} onChange={e => setAddJson(e.target.value)} />
        <div className="flex gap-2 mt-2">
          <button onClick={onAdd} disabled={adding} className="bg-blue-600 text-white px-3 py-1 rounded">Ajouter</button>
          <button onClick={() => setAddJson('{\n  \n}')} className="px-3 py-1 border rounded">Réinitialiser</button>
        </div>
      </div>
    </div>
  );
}

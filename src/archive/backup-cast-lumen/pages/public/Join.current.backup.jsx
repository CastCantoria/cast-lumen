import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';

const Join = () => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'choriste',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.firstName || !form.email) {
      setError('Veuillez renseigner au minimum votre prénom et email.');
      return;
    }

    setLoading(true);
    try {
      const col = collection(db, 'joinRequests');
      await addDoc(col, {
        firstName: form.firstName,
        lastName: form.lastName || null,
        email: form.email,
        phone: form.phone || null,
        role: form.role,
        message: form.message || null,
        status: 'pending',
        createdAt: serverTimestamp()
      });

      navigate('/join/success', { state: { firstName: form.firstName, role: form.role } });
    } catch (err) {
      console.error('Erreur enregistrement demande:', err);
      setError('Impossible d’envoyer la demande pour le moment. Réessayez plus tard.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-2xl font-bold mb-4">Nous rejoindre</h1>
          <p className="text-gray-600 mb-6">Remplissez ce formulaire pour nous faire part de votre souhait de rejoindre la chorale ou de devenir bénévole.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <input
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                placeholder="Prénom *"
                className="px-3 py-2 border rounded"
              />
              <input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                placeholder="Nom"
                className="px-3 py-2 border rounded"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email *"
                className="px-3 py-2 border rounded"
              />
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Téléphone"
                className="px-3 py-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Je souhaite rejoindre en tant que</label>
              <select name="role" value={form.role} onChange={handleChange} className="w-full px-3 py-2 border rounded">
                <option value="choriste">Choriste</option>
                <option value="benevole">Bénévole</option>
                <option value="autre">Autre</option>
              </select>
            </div>

            <div>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Message (optionnel)"
                rows={4}
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            {error && <div className="text-red-700 bg-red-50 p-2 rounded">{error}</div>}

            <div className="flex items-center space-x-3">
              <button type="submit" disabled={loading} className={`px-4 py-2 rounded bg-green-600 text-white ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}>
                {loading ? 'Envoi...' : 'Envoyer ma demande'}
              </button>
              <button type="button" onClick={() => navigate('/')} className="px-4 py-2 rounded border">Annuler</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Join;

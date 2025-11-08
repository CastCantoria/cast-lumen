import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, query, where, orderBy } from 'firebase/firestore';
import { db } from '../../../../../lib/firebase';

const AdmissionManagement = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const applicationsRef = collection(db, 'applications');
      const q = query(applicationsRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      
      const apps = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date()
      }));
      
      setApplications(apps);
    } catch (error) {
      console.error('Erreur chargement demandes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      const appRef = doc(db, 'applications', applicationId);
      await updateDoc(appRef, {
        status: newStatus,
        updatedAt: new Date()
      });
      await loadApplications();
    } catch (error) {
      console.error('Erreur mise à jour statut:', error);
    }
  };

  const filteredApplications = applications.filter(app => {
    if (selectedStatus === 'all') return true;
    return app.status === selectedStatus;
  });

  const getStatusButtonClass = (status) => {
    const baseClass = 'px-3 py-1 rounded ';
    switch(status) {
      case 'all':
        return baseClass + (selectedStatus === 'all' ? 'bg-blue-100' : 'bg-gray-100');
      case 'pending':
        return baseClass + (selectedStatus === 'pending' ? 'bg-yellow-100' : 'bg-gray-100');
      case 'approved':
        return baseClass + (selectedStatus === 'approved' ? 'bg-green-100' : 'bg-gray-100');
      case 'rejected':
        return baseClass + (selectedStatus === 'rejected' ? 'bg-red-100' : 'bg-gray-100');
      default:
        return baseClass + 'bg-gray-100';
    }
  };

  const getActionButtonClass = (status, currentStatus) => {
    const baseClass = 'px-3 py-1 rounded ';
    if (status === 'approved') {
      return baseClass + (currentStatus === 'approved' ? 'bg-green-500 text-white' : 'bg-green-100 hover:bg-green-200');
    }
    return baseClass + (currentStatus === 'rejected' ? 'bg-red-500 text-white' : 'bg-red-100 hover:bg-red-200');
  };

  if (loading) return <div className="p-6">Chargement des demandes d'admission...</div>;

  return (
    <div className="p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Gestion des Admissions</h1>
        <div className="flex space-x-4">
          <button 
            className={getStatusButtonClass('all')}
            onClick={() => setSelectedStatus('all')}
          >
            Toutes ({applications.length})
          </button>
          <button 
            className={getStatusButtonClass('pending')}
            onClick={() => setSelectedStatus('pending')}
          >
            En attente ({applications.filter(a => a.status === 'pending').length})
          </button>
          <button 
            className={getStatusButtonClass('approved')}
            onClick={() => setSelectedStatus('approved')}
          >
            Acceptées ({applications.filter(a => a.status === 'approved').length})
          </button>
          <button 
            className={getStatusButtonClass('rejected')}
            onClick={() => setSelectedStatus('rejected')}
          >
            Refusées ({applications.filter(a => a.status === 'rejected').length})
          </button>
        </div>
      </header>

      <div className="space-y-4">
        {filteredApplications.map(application => (
          <div key={application.id} className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-lg">
                  {application.firstName} {application.lastName}
                </h3>
                <p className="text-gray-600">{application.email}</p>
                <p className="text-sm text-gray-500">
                  Soumis le {application.createdAt.toLocaleDateString('fr-FR')}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleStatusChange(application.id, 'approved')}
                  className={getActionButtonClass('approved', application.status)}
                >
                  Accepter
                </button>
                <button
                  onClick={() => handleStatusChange(application.id, 'rejected')}
                  className={getActionButtonClass('rejected', application.status)}
                >
                  Refuser
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Tessiture</p>
                <p>{application.vocalRange || 'Non spécifié'}</p>
              </div>
              <div>
                <p className="text-gray-600">Expérience</p>
                <p>{application.experience || 'Non spécifié'}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-600">Motivations</p>
                <p className="whitespace-pre-line">
                  {application.motivation || 'Non spécifié'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdmissionManagement;
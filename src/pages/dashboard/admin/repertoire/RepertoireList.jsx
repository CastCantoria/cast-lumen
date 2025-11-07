import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../../../lib/firebase';

const RepertoireList = () => {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const scoresSnapshot = await getDocs(collection(db, 'scores'));
        const scoresData = scoresSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setScores(scoresData);
      } catch (error) {
        console.error('Erreur lors du chargement des partitions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
  }, []);

  if (loading) return <div className="p-6">Chargement du répertoire...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Répertoire</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {scores.map(score => (
          <div key={score.id} className="bg-white rounded-lg shadow p-4">
            <h2 className="text-xl font-semibold">{score.title}</h2>
            <p className="text-gray-600">{score.composer}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {score.tags?.map(tag => (
                <span key={tag} className="px-2 py-1 bg-gray-100 rounded text-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RepertoireList;
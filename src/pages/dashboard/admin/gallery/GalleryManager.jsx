import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../../../lib/firebase';

const GalleryManager = () => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const mediaSnapshot = await getDocs(collection(db, 'gallery'));
        const mediaData = mediaSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setMedia(mediaData);
      } catch (error) {
        console.error('Erreur lors du chargement de la galerie:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, []);

  if (loading) return <div className="p-6">Chargement de la galerie...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Galerie Photos</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {media.map(item => (
          <div key={item.id} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
            {item.url && (
              <img 
                src={item.url} 
                alt={item.description || 'Image galerie'}
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-x-0 bottom-0 bg-black bg-opacity-50 text-white p-2 text-sm">
              {item.title || 'Sans titre'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GalleryManager;
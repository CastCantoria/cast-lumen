import React, { useState, useEffect, useRef } from 'react';
import { 
  ref, 
  getDownloadURL, 
  deleteObject,
  uploadBytesResumable 
} from 'firebase/storage';
import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  query, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
// Use the project's config copy which exports storage and db
// config/firebase.js lives at project root `config/firebase.js` (outside src)
import { storage, db as firestore } from '../../../config/firebase'; // Import storage and firestore (db)

// Fonction pour formater la date
const formatDate = (timestamp) => {
  if (!timestamp) return 'Date inconnue';
  
  try {
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  } catch (error) {
    console.error('Erreur de formatage de date:', error);
    return 'Date invalide';
  }
};

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  // Try to load a local gallery index (public/gallery/index.json). If it exists, use it.
  useEffect(() => {
    let mounted = true;

    const loadLocalIndex = async () => {
      try {
        const res = await fetch('/gallery/index.json');
        if (!res.ok) throw new Error('no local index');
        const assets = await res.json();
        if (!mounted) return;
        // Normalize to our images array shape (id,url,fileName,createdAt,size,contentType)
        const localItems = assets.map((a, idx) => ({
          id: `local-${idx}`,
          url: a.url,
          fileName: a.name,
          createdAt: null,
          size: a.size,
          contentType: a.type
        }));
        setImages(localItems);
        setLoading(false);
        return true;
      } catch (err) {
        // no local index, fallback to firestore
        return false;
      }
    };

    (async () => {
      const hasLocal = await loadLocalIndex();
      if (!hasLocal) await loadImages();
    })();

    return () => { mounted = false; };
  }, []);

  const loadImages = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Récupérer les métadonnées depuis Firestore
      const q = query(collection(firestore, 'gallery'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const imagesData = [];
      
      for (const docSnapshot of querySnapshot.docs) {
        const data = docSnapshot.data();
        imagesData.push({
          id: docSnapshot.id,
          url: data.url,
          fileName: data.fileName,
          createdAt: data.createdAt,
          size: data.size,
          contentType: data.contentType
        });
      }
      
      setImages(imagesData);
    } catch (err) {
      console.error('Erreur lors du chargement des images:', err);
      setError('Erreur lors du chargement de la galerie');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // Validation du type de fichier
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Type de fichier non supporté. Utilisez JPEG, PNG, GIF ou WebP.');
      return;
    }

    // Validation de la taille (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('Le fichier est trop volumineux. Taille maximale: 5MB.');
      return;
    }

    try {
      setUploading(true);
      setError('');
      setUploadProgress(0);

      // Générer un nom de fichier unique
      const timestamp = Date.now();
      const fileExtension = file.name.split('.').pop();
      const fileName = `gallery/${timestamp}.${fileExtension}`;
      
      // Référence au stockage
      const storageRef = ref(storage, fileName);
      
      // Upload avec progression
      const uploadTask = uploadBytesResumable(storageRef, file);
      
      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(Math.round(progress));
        },
        (error) => {
          console.error('Erreur upload:', error);
          setError(`Erreur lors de l'upload: ${error.message}`);
          setUploading(false);
        },
        async () => {
          try {
            // Récupérer l'URL de téléchargement
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            
            // Sauvegarder les métadonnées dans Firestore
            await addDoc(collection(firestore, 'gallery'), {
              url: downloadURL,
              fileName: fileName,
              originalName: file.name,
              size: file.size,
              contentType: file.type,
              createdAt: serverTimestamp()
            });
            
            // Recharger la galerie
            await loadImages();
            
            // Réinitialiser le formulaire
            setUploadProgress(0);
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }
          } catch (error) {
            console.error('Erreur sauvegarde métadonnées:', error);
            setError('Erreur lors de la sauvegarde des informations');
          } finally {
            setUploading(false);
          }
        }
      );

    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      setError(`Erreur lors de l'upload: ${error.message}`);
      setUploading(false);
    }
  };

  const deleteImage = async (imageId, fileName) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette image ?')) {
      return;
    }

    try {
      setError('');

      // Supprimer le fichier du Storage
      const fileRef = ref(storage, fileName);
      await deleteObject(fileRef);

      // Supprimer les métadonnées de Firestore
      await deleteDoc(doc(firestore, 'gallery', imageId));

      // Mettre à jour l'état local
      setImages(prev => prev.filter(img => img.id !== imageId));
      
      // Fermer la modal si l'image supprimée était sélectionnée
      if (selectedImage && selectedImage.id === imageId) {
        setSelectedImage(null);
      }

    } catch (error) {
      console.error('Erreur suppression:', error);
      setError('Erreur lors de la suppression de l\'image');
    }
  };

  const openModal = (image) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Chargement de la galerie...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Galerie d'images</h1>
        <p className="text-gray-600">Gérez vos images ({images.length} image(s))</p>
      </div>

      {/* Section d'upload */}
      <div className="mb-8 text-center">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="image/jpeg,image/png,image/gif,image/webp"
          className="hidden"
        />
        <button 
          onClick={triggerFileInput}
          disabled={uploading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
        >
          {uploading ? `Upload en cours... ${uploadProgress}%` : 'Ajouter une image'}
        </button>
        
        {uploading && (
          <div className="mt-4 w-full max-w-md mx-auto bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <span>{error}</span>
          <button 
            onClick={() => setError('')}
            className="absolute top-0 right-0 mt-3 mr-4 text-red-700 hover:text-red-900"
          >
            ×
          </button>
        </div>
      )}

      {/* Galerie d'images */}
      {images.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🖼️</div>
          <p className="text-gray-600 text-lg mb-2">Aucune image dans la galerie</p>
          <p className="text-gray-500">Téléchargez votre première image !</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {images.map((item) => {
            const isLocal = String(item.id).startsWith('local-');
            const ct = (item.contentType || '').toLowerCase();
            const isImage = ct.startsWith('image');
            const isVideo = ct.startsWith('video');
            const isAudio = ct.startsWith('audio');

            return (
              <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-200">
                <div className="relative aspect-w-16 aspect-h-9 bg-gray-100 flex items-center justify-center">
                  {isImage && (
                    <img
                      src={item.url}
                      alt={item.fileName}
                      onClick={() => openModal(item)}
                      loading="lazy"
                      className="w-full h-48 object-cover cursor-pointer hover:opacity-90 transition duration-200"
                    />
                  )}
                  {isVideo && (
                    <video controls className="w-full h-48 object-cover">
                      <source src={item.url} />
                      Votre navigateur ne supporte pas la vidéo.
                    </video>
                  )}
                  {isAudio && (
                    <div className="w-full p-4">
                      <audio controls className="w-full">
                        <source src={item.url} />
                        Votre navigateur ne supporte pas l'audio.
                      </audio>
                    </div>
                  )}

                  {!isLocal && (
                    <button
                      onClick={() => deleteImage(item.id, item.fileName)}
                      className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold transition duration-200"
                      title="Supprimer"
                    >
                      ×
                    </button>
                  )}
                </div>
                <div className="p-3">
                  <span className="text-sm text-gray-500">{formatDate(item.createdAt)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de visualisation */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div 
            className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold">Aperçu</h3>
              <button 
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              {String(selectedImage.contentType || '').toLowerCase().startsWith('image') && (
                <img 
                  src={selectedImage.url} 
                  alt={selectedImage.fileName} 
                  className="max-w-full h-auto mx-auto mb-4 rounded"
                />
              )}

              {String(selectedImage.contentType || '').toLowerCase().startsWith('video') && (
                <video controls className="max-w-full h-auto mx-auto mb-4 rounded">
                  <source src={selectedImage.url} />
                  Votre navigateur ne supporte pas la vidéo.
                </video>
              )}

              {String(selectedImage.contentType || '').toLowerCase().startsWith('audio') && (
                <audio controls className="w-full mb-4">
                  <source src={selectedImage.url} />
                  Votre navigateur ne supporte pas l'audio.
                </audio>
              )}

              <div className="space-y-2 text-sm">
                <p>
                  <strong className="text-gray-700">Date:</strong>{' '}
                  <span className="text-gray-600">{formatDate(selectedImage.createdAt)}</span>
                </p>
                <p>
                  <strong className="text-gray-700">Taille:</strong>{' '}
                  <span className="text-gray-600">
                    {selectedImage.size ? Math.round(selectedImage.size / 1024) : 'N/A'} KB
                  </span>
                </p>
                {!String(selectedImage.id || '').startsWith('local-') && (
                  <button
                    onClick={() => deleteImage(selectedImage.id, selectedImage.fileName)}
                    className="mt-4 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition duration-200"
                  >
                    Supprimer
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
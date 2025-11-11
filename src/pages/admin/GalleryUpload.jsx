// src/pages/admin/GalleryUpload.jsx
import React, { useState, useRef } from 'react';
import { 
  storage, 
  db, 
  auth, 
  ref, 
  uploadBytesResumable, 
  getDownloadURL, 
  addDoc, 
  collection, 
  serverTimestamp,
  secureUploadData 
} from '../../lib/firebase';

const GalleryUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  const fileInputRef = useRef(null);

  // Types de fichiers autorisés
  const ALLOWED_FILE_TYPES = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml'
  ];

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  const validateFile = (file) => {
    if (!file) {
      return 'Aucun fichier sélectionné';
    }

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return `Type de fichier non autorisé. Types acceptés: ${ALLOWED_FILE_TYPES.join(', ')}`;
    }

    if (file.size > MAX_FILE_SIZE) {
      return `Fichier trop volumineux. Taille maximum: ${MAX_FILE_SIZE / 1024 / 1024}MB`;
    }

    return null;
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    setUploadError('');
    setUploadSuccess('');

    const validationError = validateFile(file);
    if (validationError) {
      setUploadError(validationError);
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
    setUploadSuccess('Fichier sélectionné: ' + file.name);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadError('Veuillez sélectionner un fichier');
      return;
    }

    setUploading(true);
    setProgress(0);
    setUploadError('');
    setUploadSuccess('');

    try {
      const user = auth.currentUser;
      
      // Créer une référence de stockage unique
      const timestamp = Date.now();
      const fileExtension = selectedFile.name.split('.').pop();
      const fileName = `gallery_${timestamp}.${fileExtension}`;
      const storageRef = ref(storage, `gallery/${fileName}`);

      // Préparer les données sécurisées
      const uploadData = secureUploadData(selectedFile, user, {
        title: selectedFile.name.replace(/\.[^/.]+$/, ""), // Retirer l'extension
        description: `Image uploadée ${new Date().toLocaleDateString()}`,
        category: 'general',
        tags: []
      });

      // Démarrer l'upload
      const uploadTask = uploadBytesResumable(storageRef, selectedFile);

      uploadTask.on('state_changed',
        (snapshot) => {
          // Mettre à jour la progression
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(Math.round(progress));
        },
        (error) => {
          // Gérer les erreurs d'upload
          console.error('Erreur upload:', error);
          setUploadError(`Erreur lors de l'upload: ${error.message}`);
          setUploading(false);
        },
        async () => {
          try {
            // Upload réussi - obtenir l'URL de téléchargement
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            
            // Ajouter les métadonnées à Firestore
            const docData = {
              ...uploadData,
              fileURL: downloadURL,
              storagePath: uploadTask.snapshot.ref.fullPath,
              dimensions: await getImageDimensions(selectedFile)
            };

            const docRef = await addDoc(collection(db, 'gallery_moderation'), docData);
            
            setUploadSuccess(`✅ Upload réussi! Fichier en attente de modération. ID: ${docRef.id}`);
            setSelectedFile(null);
            setProgress(0);
            
            // Réinitialiser le champ fichier
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }
          } catch (error) {
            console.error('Erreur Firestore:', error);
            setUploadError(`Erreur lors de l'enregistrement: ${error.message}`);
          } finally {
            setUploading(false);
          }
        }
      );

    } catch (error) {
      console.error('Erreur générale:', error);
      setUploadError(`Erreur: ${error.message}`);
      setUploading(false);
    }
  };

  // Helper pour obtenir les dimensions de l'image
  const getImageDimensions = (file) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({
          width: img.width,
          height: img.height
        });
      };
      img.onerror = () => {
        resolve({ width: 0, height: 0 });
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      const inputEvent = { target: { files: [file] } };
      handleFileSelect(inputEvent);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* En-tête */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Uploader dans la Galerie
            </h1>
            <p className="text-gray-600">
              Ajoutez des images à la galerie C.A.S.T. (modération requise)
            </p>
          </div>

          {/* Zone de dépôt */}
          <div 
            className={`border-2 border-dashed rounded-lg p-8 text-center mb-6 transition-colors ${
              selectedFile 
                ? 'border-green-500 bg-green-50' 
                : 'border-gray-300 hover:border-gray-400 bg-gray-50'
            }`}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              accept={ALLOWED_FILE_TYPES.join(',')}
              className="hidden"
              id="file-upload"
            />
            
            <label 
              htmlFor="file-upload" 
              className="cursor-pointer block"
            >
              <div className="flex flex-col items-center justify-center space-y-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                
                <div>
                  <p className="text-lg font-medium text-gray-900">
                    {selectedFile ? 'Fichier sélectionné' : 'Cliquez pour sélectionner ou glissez-déposez'}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {selectedFile 
                      ? selectedFile.name 
                      : `Formats: JPEG, PNG, GIF, WebP, SVG • Max: ${MAX_FILE_SIZE / 1024 / 1024}MB`
                    }
                  </p>
                </div>
                
                <button 
                  type="button"
                  className="bg-cast-green text-white px-6 py-2 rounded-lg hover:bg-cast-green-dark transition-colors"
                >
                  {selectedFile ? 'Changer de fichier' : 'Parcourir les fichiers'}
                </button>
              </div>
            </label>
          </div>

          {/* Informations fichier sélectionné */}
          {selectedFile && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <div>
                    <p className="font-medium text-blue-900">{selectedFile.name}</p>
                    <p className="text-sm text-blue-700">
                      Taille: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • 
                      Type: {selectedFile.type}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Barre de progression */}
          {uploading && (
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Upload en cours...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-cast-green h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Messages d'état */}
          {uploadError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2 text-red-800">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Erreur:</span>
                <span>{uploadError}</span>
              </div>
            </div>
          )}

          {uploadSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2 text-green-800">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Succès!</span>
                <span>{uploadSuccess}</span>
              </div>
            </div>
          )}

          {/* Bouton d'upload */}
          <div className="flex justify-center">
            <button
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              className={`px-8 py-3 rounded-lg font-medium transition-all ${
                !selectedFile || uploading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-cast-green text-white hover:bg-cast-green-dark transform hover:scale-105'
              }`}
            >
              {uploading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Upload en cours...</span>
                </div>
              ) : (
                '📤 Uploader vers la Galerie'
              )}
            </button>
          </div>

          {/* Informations de modération */}
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div className="text-yellow-800">
                <p className="font-medium">Processus de modération</p>
                <p className="text-sm mt-1">
                  Toutes les images uploadées doivent être approuvées par un modérateur avant d'apparaître dans la galerie publique.
                  Vous serez notifié lorsque votre image sera approuvée.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalleryUpload;
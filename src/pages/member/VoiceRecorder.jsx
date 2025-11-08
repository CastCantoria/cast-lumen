import React, { useState } from 'react';

const VoiceRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordings, setRecordings] = useState([]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Enregistreur vocal</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col items-center space-y-4">
          <button 
            className={`p-4 rounded-full ${isRecording ? 'bg-red-500' : 'bg-blue-500'} text-white`}
            onClick={() => setIsRecording(!isRecording)}
          >
            {isRecording ? 'Arrêter' : 'Enregistrer'}
          </button>
          
          <div className="w-full max-w-2xl">
            {/* Visualiseur audio sera ajouté ici */}
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Mes enregistrements</h2>
        <div className="space-y-4">
          {/* Liste des enregistrements sera ajoutée ici */}
        </div>
      </div>
    </div>
  );
};

export default VoiceRecorder;
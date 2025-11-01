import React, { useState } from 'react';

const Tuner = () => {
  const [isListening, setIsListening] = useState(false);
  const [note, setNote] = useState(null);
  const [frequency, setFrequency] = useState(null);
  const [cents, setCents] = useState(0);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Accordeur</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col items-center space-y-8">
          <button
            className={`p-4 rounded-full ${isListening ? 'bg-red-500' : 'bg-blue-500'} text-white`}
            onClick={() => setIsListening(!isListening)}
          >
            {isListening ? 'Arrêter' : 'Démarrer'}
          </button>
          
          {note && (
            <div className="text-center">
              <div className="text-6xl font-bold">{note}</div>
              <div className="text-xl text-gray-600">{frequency?.toFixed(1)} Hz</div>
            </div>
          )}
          
          <div className="w-full max-w-md h-4 bg-gray-200 rounded-full overflow-hidden">
            {/* Indicateur de justesse sera ajouté ici */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tuner;
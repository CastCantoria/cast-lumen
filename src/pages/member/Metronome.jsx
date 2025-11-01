import React, { useState, useEffect } from 'react';

const Metronome = () => {
  const [bpm, setBpm] = useState(120);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Métronome</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col items-center space-y-6">
          <div className="text-6xl font-bold">
            {bpm} BPM
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              className="px-4 py-2 rounded bg-gray-200"
              onClick={() => setBpm(prev => Math.max(40, prev - 5))}
            >
              -5
            </button>
            
            <input
              type="range"
              min="40"
              max="208"
              value={bpm}
              onChange={(e) => setBpm(parseInt(e.target.value))}
              className="w-64"
            />
            
            <button
              className="px-4 py-2 rounded bg-gray-200"
              onClick={() => setBpm(prev => Math.min(208, prev + 5))}
            >
              +5
            </button>
          </div>
          
          <button
            className={`px-8 py-4 rounded-full text-white ${isPlaying ? 'bg-red-500' : 'bg-blue-500'}`}
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? 'Arrêter' : 'Démarrer'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Metronome;
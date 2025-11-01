import React, { useState, useRef, useEffect } from 'react';

const Metronome = () => {
  const [bpm, setBpm] = useState(120);
  const [isPlaying, setIsPlaying] = useState(false);
  const [beatsPerMeasure, setBeatsPerMeasure] = useState(4);
  const [volume, setVolume] = useState(1.0);
  
  const audioContext = useRef(null);
  const intervalId = useRef(null);
  const currentBeat = useRef(0);

  useEffect(() => {
    audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
    
    return () => {
      if (audioContext.current) {
        audioContext.current.close();
      }
      if (intervalId.current) {
        clearInterval(intervalId.current);
      }
    };
  }, []);

  const playClick = () => {
    const osc = audioContext.current.createOscillator();
    const gainNode = audioContext.current.createGain();

    osc.connect(gainNode);
    gainNode.connect(audioContext.current.destination);

    const now = audioContext.current.currentTime;

    // Use different frequencies for the first beat vs others
    osc.frequency.setValueAtTime(
      currentBeat.current === 0 ? 1000 : 800,
      now
    );

    gainNode.gain.setValueAtTime(volume, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    osc.start(now);
    osc.stop(now + 0.1);

    currentBeat.current = (currentBeat.current + 1) % beatsPerMeasure;
  };

  const startStop = () => {
    if (isPlaying) {
      clearInterval(intervalId.current);
    } else {
      currentBeat.current = 0;
      // Calculate interval based on BPM
      const intervalMS = (60 / bpm) * 1000;
      intervalId.current = setInterval(playClick, intervalMS);
    }
    setIsPlaying(!isPlaying);
  };

  const handleBpmChange = (e) => {
    const newBpm = parseInt(e.target.value);
    setBpm(newBpm);
    if (isPlaying) {
      clearInterval(intervalId.current);
      const intervalMS = (60 / newBpm) * 1000;
      intervalId.current = setInterval(playClick, intervalMS);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Métronome</h1>

      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow sm:rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <div className="space-y-6">
              {/* BPM Control */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tempo (BPM): {bpm}
                </label>
                <input
                  type="range"
                  min="40"
                  max="208"
                  value={bpm}
                  onChange={handleBpmChange}
                  className="w-full"
                />
              </div>

              {/* Time Signature */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Temps par mesure
                </label>
                <select
                  value={beatsPerMeasure}
                  onChange={(e) => setBeatsPerMeasure(parseInt(e.target.value))}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="2">2/4</option>
                  <option value="3">3/4</option>
                  <option value="4">4/4</option>
                  <option value="6">6/8</option>
                </select>
              </div>

              {/* Volume Control */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Volume
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Play/Stop Button */}
              <div className="flex justify-center">
                <button
                  onClick={startStop}
                  className={`${
                    isPlaying
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-blue-600 hover:bg-blue-700'
                  } px-8 py-3 rounded-full text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                >
                  {isPlaying ? 'Arrêter' : 'Démarrer'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tap Tempo Button */}
        <div className="mt-6 text-center">
          <button
            onClick={() => {
              // TODO: Implement tap tempo functionality
            }}
            className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Tap Tempo
          </button>
        </div>
      </div>
    </div>
  );
};

export default Metronome;
import React, { useState, useEffect, useRef } from 'react';

const Tuner = () => {
  const [isListening, setIsListening] = useState(false);
  const [pitch, setPitch] = useState(null);
  const [note, setNote] = useState(null);
  const [cents, setCents] = useState(0);
  const audioContext = useRef(null);
  const analyser = useRef(null);
  const mediaStreamSource = useRef(null);

  const noteStrings = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

  const autoCorrelate = (buf, sampleRate) => {
    // Basic autocorrelation function for pitch detection
    let SIZE = buf.length;
    let sumOfSquares = 0;
    for (let i = 0; i < SIZE; i++) {
      let val = buf[i];
      sumOfSquares += val * val;
    }
    let rootMeanSquare = Math.sqrt(sumOfSquares / SIZE);
    if (rootMeanSquare < 0.01) {
      return -1;
    }

    let r1 = 0, r2 = SIZE - 1;
    let thres = 0.2;
    for (let i = 0; i < SIZE/2; i++) {
      if (Math.abs(buf[i]) < thres) { r1 = i; break; }
    }
    for (let i = 1; i < SIZE/2; i++) {
      if (Math.abs(buf[SIZE-i]) < thres) { r2 = SIZE - i; break; }
    }

    let buf2 = buf.slice(r1,r2);
    SIZE = buf2.length;

    let c = new Array(SIZE).fill(0);
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE - i; j++) {
        c[i] = c[i] + buf2[j] * buf2[j+i];
      }
    }

    let d = 0;
    for (let i = 1; i < SIZE; i++) {
      if (c[i] > c[d]) { d = i; }
    }

    let maxValue = -1, maxIndex = -1;
    for (let i = d; i < SIZE; i++) {
      if (c[i] > maxValue) {
        maxValue = c[i];
        maxIndex = i;
      }
    }

    let T0 = maxIndex;
    let x1 = c[T0-1], x2 = c[T0], x3 = c[T0+1];
    let a = (x1 + x3 - 2*x2)/2;
    let b = (x3 - x1)/2;
    if (a) { T0 = T0 - b/(2*a); }

    return sampleRate/T0;
  };

  const getNoteFromPitch = (frequency) => {
    const noteNum = 12 * (Math.log(frequency / 440) / Math.log(2));
    const note = Math.round(noteNum) + 69;
    return {
      note: noteStrings[note % 12],
      cents: Math.round((noteNum - Math.round(noteNum)) * 100)
    };
  };

  const updatePitch = () => {
    if (!analyser.current) return;

    const buffer = new Float32Array(2048);
    analyser.current.getFloatTimeDomainData(buffer);
    const ac = autoCorrelate(buffer, audioContext.current.sampleRate);
    
    if (ac !== -1) {
      setPitch(Math.round(ac));
      const noteData = getNoteFromPitch(ac);
      setNote(noteData.note);
      setCents(noteData.cents);
    } else {
      setPitch(null);
      setNote(null);
      setCents(0);
    }

    if (isListening) {
      requestAnimationFrame(updatePitch);
    }
  };

  const startListening = async () => {
    try {
      if (!audioContext.current) {
        audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamSource.current = audioContext.current.createMediaStreamSource(stream);
      analyser.current = audioContext.current.createAnalyser();
      analyser.current.fftSize = 2048;
      mediaStreamSource.current.connect(analyser.current);
      
      setIsListening(true);
      updatePitch();
    } catch (err) {
      console.error('Error accessing microphone:', err);
    }
  };

  const stopListening = () => {
    setIsListening(false);
    if (mediaStreamSource.current) {
      mediaStreamSource.current.disconnect();
    }
  };

  useEffect(() => {
    return () => {
      stopListening();
      if (audioContext.current) {
        audioContext.current.close();
      }
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Accordeur</h1>

      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow sm:rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex flex-col items-center space-y-6">
              {/* Note Display */}
              <div className="text-center">
                <div className="text-6xl font-bold text-gray-900">
                  {note || '-'}
                </div>
                {pitch && (
                  <div className="text-xl text-gray-500">
                    {pitch.toFixed(1)} Hz
                  </div>
                )}
              </div>

              {/* Tuning Meter */}
              <div className="w-full max-w-md h-8 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-150 ${
                    Math.abs(cents) < 5
                      ? 'bg-green-500'
                      : Math.abs(cents) < 15
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`}
                  style={{
                    width: '4px',
                    marginLeft: `calc(50% + ${(cents/50) * 100}px)`,
                  }}
                />
              </div>

              {/* Cents Display */}
              <div className="text-lg text-gray-700">
                {cents ? `${cents > 0 ? '+' : ''}${cents} cents` : 'En attente...'}
              </div>

              {/* Control Button */}
              <button
                onClick={isListening ? stopListening : startListening}
                className={`${
                  isListening
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-blue-600 hover:bg-blue-700'
                } px-8 py-3 rounded-full text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                {isListening ? 'Arrêter' : 'Démarrer'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tuner;
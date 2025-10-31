// src/components/gallery/AudioPlayer.jsx
import React, { useState, useRef } from 'react';

const AudioPlayer = ({ src, title, compact = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef(null);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    const currentTime = audioRef.current.currentTime;
    const duration = audioRef.current.duration;
    setProgress((currentTime / duration) * 100);
  };

  if (compact) {
    return (
      <div className="flex items-center space-x-3">
        <button
          onClick={togglePlay}
          className="bg-cast-gold text-cast-green p-2 rounded-full hover:bg-opacity-80 transition-colors"
        >
          {isPlaying ? '❚❚' : '▶'}
        </button>
        <div className="flex-1">
          <p className="text-white font-semibold text-sm truncate">{title}</p>
          <div className="w-full bg-gray-600 rounded-full h-1 mt-1">
            <div 
              className="bg-cast-gold h-1 rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        <audio
          ref={audioRef}
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => setIsPlaying(false)}
        >
          <source src={src} type="audio/mpeg" />
        </audio>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-4 shadow-lg">
      <h3 className="text-cast-green font-bold mb-3">{title}</h3>
      <div className="flex items-center space-x-4">
        <button
          onClick={togglePlay}
          className="bg-cast-gold text-cast-green p-3 rounded-full hover:bg-opacity-80 transition-colors text-lg"
        >
          {isPlaying ? '❚❚' : '▶'}
        </button>
        <div className="flex-1">
          <div className="w-full bg-gray-300 rounded-full h-2">
            <div 
              className="bg-cast-green h-2 rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
      >
        <source src={src} type="audio/mpeg" />
      </audio>
    </div>
  );
};

export default AudioPlayer; // ✅ EXPORT DEFAULT CORRECT
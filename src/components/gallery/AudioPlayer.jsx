import React, { useState, useRef, useEffect } from 'react';

const AudioPlayer = ({ src, title, compact = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    // Remonter en haut lors du montage du composant
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    const current = audioRef.current.currentTime;
    const dur = audioRef.current.duration;
    setCurrentTime(current);
    setDuration(dur);
    setProgress((current / dur) * 100);
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    audioRef.current.currentTime = newTime;
    setProgress(percent * 100);
  };

  const formatTime = (seconds) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (compact) {
    return (
      <div className="flex items-center space-x-3">
        <button
          onClick={togglePlay}
          className="bg-cast-gold text-cast-green p-2 rounded-full hover:bg-opacity-80 transition-colors flex-shrink-0"
        >
          {isPlaying ? '❚❚' : '▶'}
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-sm truncate">{title}</p>
          <div 
            className="w-full bg-gray-600 rounded-full h-1 mt-1 cursor-pointer"
            onClick={handleSeek}
          >
            <div 
              className="bg-cast-gold h-1 rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-300 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
        <audio
          ref={audioRef}
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => setIsPlaying(false)}
          onLoadedMetadata={() => setDuration(audioRef.current.duration)}
        >
          <source src={src} type="audio/mpeg" />
          Votre navigateur ne supporte pas l'audio.
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
          className="bg-cast-gold text-cast-green p-3 rounded-full hover:bg-opacity-80 transition-colors text-lg flex-shrink-0"
        >
          {isPlaying ? '❚❚' : '▶'}
        </button>
        <div className="flex-1">
          <div 
            className="w-full bg-gray-300 rounded-full h-2 cursor-pointer"
            onClick={handleSeek}
          >
            <div 
              className="bg-cast-green h-2 rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm text-gray-600 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
        onLoadedMetadata={() => setDuration(audioRef.current.duration)}
      >
        <source src={src} type="audio/mpeg" />
        Votre navigateur ne supporte pas l'audio.
      </audio>
    </div>
  );
};

export default AudioPlayer;
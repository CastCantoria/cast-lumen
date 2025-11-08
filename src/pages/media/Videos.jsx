import React from 'react';
import { Link } from 'react-router-dom';

const Videos = () => {
  const [videos] = React.useState([
    {
      id: 1,
      title: "Concert de Noël 2024",
      thumbnail: "https://via.placeholder.com/300x200",
      date: "25 décembre 2024",
      duration: "1:45:30"
    },
    {
      id: 2,
      title: "Répétition générale - Requiem de Mozart",
      thumbnail: "https://via.placeholder.com/300x200", 
      date: "15 novembre 2024",
      duration: "2:15:00"
    },
    // Add more videos as needed
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Vidéos</h1>

      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((video) => (
          <div key={video.id} className="group">
            <div className="aspect-w-16 aspect-h-9">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="object-cover rounded-lg shadow-md group-hover:opacity-75"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="bg-white bg-opacity-75 rounded-full p-3">
                  <svg 
                    className="w-8 h-8 text-gray-900" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" 
                    />
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div className="mt-4">
              <h2 className="text-lg font-medium text-gray-900">
                {video.title}
              </h2>
              <div className="mt-1 flex items-center justify-between text-sm text-gray-500">
                <span>{video.date}</span>
                <span>{video.duration}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Videos;
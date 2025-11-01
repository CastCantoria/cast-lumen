import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const Messages = () => {
  const { userProfile } = useAuth();

  const [messages] = React.useState([
    {
      id: 1,
      from: 'Direction',
      subject: 'Informations répétition',
      content: 'La répétition de demain est déplacée à 19h00.',
      date: '2024-01-15T14:30:00',
      unread: true,
    },
    {
      id: 2,
      from: 'Chef de Choeur',
      subject: 'Nouvelle partition',
      content: 'Une nouvelle partition est disponible dans votre espace.',
      date: '2024-01-14T09:15:00',
      unread: false,
    },
    // Add more messages as needed
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Messages</h1>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {messages.map((message) => (
            <li
              key={message.id}
              className={`${
                message.unread ? 'bg-blue-50' : 'bg-white'
              } hover:bg-gray-50`}
            >
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center flex-1">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-blue-600 truncate">
                          {message.from}
                        </p>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                            {new Date(message.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm text-gray-900 font-medium">
                          {message.subject}
                        </p>
                        <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                          {message.content}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="ml-5 flex-shrink-0">
                    <button
                      type="button"
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200"
                    >
                      Lire
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Messages;
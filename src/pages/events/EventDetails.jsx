import React from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

const EventDetails = () => {
  const { id } = useParams();

  const [event] = React.useState({
    id,
    title: 'Concert de Noël',
    date: '2024-12-25',
    time: '20:00',
    location: 'Église Saint-Michel',
    description: 'Concert traditionnel de Noël présentant un répertoire varié de chants de Noël classiques et contemporains.',
    program: [
      'Ave Maria - Schubert',
      'Hallelujah - Handel',
      'Silent Night',
      'O Holy Night',
    ],
    image: 'https://via.placeholder.com/800x400',
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-64 object-cover rounded-lg shadow-lg"
          />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {event.title}
        </h1>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Date</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(event.date).toLocaleDateString()}
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Heure</dt>
                <dd className="mt-1 text-sm text-gray-900">{event.time}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Lieu</dt>
                <dd className="mt-1 text-sm text-gray-900">{event.location}</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="prose prose-blue max-w-none">
          <h2>Description</h2>
          <p>{event.description}</p>

          <h2>Programme</h2>
          <ul>
            {event.program.map((piece, index) => (
              <li key={index}>{piece}</li>
            ))}
          </ul>
        </div>

        <div className="mt-8 flex space-x-4">
          <Link
            to="/events"
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Retour aux événements
          </Link>
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Réserver
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
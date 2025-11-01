import React from 'react';
import { Link } from 'react-router-dom';

const Partners = () => {
  const [partners] = React.useState([
    {
      id: 1,
      name: 'Conservatoire Municipal',
      logo: 'https://via.placeholder.com/200',
      description: 'Partenaire pour la formation musicale',
      website: 'https://example.com',
    },
    {
      id: 2,
      name: 'Maison de la Culture',
      logo: 'https://via.placeholder.com/200',
      description: 'Lieu de nos représentations',
      website: 'https://example.com',
    },
    // Add more partners as needed
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Nos Partenaires</h1>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {partners.map((partner) => (
          <div 
            key={partner.id}
            className="flex flex-col items-center bg-white p-6 rounded-lg shadow-lg"
          >
            <img
              src={partner.logo}
              alt={partner.name}
              className="w-32 h-32 object-contain mb-4"
            />
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {partner.name}
            </h2>
            <p className="text-gray-600 text-center mb-4">
              {partner.description}
            </p>
            <a
              href={partner.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800"
            >
              Visiter le site web
            </a>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-gray-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Devenir Partenaire
        </h2>
        <p className="text-gray-600 mb-6">
          Vous souhaitez devenir partenaire de Cast Cantoria ? 
          Contactez-nous pour discuter des opportunités de collaboration.
        </p>
        <Link
          to="/contact"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          Nous contacter
        </Link>
      </div>
    </div>
  );
};

export default Partners;
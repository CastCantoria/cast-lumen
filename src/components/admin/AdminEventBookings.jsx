import React, { useState, useEffect } from "react";

const AdminEventBookings = ({ event, onClose }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulation de chargement
    setTimeout(() => {
      setBookings([
        { id: 1, userName: "Jean Dupont", email: "jean@example.com", seats: 2 },
        { id: 2, userName: "Marie Martin", email: "marie@example.com", seats: 1 }
      ]);
      setLoading(false);
    }, 1000);
  }, [event]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Réservations pour {event?.title}</h2>
        <button
          onClick={onClose}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
        >
          Fermer
        </button>
      </div>

      {loading ? (
        <p>Chargement des réservations...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">Nom</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Places</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(booking => (
                <tr key={booking.id} className="border-b">
                  <td className="px-4 py-2">{booking.userName}</td>
                  <td className="px-4 py-2">{booking.email}</td>
                  <td className="px-4 py-2">{booking.seats}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminEventBookings;
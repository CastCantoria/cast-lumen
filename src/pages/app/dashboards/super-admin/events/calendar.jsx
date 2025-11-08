import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../../../../../lib/firebase';

const EventCalendar = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    loadEvents();
  }, [currentMonth]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

      const eventsRef = collection(db, 'events');
      const q = query(
        eventsRef,
        where('date', '>=', startOfMonth.toISOString().split('T')[0]),
        where('date', '<=', endOfMonth.toISOString().split('T')[0]),
        orderBy('date', 'asc')
      );

      const snapshot = await getDocs(q);
      const eventsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setEvents(eventsData);
    } catch (error) {
      console.error('Erreur chargement événements:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (year, month) => {
    const date = new Date(year, month, 1);
    const days = [];
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  };

  const getMonthData = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const startingDay = firstDay.getDay();
    const daysInMonth = getDaysInMonth(year, month);
    
    const weeks = [];
    let currentWeek = Array(startingDay).fill(null);

    daysInMonth.forEach(day => {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });

    if (currentWeek.length > 0) {
      weeks.push([...currentWeek, ...Array(7 - currentWeek.length).fill(null)]);
    }

    return weeks;
  };

  const getEventsForDate = (date) => {
    if (!date) return [];
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(event => event.date === dateStr);
  };

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  if (loading) return <div className="p-6">Chargement du calendrier...</div>;

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Calendrier des Événements</h1>
        <div className="flex space-x-4 items-center">
          <button
            onClick={previousMonth}
            className="p-2 hover:bg-gray-100 rounded"
          >
            ←
          </button>
          <h2 className="text-lg font-semibold">
            {currentMonth.toLocaleString('fr-FR', { month: 'long', year: 'numeric' })}
          </h2>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-gray-100 rounded"
          >
            →
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="grid grid-cols-7 gap-px bg-gray-200 border-b">
          {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map(day => (
            <div key={day} className="px-2 py-2 text-center text-sm font-semibold">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {getMonthData().map((week, weekIndex) => (
            week.map((day, dayIndex) => {
              const dayEvents = day ? getEventsForDate(day) : [];
              const isToday = day?.toDateString() === new Date().toDateString();

              return (
                <div
                  key={`${weekIndex}-${dayIndex}`}
                  className={`min-h-[120px] bg-white p-2 ${
                    isToday ? 'bg-blue-50' : ''
                  }`}
                >
                  {day && (
                    <>
                      <div className={`text-sm ${
                        isToday ? 'font-bold text-blue-600' : 'text-gray-500'
                      }`}>
                        {day.getDate()}
                      </div>
                      <div className="mt-1 space-y-1">
                        {dayEvents.map(event => (
                          <button
                            key={event.id}
                            onClick={() => setSelectedEvent(event)}
                            className={`w-full text-left text-xs p-1 rounded ${
                              event.type === 'concert' 
                                ? 'bg-blue-100 text-blue-800'
                                : event.type === 'rehearsal'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {event.startTime && (
                              <span className="font-medium">
                                {event.startTime.slice(0, 5)} -
                              </span>
                            )}
                            {' '}
                            {event.title}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              );
            })
          ))}
        </div>
      </div>

      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-lg w-full">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold">{selectedEvent.title}</h3>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <div className="space-y-3">
              <p className="text-gray-600">{selectedEvent.description}</p>
              <div className="text-sm">
                <p>
                  <span className="font-medium">Date:</span>{' '}
                  {new Date(selectedEvent.date).toLocaleDateString('fr-FR')}
                </p>
                {selectedEvent.startTime && (
                  <p>
                    <span className="font-medium">Horaire:</span>{' '}
                    {selectedEvent.startTime}
                    {selectedEvent.endTime && ` - ${selectedEvent.endTime}`}
                  </p>
                )}
                {selectedEvent.location && (
                  <p>
                    <span className="font-medium">Lieu:</span>{' '}
                    {selectedEvent.location}
                  </p>
                )}
                <p>
                  <span className="font-medium">Type:</span>{' '}
                  {selectedEvent.type.charAt(0).toUpperCase() + selectedEvent.type.slice(1)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventCalendar;
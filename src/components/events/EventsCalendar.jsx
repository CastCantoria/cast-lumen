// src/components/events/EventsCalendar.jsx
import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './EventsCalendar.css';

// Configuration française
moment.locale('fr');
const localizer = momentLocalizer(moment);

const EventsCalendar = ({ events, onEventSelect }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Formater les événements pour le calendrier
  const calendarEvents = events.map(event => ({
    id: event.id,
    title: event.title,
    start: event.date,
    end: event.endDate || new Date(event.date.getTime() + 2 * 60 * 60 * 1000), // +2h par défaut
    allDay: false,
    resource: event
  }));

  const eventStyleGetter = (event) => {
    let backgroundColor = '#2C5530'; // Vert sacré par défaut
    
    switch (event.resource.type) {
      case 'Concert':
        backgroundColor = '#D4AF37'; // Or
        break;
      case 'Répétition':
        backgroundColor = '#6B7280'; // Gris
        break;
      case 'Audition':
        backgroundColor = '#7C3AED'; // Violet
        break;
      case 'Festival':
        backgroundColor = '#DC2626'; // Rouge
        break;
      default:
        backgroundColor = '#2C5530';
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '5px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block'
      }
    };
  };

  const handleSelectEvent = (event) => {
    onEventSelect(event.resource);
  };

  return (
    <div className="events-calendar">
      <div className="calendar-container">
        <Calendar
          localizer={localizer}
          events={calendarEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          onSelectEvent={handleSelectEvent}
          eventPropGetter={eventStyleGetter}
          views={['month', 'week', 'day']}
          defaultView="month"
          messages={{
            next: "Suivant",
            previous: "Précédent",
            today: "Aujourd'hui",
            month: "Mois",
            week: "Semaine",
            day: "Jour",
            agenda: "Agenda",
            date: "Date",
            time: "Heure",
            event: "Événement",
            noEventsInRange: "Aucun événement dans cette période"
          }}
        />
      </div>

      {/* Légende */}
      <div className="calendar-legend">
        <h4>Légende :</h4>
        <div className="legend-items">
          <div className="legend-item">
            <span className="color-dot concert"></span>
            <span>Concerts</span>
          </div>
          <div className="legend-item">
            <span className="color-dot sacred"></span>
            <span>Cérémonies</span>
          </div>
          <div className="legend-item">
            <span className="color-dot rehearsal"></span>
            <span>Répétitions</span>
          </div>
          <div className="legend-item">
            <span className="color-dot audition"></span>
            <span>Auditions</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsCalendar;
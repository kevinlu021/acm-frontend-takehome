import React, { useEffect, useState } from 'react';
import { Event } from '../types';
import { formatDate, formatTime } from '../utils';
import style from '../styles/EventCard.module.css';

interface EventCardProps {
  event: Event;
  cardMode: 'attended' | 'all';
  viewMode: 'card' | 'row';
}

export default function EventCard({ event, cardMode, viewMode }: EventCardProps) {
  const [attended, setAttended] = useState(false);

  const loadAttendanceData = () => {
    const events: string[] = JSON.parse(localStorage.getItem('events') ?? '[]');
    if (events.findIndex((e) => e === event.uuid) !== -1) setAttended(true);
  };

  const storeAttended = () => {
    const events: string[] = JSON.parse(localStorage.getItem('events') ?? '[]');
    if (events.findIndex((e) => e === event.uuid) === -1) {
      events.push(event.uuid);
    }
    localStorage.setItem('events', JSON.stringify(events));
  };

  const removeAttended = () => {
    const events: string[] = JSON.parse(localStorage.getItem('events') ?? '[]');
    const index = events.findIndex((e) => e === event.uuid);
    if (index !== -1) {
      events.splice(index, 1);
    }
    localStorage.setItem('events', JSON.stringify(events));
  };

  useEffect(() => {
    loadAttendanceData();
  }, []);

  useEffect(() => {
    if (attended) storeAttended();
    else removeAttended();
  }, [attended]);

  if (cardMode === 'attended' && !attended) return null;

  if (viewMode === 'card')
    return (
      <a
        href={`https://acmucsd.com/events/${encodeURIComponent(event.title.toLowerCase().trim().replace(/ /g, '-'))}-${
          event.uuid
        }`}
        className={style.eventCardContainer}
      >
        <img src={event.cover} className={style.eventCover} />
        <input className={style.checkbox} type="checkbox" checked={attended}
        onChange = {()=>{setAttended(!attended);}} //clicking checkbox will toggle attended status
        />
        <div className={style.eventInfoContainer}>
          <p>{event.title}</p>
          <p className={style.eventDateTime}>
            <b className={style.eventDate}>{formatDate(event.start, event.end)}</b>
            {formatTime(event.start, event.end)}
          </p>
          <p>{event.location}</p>
        </div>
      </a>
    );
  else {
    return (
      <tr className={style.eventRowContainer}>
        <td className={style.checkboxCell}>
          <input type="checkbox" checked={attended} 
          onChange = {()=>{setAttended(!attended);}} //clicking checkbox will toggle attended status
        />
        </td>
        <td className={style.titleCell}>
          <a
            href={`https://acmucsd.com/events/${encodeURIComponent(
              event.title.toLowerCase().trim().replace(/ /g, '-')
            )}-${event.uuid}`}
          >
            {event.title}
          </a>
        </td>
        <td className={style.dateTimeCell}>
          {formatDate(event.start, event.end) + ', ' + formatTime(event.start, event.end)}
        </td>
        <td className={style.locationCell}>{event.location}</td>
      </tr>
    );
  }
}

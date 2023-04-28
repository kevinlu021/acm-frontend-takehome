import { useEffect, useState } from 'react';
import { Event } from '../types';
import EventCard from '@/components/EventCard';
import style from '../styles/Home.module.css';
import GridIcon from '@/icons/GridIcon';
import RowIcon from '@/icons/RowIcon';

export default function Home() {
  const [displayEvents, setDisplayEvents] = useState<Event[]>([]);
  const [viewMode, setViewMode] = useState<'card' | 'row'>('card');
  const [eventMode, setEventMode] = useState<'all' | 'attended'>('all');

  ////////////////
  const [currentPage, setCurrentPage] = useState<number>(1);
  const EVENTS_PER_PAGE = 25;
  ////////////////

  useEffect(() => {
    const loadEvents = async () => {
      const response = await fetch('https://api.acmucsd.com/api/v2/event/past');
      const data: { error: any; events: Event[] } = await response.json();
      setDisplayEvents(data.events);
      setCurrentPage(1); //trigger the below useEffect
    };
    loadEvents(); //loadEvents was not called
  }, []);

  //////////////////
    useEffect(() => {
      const startIndex = (currentPage - 1) * EVENTS_PER_PAGE;
      const endIndex = startIndex + EVENTS_PER_PAGE;
      const eventsToDisplay = displayEvents.slice(startIndex, endIndex);
      setDisplayEvents(eventsToDisplay);
  }, [currentPage]);
  //////////////////

  return (
    <>
      <nav>
        <div className={style.navbar}>
          <img src="https://acmucsd.com/_next/static/media/ACMWhiteLogo.ccb2d1cb.png" width="64px" height="64px"></img>
          <span>Event Attendance Tracker</span>
        </div>
        <div className={style.rainbow}></div>
      </nav>
      <main className={style.container}>
        <div className={style.optionsMenu}>
          <div className={style.eventModeBtns}>
            <button
              data-status={eventMode === 'all' ? 'active' : 'inactive'}
              onClick={() => setEventMode('all')}
              className={style.eventModeBtn}
            >
              All Past Events
            </button>
            <button
              data-status={eventMode === 'attended' ? 'active' : 'inactive'}
              onClick={() => setEventMode('attended')}
              className={style.eventModeBtn}
            >
              Attended Events
            </button>
          </div>
          <div className={style.viewModeBtns}>
            <button
              className={style.viewModeBtn}
              onClick={() => setViewMode(viewMode === 'card' ? 'row' : 'card')}
              data-mode={viewMode === 'card' ? 'active' : 'inactive'}
            >
              <GridIcon />
            </button>
            <button
              className={style.viewModeBtn}
              onClick={() => setViewMode(viewMode === 'card' ? 'row' : 'card')}
              data-mode={viewMode === 'row' ? 'active' : 'inactive'}
            >
              <RowIcon />
            </button>
          </div>
        </div>
        {viewMode === 'card' ? (
          <div className={style.cardContainer}>
            {displayEvents.map((event) => (
              <EventCard cardMode={eventMode} viewMode={viewMode} key={event.uuid} event={event} />
            ))}
          </div>
        ) : (
          <table className={style.rowContainer}>
            <tbody>
              <tr className={style.headerRow}>
                <th className={style.checkboxHeaderCol}>Attended</th>
                <th className={style.titleHeaderCol}>Event Title</th>
                <th className={style.dateTimeHeaderCol}>Event Date</th>
                <th className={style.locationHeaderCol}>Event Location</th>
              </tr>
              {displayEvents.map((event) => (
                <EventCard cardMode={eventMode} viewMode={viewMode} key={event.uuid} event={event} />
              ))}
            </tbody>
          </table>
        )}
      </main>
    </>
  );
}

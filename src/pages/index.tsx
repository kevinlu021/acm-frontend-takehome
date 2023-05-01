import { useEffect, useState, useRef } from 'react';
import { Event } from '../types';
import EventCard from '@/components/EventCard';
import style from '../styles/Home.module.css';
import GridIcon from '@/icons/GridIcon';
import RowIcon from '@/icons/RowIcon';
import LeftArrowIcon from '@/icons/LeftArrowIcon';
import RightArrowIcon from '@/icons/RightArrowIcon';

export default function Home() {
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [viewMode, setViewMode] = useState<'card' | 'row'>('card');
  const [eventMode, setEventMode] = useState<'all' | 'attended'>('all');
  const [displayEvents, setDisplayEvents] = useState<Event[]>([]);



  ////////////////
  const [currentPage, setCurrentPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  ////////////////

  useEffect(() => {
      const loadEvents = async () => {
        const response1 = await fetch('http://localhost:4000/api/firstEvents');
        const data1: { error: any; page: number; events: Event[]; hasMore: boolean; } = await response1.json();
        setAllEvents(data1.events);
        setDisplayEvents(data1.events);
        const response2 = await fetch('http://localhost:4000/api/events');
        const data2: { error: any; page: number; events: Event[]; hasMore: boolean; } = await response2.json();
        setAllEvents(prevEvents => prevEvents.concat(data2.events));
        setMaxPage(Math.ceil((data1.events.length+data2.events.length)/25));
      };
      loadEvents(); //loadEvents was not called
  }, []);


  function moveRight(){
    setCurrentPage(currentPage+1);
    setDisplayEvents(allEvents.slice((currentPage) * 25, (currentPage+1) * 25));
  }

  function moveLeft(){
    setCurrentPage(currentPage-1);
    setDisplayEvents(allEvents.slice((currentPage-2) * 25, (currentPage-1) * 25));
  }
  useEffect(()=>{
    // console.log(currentPage);
    // console.log(`events ${(currentPage-1)*25} to ${(currentPage)*25}`);
    // console.log(allEvents.map(obj => obj.title));
  },[currentPage])
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
            { eventMode === 'all' ?
            displayEvents.map((event) => (
              <EventCard cardMode={eventMode} viewMode={viewMode} key={event.uuid} event={event} />
            )) : allEvents.map((event) => (
              <EventCard cardMode={eventMode} viewMode={viewMode} key={event.uuid} event={event} />
            ))
            }
          </div>
        ) : (
          <>
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
          </>
        )}
        {eventMode === "all" ? <div className={style.navbar}>
        {currentPage !== 1 ? <button className={style.eventModeBtn} onClick = {moveLeft}><LeftArrowIcon/></button> : <button className={style.eventModeBtn} style={{ visibility: 'hidden', pointerEvents: 'none' }}><LeftArrowIcon/></button>}
        <p>{currentPage} of {maxPage}</p>
        {maxPage !== currentPage ? <button className={style.eventModeBtn} onClick={moveRight}><RightArrowIcon/></button> : <button className={style.eventModeBtn} style={{ visibility: 'hidden', pointerEvents: 'none' }}><LeftArrowIcon/></button>}
        </div> : <></>
        }
      </main>
    </>
  );
}

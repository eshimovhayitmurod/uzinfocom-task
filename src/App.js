import styled from 'styled-components';
import {useEffect, useState} from 'react';
import Calendar from './Calendar';
const StyledContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 16px;
  align-items: center;
  padding: 100px 0 500px 0;
  flex-direction: column;
  & .app-title {
    font-size: 24px;
    font-weight: 600;
  }
  & .container {
    width: 900px;
  }
`
function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month');
  const [events, setEvents] = useState([]);
  useEffect(() => {
    const events = JSON.parse(localStorage.getItem('events'));
    const newEvents = Array.isArray(events) ? events : [];
    const Events = newEvents.map(event => {
      return {
        ...event,
        startDate: new Date(event?.startDate),
        endDate: new Date(event?.endDate),
      }
    })
    setEvents(Events)
  }, [])
  return (
    <StyledContainer>
      <h1 className='app-title'>Calendar app</h1>
      <div className='container'>
        <Calendar
          onChangeView={setView}
          events={events}
          onChangeEvents={setEvents}
          onChangeCurrentDate={setCurrentDate}
          currentDate={currentDate}
          view={view}
        />
      </div>
    </StyledContainer>
  );
}

export default App;

import { useCallback, useMemo} from 'react';
import styled from 'styled-components';
import DateView from './DateView'
const StyledWeekName = styled.div`
  padding: 8px;
  text-align: center;
  font-weight: bold;
  width: calc(100% / 7 - 16px);
`;
const StyledCalendar = styled.div`
    background-color: #ffffffff;
    width: 100%;
    border: 1px solid #ddd;
    border-radius: 10px;
    padding: 10px;
    & .calendar-header {
        display: flex;
        justify-content: space-between;
        width: 100%;
        & .right-header {
            display: flex;
            align-items: center;
            gap: 10px;
            & .current-date {
                font-size: 22px;
                font-weight: bold;
                
            }
            & button {
                outline: none;
                height: 36px;
                width: 36px;
                border: 1px solid #ddd;
                border-radius: 18px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                background-color: transparent;
            }
        }
        & .calendar-view {
            display: flex;
            border-radius: 8px;
            background-color: #f3f3f5;
            height: 36px;
            width: 200px;
            border: none;
            cursor: pointer;
            padding: 2px;
            font-size: 16px;
            &:hover {
                background-color: #ccc;
            }
            & .month-view, & .week-view {
                border-radius: 8px;
                width: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                font-weight: bold;
            }
            & .month-view[data-active='true'],
            & .week-view[data-active='true'] {
                background-color: #0051ffff;
                color: #fff;
            }
        }
    }
    & .calendar-body {
        padding-top: 10px;
        & .week-names {
            display: flex;
            flex-wrap: wrap;
            width: 100%;
        }
        & .days-content {
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            border-left: 1px solid #ddd;
            border-top: 1px solid #ddd;
        }
        & .hours-view {
            width: 100%;
            border-left: 1px solid #ddd;
            & .hours {
                width: 100%;
                display: flex;
                border-bottom: 1px solid #ddd;
                border-right: 1px solid #ddd;
                & .hours-header {
                    border-right: 1px solid #ddd;
                    width: calc(100% / 7 - 16px);
                    padding: 8px;
                }
                & .value {
                    width: calc(100% / 7 * 6);
                    height: 100%;
                    align-self: stretch;
                }
            }
        }
        
    }
`;
const weekNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const Calendar = ({
    currentDate,
    view = 'month',
    events = [],
    onChangeEvents,
    onChangeView,
    onChangeCurrentDate,
}) => {
    const weekDays = useMemo(() => {
        const today = new Date(currentDate);
        const day = today.getDay() || 7;
        const monday = new Date(today);
        monday.setDate(today.getDate() - day + 1);
        const week = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date(monday);
            d.setDate(monday.getDate() + i);
            week.push({date: d, isOffset: false});
        }
        return week;
    }, [currentDate])
    const monthDays= useMemo(() => {
        const startDay = new Date(currentDate);
        startDay.setDate(1);
        const offset = startDay.getDay();
        const offsets = offset > 0 ? [...new Array(offset)].map((_, i) => ({
            isOffset: true,
        })):[];
        const daysInMonth = new Date(startDay.getFullYear(), startDay.getMonth() + 1, 0).getDate();
        const monthDays = [];
        for (let i = 0; i < daysInMonth; i++) {
            const day = new Date(startDay);
            day.setDate(i + 1);
            monthDays.push({date: day, isOffset: false});
        }
        const lastDate = monthDays?.[monthDays?.length-1].date.getDay()
        const rightOffsets = lastDate!==6?[...new Array(6-lastDate)].map((_, i) => ({
            isOffset: true,
        })):[]
        return [...offsets,...monthDays, ...rightOffsets];
    }, [currentDate, view]);
    const days = useMemo(() => view === 'month'?monthDays: weekDays, [view, weekDays, monthDays])
    const currentViewInfo = useMemo(() => {
        const date = new Date(currentDate);
        const monthName = date.toLocaleString("en-US", { month: "long" });
        const monthView = `${monthName} ${new Date().getFullYear()}`;
        const weekView = `${monthName} ${weekDays[0]?.date.getDate()} - ${weekDays[weekDays?.length-1]?.date.getDate()}`
        const currentViewInfo = view === 'month'?monthView:weekView
        return currentViewInfo;
    }, [view, weekDays, currentDate]);
    const next = useCallback(() => {
        const d = new Date(currentDate); 
        const nextMonth = new Date(d.getFullYear(), d.getMonth() + 1, d.getDate());
        const nextWeek = new Date(currentDate).setDate(new Date(currentDate).getDate() + 7);
        const next = view === 'month'?nextMonth:nextWeek;
        onChangeCurrentDate(next)
    }, [view, currentDate]);
    const prev = useCallback(() => {
        const d = new Date(currentDate);
        const prevMonth = new Date(d.getFullYear(), d.getMonth() - 1, d.getDate());
        const prevWeek = new Date(currentDate).setDate(new Date(currentDate).getDate() - 7);
        const prev = view === 'month'?prevMonth:prevWeek
        onChangeCurrentDate(prev)
    }, [view, currentDate]);
    return <StyledCalendar>
        <div className='calendar-header'>
            <div className='right-header'>
                <div className='current-date'>{currentViewInfo}</div>
                <button onClick={prev}>
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="20px" width="20px" xmlns="http://www.w3.org/2000/svg">
                        <polyline fill="none" strokeWidth="2" points="9 6 15 12 9 18" transform="matrix(-1 0 0 1 24 0)"></polyline>
                    </svg>
                </button>
                <button onClick={next}>
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="20px" width="20px" xmlns="http://www.w3.org/2000/svg">
                        <path fill="none" d="M0 0h24v24H0z"></path><path d="M10 6 8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path>
                    </svg>
                </button>
            </div>
            <button
                className='calendar-view'
                onClick={() => {
                    const newView = view === 'month'?'week':'month';
                    onChangeView(newView)
                }}>
                <div data-active={view==='month'} className='month-view'>Month</div>
                <div data-active={view==='week'} className='week-view'>Week</div>
            </button>
        </div>
        <div className='calendar-body'>
            <div className='week-names'>
                {weekNames.map((day) => (
                <StyledWeekName key={day}>
                    {day}
                </StyledWeekName>
            ))}
            </div>
            <div className='days-content'>
                {days.map((day, index= 0 ) => (
                    <DateView 
                        {...day}  
                        key={day?.date?.toISOString() + ' - ' + index}
                        currentDate={currentDate}
                        events={events}
                        onChangeEvents={onChangeEvents}
                    />
                ))}
            </div>
            {view==='week'&& <div className='hours-view'>
                <div className='hours'>
                    <div className='hours-header'>12:00 AM</div>
                    <div className='value'></div>
                </div>
                <div className='hours'>
                    <div className='hours-header'>2:00 AM</div>
                    <div className='value'></div>
                </div>
                <div className='hours'>
                    <div className='hours-header'>4:00 AM</div>
                    <div className='value'></div>
                </div>
                <div className='hours'>
                    <div className='hours-header'>6:00 AM</div>
                    <div className='value'></div>
                </div>
                <div className='hours'>
                    <div className='hours-header'>8:00 AM</div>
                    <div className='value'></div>
                </div>
                <div className='hours'>
                    <div className='hours-header'>10:00 AM</div>
                    <div className='value'></div>
                </div>
                <div className='hours'>
                    <div className='hours-header'>12:00 PM</div>
                    <div className='value'></div>
                </div>
                <div className='hours'>
                    <div className='hours-header'>2:00 PM</div>
                    <div className='value'></div>
                </div>
                <div className='hours'>
                    <div className='hours-header'>4:00 PM</div>
                    <div className='value'></div>
                </div>
                <div className='hours'>
                    <div className='hours-header'>6:00 PM</div>
                    <div className='value'></div>
                </div>
                <div className='hours'>
                    <div className='hours-header'>8:00 PM</div>
                    <div className='value'></div>
                </div>
                <div className='hours'>
                    <div className='hours-header'>10:00 PM</div>
                    <div className='value'></div>
                </div>
            </div>}
        </div>
    </StyledCalendar>
}
export default Calendar;
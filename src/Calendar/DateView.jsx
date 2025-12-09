import {Fragment, memo, useMemo, useRef, useState} from 'react';
import styled from 'styled-components';
import {isEqualDate} from './isEqualDate';
import Popover from './Popover'
import {StyledForm} from './StyledForm';
const defaultEvent = {
    title: '',
    description: '',
    startDate: new Date().toISOString().slice(0, 16),
    endDate: new Date().toISOString().slice(0, 16)
}
const StyledDay = styled.div`
    padding: 8px;
    text-align: right;
    min-height: 60px;
    position:relative;
    color: #000000;
    font-size: 18px;
    font-weight: 500;
    cursor: pointer;
    height: 100%;
    border-right: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    width: calc(100% / 7 - 17px);
    cursor: pointer;
    &[data-current='true'] {
        & .date-value {
            background-color: #59ff00ff;
            color: #ffffffff;
            padding: 3px 8px;
            border-radius: 6px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
    }
    & .events-list {
        width: 100%;
        display: flex;
        flex-direction: column;
        padding-top: 8px;
        max-width: 100%;
        & .event-item {
            background: #0051ffff;
            display: inline;
            color: white;
            border-radius: 6px;
            padding: 2px 5px;
            font-size: 16px;
            font-weight: 500;
            position: relative;
            width: 100%;
            & .text {
                display: -webkit-box;
                -webkit-line-clamp: 1;
                -webkit-box-orient: vertical;
                overflow: hidden;
                width: 100%;
                text-align: left;
            }
        }
    }
`;
const EventView = memo(({title = '', description = '', startDate, endDate, id, events = [], onChangeEvents}) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    const [edit, setEdit] = useState(defaultEvent);
    const editEvent =e => {
        e.preventDefault();
        const newEvents = events.map(event => {
            if(event?.id === id) {
                return {
                    ...edit,
                    id: `id_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
                }
            } else {
                return event;
            }
        });
        onChangeEvents(newEvents.map(event => {
            return {
                ...event,
                startDate: new Date(event?.startDate),
                endDate: new Date(event?.endDate),
            }
        }));
        setOpen(false);
        const strigEvents = JSON.stringify(newEvents.map(event => {
            return {
                ...event,
                startDate: new Date(event?.startDate).toISOString(),
                endDate: new Date(event?.endDate).toISOString(),
            }
        }))
        localStorage.setItem('events', strigEvents);
    };
    const deleteEvent = e => {
        const newEvents = events.filter(event => event?.id !== id);
        onChangeEvents(newEvents.map(event => {
            return {
                ...event,
                startDate: new Date(event?.startDate),
                endDate: new Date(event?.endDate),
            }
        }));
        setOpen(false);
        const strigEvents = JSON.stringify(newEvents.map(event => {
            return {
                ...event,
                startDate: new Date(event?.startDate).toISOString(),
                endDate: new Date(event?.endDate).toISOString(),
            }
        }))
        localStorage.setItem('events', strigEvents);
    }
    return <Fragment>
        <div
            className='event-item'
            ref={ref}
            
            onClick={(e) => {
                e.stopPropagation()
                setOpen(open => !open);
                const edit = {
                    title,
                    description,
                    startDate: startDate.toISOString().slice(0, 16),
                    endDate: endDate.toISOString().slice(0, 16),
                }
                setEdit(edit)
            }}
            >
            <span className='text'>{title}</span>
        </div>
        <Popover ref={ref} setOpen={setOpen} open={open} >
            <StyledForm>
                <h4 className='popover-title'>
                    <span>Edit event</span>
                    <button onClick={deleteEvent} type='button'>
                        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="20px" width="20px" xmlns="http://www.w3.org/2000/svg">
                            <path fill="none" d="M0 0h24v24H0V0z"></path>
                            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5-1-1h-5l-1 1H5v2h14V4h-3.5z"></path>
                        </svg>
                    </button>
                </h4>
                <form onSubmit={editEvent}>
                    <div>
                        <label>Title</label>
                        <input
                            value={edit?.title}
                            type='text'
                            onChange={e => {
                                setEdit(edit => ({...edit, title: e.target.value}))
                            }}
                            />
                    </div>
                    <div>
                        <label>Description</label>
                        <textarea
                            value={edit?.description}
                            onChange={e => {
                                setEdit(edit => ({...edit, description: e.target.value}))
                            }}
                            />
                    </div>
                    <div>
                        <label>Start Date</label>
                        <input
                            value={edit?.startDate}
                            type='datetime-local'
                            onChange={e => {
                                setEdit(edit => ({...edit, startDate: e.target.value}))
                            }}
                            />
                    </div>
                    <div>
                        <label>Start Date</label>
                        <input
                            value={edit?.endDate}
                            type='datetime-local'
                            onChange={e => {
                                setEdit(edit => ({...edit, endDate: e.target.value}))
                            }}
                        />
                    </div>
                    <div>
                        <button type='submit'>Edit</button>
                    </div>
                </form>
            </StyledForm>
        </Popover>
    </Fragment>
})
const DateView= memo(({date = new Date(), isOffset= false, events = [], onChangeEvents, width = '' } ) => {
    const ref= useRef(null);
    const [open, setOpen] = useState(false);
    const [event, setEvent] = useState(defaultEvent);
    const isCurrent= useMemo(() => {
        const currentDate = new Date()
        const isCurrent = !isOffset && isEqualDate(date, currentDate)
        return isCurrent
    }, [date]);
    const currentDateEvents=  useMemo(() => {
        const filteredEvents= events.filter(event => {
            const currentTime = new Date(date).getTime()
            const startDate = new Date(event?.startDate).getTime();
            const endDate = new Date(event?.endDate).getTime();
            const isCurrent = isEqualDate(date, event?.startDate) || isEqualDate(date, event?.endDate)
            if((startDate <=currentTime && endDate >=currentTime) || isCurrent) {
                return true;
            } else {
                return false;
            }
        })
        const currentDateEvents = !isOffset?filteredEvents:[];
        return currentDateEvents
    }, [events, date]);
    const addEvent =(e) => {
        e.preventDefault();
        const newEvents = [...events, {...event, id: `id_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`}];
        onChangeEvents(newEvents.map(event => {
            return {
                ...event,
                startDate: new Date(event?.startDate),
                endDate: new Date(event?.endDate),
            }
        }));
        const strigEvents = JSON.stringify(newEvents.map(event => {
            return {
                ...event,
                startDate: new Date(event?.startDate).toISOString(),
                endDate: new Date(event?.endDate).toISOString(),
            }
        }));
        localStorage.setItem('events', strigEvents);
        setOpen(false);
        setEvent(defaultEvent)
    }
    return <Fragment>
        <StyledDay
            data-label={date?.toISOString()}
            data-current={isCurrent}
            data-enabled={!isOffset}
            style={{width}}
            ref={ref}
            onClick={() => setOpen(true)}
            >
            {!isOffset && <Fragment>
                <span className='date-value'>{date.getDate()}</span>
                <div className='events-list' ref={ref}>
                    {currentDateEvents.map(event => <EventView
                        {...event}
                        onChangeEvents={onChangeEvents}
                        events={events}
                        parentRef={ref}
                    />)}
                </div>
            </Fragment>}
        </StyledDay>
        <Popover ref={ref} setOpen={setOpen} open={open}>
            <StyledForm>
                <h4 className='popover-title'>
                    <span>Add event</span>
                </h4>
                <form onSubmit={addEvent}>
                    <div>
                        <label>Title</label>
                        <input
                            value={event?.title}
                            type='text'
                            onChange={e => {
                                setEvent(event => ({...event, title: e.target.value}))
                            }}
                            />
                    </div>
                    <div>
                        <label>Description</label>
                        <textarea
                            value={event?.description}
                            onChange={e => {
                                setEvent(event => ({...event, description: e.target.value}))
                            }}
                            />
                    </div>
                    <div>
                        <label>Start Date</label>
                        <input
                            value={event?.startDate}
                            type='datetime-local'
                            onChange={e => {
                                setEvent(event => ({...event, startDate: e.target.value}))
                            }}
                            />
                    </div>
                    <div>
                        <label>Start Date</label>
                        <input
                            value={event?.endDate}
                            type='datetime-local'
                            onChange={e => {
                                setEvent(event => ({...event, endDate: e.target.value}))
                            }}
                        />
                    </div>
                    <div>
                        <button type='submit'>Add</button>
                    </div>
                </form>
            </StyledForm>
        </Popover>
    </Fragment>
})
export default DateView;
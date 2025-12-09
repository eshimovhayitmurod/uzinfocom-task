import {Fragment, memo,  useEffect,  useMemo,  useRef, useState} from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
const StyledContainer=  styled.div`
    position: fixed;
    left: 0;
    top: 0;
    z-index: 999;
    width: 100vw;
    height: 100vh;
`;
const Popover= memo(({children,  open, setOpen, ref } ) => {
    const popover = useRef(null);
    const [position, setPosition] = useState({
        top: 0,
        left: 0
    })
    useEffect(() => {
        const scroll = e => {
            const rect = ref?.current?.getBoundingClientRect();
            const position = {
                top: rect?.bottom,
                left: rect?.left + rect?.width / 2,
            };
            setPosition(position)
        };
        scroll()
        window.addEventListener('scroll', scroll)
        return () => {
            window.removeEventListener('scroll',scroll)
        }
    }, [open, ref]);
    return <Fragment>
        {open && (
            createPortal(<StyledContainer
                onClick={() => setOpen(false)}
                onMouseDown={e => {
                        setOpen(false)
                    }}>
                <div
                    ref={popover}
                    onMouseDown={e => {
                        e.stopPropagation();
                    }}
                    onClick={e => {
                        e.stopPropagation();
                    }}
                    style={{
                        ...position,
                        position: "fixed",
                        transform: "translateX(-50%)",
                        marginTop: 8,
                        padding: 12,
                        background: "white",
                        border: "1px solid #ccc",
                        borderRadius: 10,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                        zIndex: 1000,
                        minWidth: 300,
                    }}
                    >
                    {children}
                </div>
            </StyledContainer>, document.getElementById('portal'))
        )}
    </Fragment>
})
export default Popover;
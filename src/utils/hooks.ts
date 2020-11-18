import {useState, useRef, useEffect} from 'react';

export function useOnMount(cb: Function, deps = []) {
    const run = useRef(false);
    
    useEffect(() => {
        if(!run.current) {
            cb();
            run.current = true
        }
    }, [...deps])
}

export function useOutsideClickEvent(ref: any, action: () => void) {
    useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */
        function handleClickOutside(event: any) {
            if (ref.current && !ref.current.contains(event.target)) {
                action()
                console.log("OUT!!!")
            }
        }

        // Bind the event listener
        document.addEventListener("click", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("click", handleClickOutside);
        };
    }, [ref, action]);
}
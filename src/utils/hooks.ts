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
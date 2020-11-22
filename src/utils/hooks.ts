import { AxiosResponse } from 'axios';
import { resolve } from 'dns';
import {useState, useRef, useEffect, useCallback} from 'react';
import {AxiosResponsePromise} from 'shared/interfaces/ResponseType';
import { TupleType } from 'typescript';

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

export function useSynchronizedRequest<T=any, A extends any[] = any[]>(requestFunction: (...args: A) => AxiosResponsePromise<T>): (...args: A) => AxiosResponsePromise<T> {
    const lastPromise = useRef<null | AxiosResponsePromise<T>>(null);
    return useCallback((...args: A) => {
        const promise = new Promise((resolve, reject) => {
            requestFunction(...args).then((response) => {
                if(lastPromise.current == promise) {
                    resolve(response);
                }
            }).catch((response) => {
                if(lastPromise.current == promise) {
                    reject(response);
                }
            })
        }) as AxiosResponsePromise<T>;
        lastPromise.current = promise;
        return promise;
    },[requestFunction]);
}

export function useLoadingRequest<T=any, A extends any[]=any[], >(requestFunction:(...args:A) => AxiosResponsePromise<T>, initialData:T, initialLoading=false)
: [ (...args:A) => AxiosResponsePromise<T>, T, boolean] {
    const [state, setState] = useState<{data: T, loading: boolean}>({data: initialData, loading: initialLoading});
    const synchronizedRequest = useSynchronizedRequest(requestFunction);
    const request = useCallback((...args: A) => {
        setState({data: initialData, loading: true}) 
        return synchronizedRequest(...args).then(response => {
            setState({data: response.data as unknown as T, loading: false}) 
            return response;
        }).catch(err => {
            setState({data: err.response.data, loading: false});
            throw err.response.data;
        });
    }, [requestFunction]);
    return [request, state.data, state.loading];
}
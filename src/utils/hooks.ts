import { AxiosResponse } from 'axios';
import { resolve } from 'dns';
import {useState, useRef, useEffect, useCallback, useMemo} from 'react';
import { useHistory, useLocation } from 'react-router-dom';
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

export function useLoadingRequest<T=any, A extends any[]=any[]>(requestFunction:(...args:A) => AxiosResponsePromise<T>, initialData:T, initialLoading=false)
: [ (...args:A) => AxiosResponsePromise<T>, T, boolean, any] {
    const [state, setState] = useState<{data: T, loading: boolean, error?: any}>({data: initialData, loading: initialLoading, error: undefined});
    const synchronizedRequest = useSynchronizedRequest(requestFunction);
    const request = useCallback((...args: A) => {
        setState({data: initialData, loading: true}) 
        return synchronizedRequest(...args).then(response => {
            setState({data: response?.data?.data, loading: false}) 
            return response;
        }).catch(err => {
            setState({data: initialData, loading: false, error: err?.response?.data});
            throw err;
        });
    }, [requestFunction]);
    return [request, state.data, state.loading, state.error];
}

export function useQueryStringMaster<T extends Record<string, string>>(defaults:T = {} as T): {
        pathname: string,
        queryString: string, 
        fullpath: string,
        [key: string]: string | undefined
    } & T {
    const location = useLocation();
    return new Proxy(new URLSearchParams(location.search), {
        get(target, prop: string) {
            if(prop === 'queryString') {
                return target.toString();
            } else if(prop === 'pathname') {
                return location.pathname;
            } else if(prop === 'fullpath') {
                return `${location.pathname}?${target.toString()}`
            }
            return target.get(prop) || defaults[prop];
        },
        set(target, prop: string, value) {
            target.set(prop, value);
            return true;
        }
    }) as any;
}

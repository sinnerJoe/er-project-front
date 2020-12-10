import { AxiosResponsePromise } from "shared/interfaces/ResponseType";

export function unwrapResponse<T>(promise: AxiosResponsePromise<T>): Promise<T> {
    return promise.then(response => response?.data?.data)
    .catch(err => {
        throw err.response;  
    });
}

export function unwrapRequest<T, A extends unknown[]>(request: (...args: A) => AxiosResponsePromise<T>)
: (...args: A) => Promise<T> {
    return (...args: A) => unwrapResponse<T>(request(...args));
}
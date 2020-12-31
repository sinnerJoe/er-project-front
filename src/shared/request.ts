import axios from 'axios';
import { dispatchNotifications, generateStdNotification, notify } from './error-handlers';
import { AxiosResponsePromise, HttpResponseCode, SuccessResponse } from './interfaces/ResponseType';
import browserHistory from 'shared/history';
import store from 'store';
import { clearData } from 'store/slices/user';

const hostApiPrefix = 'http://localhost/api/';

// axios.defaults.withCredentials = true;

function request(
    path: string, 
    method: 'POST' | 'PUT' | 'DELETE' | 'GET' | 'PATCH', 
    params?: any, 
    payload?: any, 
    overrideParams?: any
) {

    return axios.request({
        method,
        params,
        baseURL: '/api/',
        data: payload,
        url: path,
        withCredentials: true,
        responseType: "json",
        ...(overrideParams || {})
        // xsrfCookieName: "er_session",
        // withCredentials: true
        // headers: ""
    });

}

function defaultErrorHandler(request: () => AxiosResponsePromise<any>) {
    return dispatchNotifications(request, [
        {
            capture: [HttpResponseCode.InternalServerError],
            trigger: notify({message: "Internal Server Error"}),
            absorbRejection: true
        },
        {
            capture: [HttpResponseCode.NotAuthenticated],
            trigger: () => {
                store.dispatch(clearData());
                browserHistory.push("");
                notify({
                    message: "You got logged out",
                    description: "Your session expired.",
                    type: 'info',
                    key: "LOGGED_OUT"
                })({data: {message: ''}} as any);
            },
            absorbRejection: true
        }
    ]) as AxiosResponsePromise<any>;
}

export function get(path:string, params?:any, payload?:any) {
    return defaultErrorHandler(() => request(path, "GET", params, payload));
}
export function post(path:string, payload?: any, params?:any) {
    return defaultErrorHandler(() => request(path, "POST", params, payload));
}
export function put(path:string, payload?:any, params?:any) {
    return defaultErrorHandler(() => request(path, "PUT", params, payload));
}
export function del(path:string, payload?:any, params?:any) {
    return defaultErrorHandler(() => request(path, "DELETE", params, payload));
}
export function patch(path:string, payload?:any, params?:any) {
    return defaultErrorHandler(() => request(path, "PATCH", params, payload));
}

export function fetchBinary(path: string) {
    return request(path, "GET", undefined, undefined, {
        responseType: 'arraybuffer',
        baseURL: '/'
    });
}
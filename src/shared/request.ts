import axios from 'axios';

const hostApiPrefix = 'http://localhost/api/';

// axios.defaults.withCredentials = true;

function request(path: string, method: 'POST' | 'PUT' | 'DELETE' | 'GET', params?: any, payload?: any, overrideParams?: any) {
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

export function get(path:string, params?:any, payload?:any) {
    return request(path, "GET", params, payload);
}
export function post(path:string, payload?: any, params?:any) {
    return request(path, "POST", params, payload);
}
export function put(path:string, payload?:any, params?:any) {
    return request(path, "PUT", params, payload);
}
export function del(path:string, payload?:any, params?:any) {
    return request(path, "DELETE", params, payload);
}

export function fetchBinary(path: string) {
    return request(path, "GET", undefined, undefined, {
        responseType: 'arraybuffer',
        baseURL: '/'
    });
}
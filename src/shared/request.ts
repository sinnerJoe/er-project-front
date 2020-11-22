import axios from 'axios';

const hostApiPrefix = 'http://127.0.0.1/api/';

function request(path: string, method: 'POST' | 'PUT' | 'DELETE' | 'GET', params?: any, payload?: any) {
    return axios.request({
        method,
        params,
        baseURL: hostApiPrefix,
        data: payload,
        url: path,
        responseType: "json",
        // xsrfCookieName: "er_session",
        headers: ""
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
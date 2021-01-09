import { AxiosResponse } from "axios";

export interface SuccessResponse<T> {
    data: T;
    message: string | null;
    date: string
    status: "success"
}

export enum RequestErrorStatus {
    BadParameter="invalid_parameter",
    InternalServerError="invalid_server_error",
    InvalidMethod="bad_method",
    MaximumCallsExceeded="maximum_calls_exceeded",
    NotAuthorized="unauthorized",
    NotFound="not_found"
}

export enum HttpResponseCode {
    NotFound=404,
    NotAuthenticated=401,
    NotAuthorized=403,
    BadRequest=400,
    InternalServerError=500,
    InvalidMethod=405,
    Success=200
}

export interface ErrorResponse {
    message: string,
    date: string,
    status: RequestErrorStatus
}

export type ApiResponse<T> = ErrorResponse | SuccessResponse<T>;


export type AxiosResponsePromise<T> = Promise<AxiosResponse<SuccessResponse<T>>>;
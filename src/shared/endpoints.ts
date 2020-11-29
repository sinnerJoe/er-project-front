import { AxiosResponse } from "axios";
import { ApiResponse } from "./interfaces/ResponseType";
import { fromUser, User } from "./interfaces/User";
import {get, post, del, put} from './request';

export function registerUser(data: User) {
    console.log(fromUser(data))
    return post("users/", fromUser(data));
}

export function authenticate(email: string, password: string) {
    return post("auth/", {email, password});
}

export function fetchSalt(email: string) {
    return get("auth/", {email});
}
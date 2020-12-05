import { AxiosResponse } from "axios";
import { ServerSolution } from "interfaces/Solution";
import { ExpectedDiagram, ExpectedSolution } from "./expected-data";
import { ApiResponse, AxiosResponsePromise } from "./interfaces/ResponseType";
import { fromUser, User } from "./interfaces/User";
import {get, post, del, put, fetchBinary} from './request';

export function registerUser(data: User) {
    console.log(fromUser(data))
    return post("users/", fromUser(data), {});
}

export function authenticate(email: string, password: string) {
    return post("auth/", {email, password}, {});
}

export function fetchSessionUserData() {
    return get("auth/");
}

export function logoutSession() {
    return del("auth/");
}

export function createSolution(solutionData: ExpectedSolution) {
    return post("solutions/", solutionData);
}

export function getOwnSolutions(): AxiosResponsePromise<ServerSolution[]> {
    return get("solutions/");
}

export function fetchSolution(id: number): AxiosResponsePromise<ServerSolution> {
    return get("solutions/", {id});
}

export function updateSolution(id: number, diagrams: ExpectedDiagram[]) {
    return put("solutions/", {diagrams}, {id});
}

export function deleteSolution(id: number) {
    return del("solutions/", {id});
}

export async function getImageBase64(url: string) {
    const response = await fetchBinary(url);

    return Buffer.from(response.data, 'binary').toString("base64");
}
import { AxiosResponse } from "axios";
import { SentPlannedAssignment } from "components/plan-editor/PlanEditor";
import { PlannedAssignment, ServerAssignment } from "interfaces/Assignment";
import { Plan } from "interfaces/Plan";
import { ServerSolution } from "interfaces/Solution";
import { Moment } from "moment";
import { ExpectedDiagram, ExpectedSolution } from "./expected-data";
import { IdIndex } from "./interfaces/Id";
import { ApiResponse, AxiosResponsePromise } from "./interfaces/ResponseType";
import { fromUser, User } from "./interfaces/User";
import {get, post, del, put, fetchBinary, patch} from './request';

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

export function fetchAssignment(id: number):AxiosResponsePromise<ServerAssignment> {
    return get("assignments/", {id});
}

export function updateAssignment(id: number, data: {title: string, description: string}) {
    return put("assignments/", data, {id});
}

export function createAssignment(data: {title: string, description: string }){
    return post('assignments/', data);
}

export function fetchAllAssignments(): AxiosResponsePromise<ServerAssignment[]> {
    return get("assignments/");
}

export function fetchAllGroups() {
    return get("groups/");
}

export function createPlan(name: string): AxiosResponsePromise<{id: IdIndex}> {
    return post("plans/", {name});
}

export function deletePlan(id: IdIndex) {
    return del('plans/', undefined, {id});
}

export function fetchPlan(id: IdIndex): AxiosResponsePromise<Plan> {
    return get("plans/", {id});
}

export function fetchAllPlans(): AxiosResponsePromise<Plan[]> {
    return get("plans/");
}

export function addPlannedAssignments(planId: IdIndex, data: SentPlannedAssignment[]) {
    return post("plans/assignments/", {assignments: data}, {id: planId});
}

export function removePlannedAssignments(plannedAssignmentIds: IdIndex[]) {
    return del("plans/assignments/", undefined, {ids: plannedAssignmentIds});
}

export function updatePlannedAssignments(data: Partial<SentPlannedAssignment>[]) {
    return put('/plans/assignments/', {assignments: data});
}

export function updatePlanName(id: IdIndex, name: string) {
    return patch("plans/", {name}, {id});
}

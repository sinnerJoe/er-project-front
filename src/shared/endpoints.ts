import { AxiosResponse } from "axios";
import { SentPlannedAssignment } from "components/plan-editor/PlanEditor";
import { EvaluatedAssignment, PlannedAssignment, ServerAssignment } from "interfaces/Assignment";
import { CollegeGroup } from "interfaces/Group";
import { Plan } from "interfaces/Plan";
import { EvaluatedSolution, ServerSolution } from "interfaces/Solution";
import { Moment } from "moment";
import { dispatchNotifications, generateStdNotification, generateSuccessNotification, handleGetStdErrors, notify, redirectNotFound } from "./error-handlers";
import { ExpectedDiagram, ExpectedSolution } from "./expected-data";
import { IdIndex } from "./interfaces/Id";
import { ApiResponse, AxiosResponsePromise, HttpResponseCode } from "./interfaces/ResponseType";
import { Role } from "./interfaces/Role";
import { fromUser, Student, Teacher, User, UserSummary } from "./interfaces/User";
import { get, post, del, put, fetchBinary, patch } from './request';

export function registerUser(data: User) {
    return post("users/", fromUser(data), {});
}

export function authenticate(email: string, password: string) {
    return post("auth/", { email, password }, {});
}

export function fetchSessionUserData() {
    return get("auth/");
}

export function logoutSession() {
    return del("auth/");
}

export function createSolution(solutionData: ExpectedSolution, onResponse?: () => void) {
    return dispatchNotifications(() => post("solutions/", solutionData), [generateStdNotification(), generateSuccessNotification()], onResponse);
}

export function getOwnSolutions(): AxiosResponsePromise<ServerSolution[]> {
    return handleGetStdErrors(() => get("solutions/"));
}

export function fetchSolution(id: number, onResponse?: () => void): AxiosResponsePromise<ServerSolution> {
    return dispatchNotifications(() => get("solutions/", { id }), [redirectNotFound], onResponse);
}

export function updateSolution(id: number, diagrams: ExpectedDiagram[]) {
    return dispatchNotifications(() => put("solutions/", { diagrams }, { id }), [generateStdNotification(), generateSuccessNotification()]);
}

export function deleteSolution(id: number) {
    return dispatchNotifications(() => del("solutions/", { id }), [generateStdNotification()]);
}

export async function getImageBase64(url: string) {
    const response = await fetchBinary(url) as any;

    return Buffer.from(response.data, 'binary').toString("base64");
}

export function fetchAssignment(id: number): AxiosResponsePromise<ServerAssignment> {
    return dispatchNotifications(() => get("assignments/", { id }), [generateStdNotification()]);
}

export function updateAssignment(id: number, data: { title: string, description: string }) {
    return put("assignments/", data, { id });
}

export function deleteAssignment(id: IdIndex, onResponse?: () => void) {
    return dispatchNotifications(() => del("assignments/", {}, { id }), [
        generateSuccessNotification({ message: "Assignment successfully deleted." }),
        generateStdNotification(),
    ], onResponse);
}

export function createAssignment(data: { title: string, description: string }) {
    return post('assignments/', data);
}

export function fetchAllAssignments(): AxiosResponsePromise<ServerAssignment[]> {
    return dispatchNotifications(() => get("assignments/"), [generateStdNotification()]);
}

export function fetchAllGroups() {
    return get("groups/");
}

export function createPlan(name: string): AxiosResponsePromise<{ id: IdIndex }> {
    return post("plans/", { name });
}

export function deletePlan(id: IdIndex) {
    return del('plans/', undefined, { id });
}

export function fetchPlan(id: IdIndex): AxiosResponsePromise<Plan> {
    return get("plans/", { id });
}

export function fetchAllPlans(): AxiosResponsePromise<Plan[]> {
    return dispatchNotifications(() => get("plans/"), [generateStdNotification()]);
}

export function addPlannedAssignments(planId: IdIndex, data: SentPlannedAssignment[]) {
    return post("plans/assignments/", { assignments: data }, { id: planId });
}

export function removePlannedAssignments(plannedAssignmentIds: IdIndex[]) {
    return del("plans/assignments/", undefined, { ids: plannedAssignmentIds });
}

export function updatePlannedAssignments(data: Partial<SentPlannedAssignment>[]) {
    return put('/plans/assignments/', { assignments: data });
}

export function updatePlanName(id: IdIndex, name: string) {
    return patch("plans/", { name }, { id });
}

export function getShallowGroups(year: IdIndex): AxiosResponsePromise<{ year: IdIndex, id: IdIndex, name: string }[]> {
    return get("groups/", { year, 'type': 'shallow' });
}

export function getSubmissionGroups(year: IdIndex): AxiosResponsePromise<{
    year: IdIndex,
    id: IdIndex,
    name: string,
    uncheckedSubmissionCount: IdIndex
}[]> {
    return dispatchNotifications(() => get("groups/", { year, 'type': 'submissions' }), [generateStdNotification()]);
}

export function getGroups(year: IdIndex): AxiosResponsePromise<CollegeGroup[]> {
    return dispatchNotifications(() => get("groups/", { year }), [generateStdNotification()]);
}

export function createGroup(name: string, year: IdIndex) {
    return post("groups/", { name, year });
}

export function deleteGroup(id: IdIndex) {
    return del("groups/", {}, { id });
}

export function getTeachers(groupYear: IdIndex): AxiosResponsePromise<Teacher[]> {
    return get("users/", { role: 'teacher', year: groupYear });
}

export function getStudents(): AxiosResponsePromise<Student[]> {
    return get("users/", { role: 'student' });
}

export function fetchOwnData(): AxiosResponsePromise<Student> {
    return get("users/");
}

export function fetchAllUsers(registrationYear?: IdIndex): AxiosResponsePromise<UserSummary[]> {
    return dispatchNotifications(() => get("users/", { year: registrationYear }), [generateStdNotification()]);
}

export function deleteUser(id: IdIndex) {
    return del("users/", {}, { id });
}

export function deleteCurrentUser(password: string) {
    return del("users/", { password });
}

export function setUserRole(id: IdIndex, role: Role) {
    return patch("users/", { role }, { id, target: 'role' });
}

export function changePassword(oldPassword: string, password: string) {
    return patch("users/", { oldPassword, password }, { target: 'password' });
}

export function changeName(firstName: string, lastName: string) {
    return patch("users/", { firstName, lastName }, { target: 'name' });
}

export function setGroupCoordinator(groupId: IdIndex, coordinatorId: IdIndex) {
    return patch('groups/', { coordinatorId }, { id: groupId, target: "coordinator" });
}

export function setGroupPlan(groupId: IdIndex, planId: IdIndex) {
    return patch('groups/', { planId }, { id: groupId, target: "plan" });
}

export function setStudentGroup(userId: IdIndex, groupId: IdIndex | null) {
    return patch('users/', { groupId }, { id: userId, target: 'group' });
}

export function getPlannedAssignments(): AxiosResponsePromise<PlannedAssignment[]> {
    return dispatchNotifications(() => get('plans/assignments/'), [generateStdNotification()]);
}

export function getPlannedAssignmentsWithAnswers(groupId: IdIndex, plannedAssignmentId?: IdIndex): AxiosResponsePromise<EvaluatedAssignment[]> {
    return dispatchNotifications(() => get('plans/assignments/', { groupId, plannedAssignmentId }), [generateStdNotification()]);
}

export function submitSolution(solutionId: IdIndex, plannedAssignmentId: IdIndex, onResolve?: () => void) {
    return dispatchNotifications(() => patch('solutions/', { plannedAssignmentId }, { id: solutionId, target: 'submit' }),
        [generateStdNotification()], onResolve);
}

export function unsubmitSolution(solutionId: IdIndex, onResolve?: () => void) {
    return dispatchNotifications(() => patch('solutions/', {}, { id: solutionId, target: 'unsubmit' }),
        [generateStdNotification(), generateSuccessNotification()],
        onResolve);
}

export function assignMark(solutionId: IdIndex, mark: IdIndex | null) {
    return patch('solutions/', { mark }, { id: solutionId, target: 'mark' });
}

export function requestReset(email: string, onResponse?: () => void) {
    return dispatchNotifications(() => post('reset-password/', { email }), [
        generateSuccessNotification({
            message: "Email has been sent",
            description: "Check your email inbox for the link to password reset page."
        }),
        generateStdNotification()
    ], onResponse);
}

export function applyReset(id: string, password: string, onResponse?: () => void) {
    return dispatchNotifications(() => put('reset-password/', { password }, { id }), [
        generateSuccessNotification({
            message: "Password successfully saved",
            description: "Try to authenticate using your new password."
        }),
        generateStdNotification()
    ], onResponse);
}
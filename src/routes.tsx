import React from 'react';
import paths from 'paths';
import MyDiagramsPage from 'pages/my-diagrams/MyDiagramsPage';
import CreateDiagram from 'pages/create-diagram/CreateDiagram';
import EditDiagramPage from 'pages/edit-diagram/EditDiagramPage';
import MyAssignmentsPage from 'pages/my-assignments/MyAssignmentsPage';
import EditAssignmentPage from 'pages/edit-assignment/EditAssignmentPage';
import ProfessorAssignmentsPage from 'pages/professor-assignments-page/ProfessorAssignmentsPage';
import RegisterPage from 'pages/register-page/RegisterPage';
import LoginPage from 'pages/login-page/LoginPage';
import NotAuthenticatedPage from 'pages/not-authenticated/NotAuthenticatedPage';
import NotFoundPage from 'pages/not-found/NotFoundPage';
import CreatePlanPage from 'pages/create-plan-page/CreatePlanPage';
import PlanListPage from 'pages/plan-list-page/PlanListPage';
import EditPlanPage from 'pages/edit-plan-page/EditPlanPage';
import GroupsPage from 'pages/groups/GroupsPage';
import STEPS, { RoutePathStep } from 'shared/route-steps';
import UsersPage from 'pages/users-page/UsersPage';
import ChangePasswordPage from 'pages/change-password-page/ChangePasswordPage';
import EditProfilePage from 'pages/edit-profile/EditProfilePage';
import AllAssignmentsPage from 'pages/all-assignments/AllAssignmentsPage';
import ResetPasswordPage from 'pages/reset-password/ResetPasswordPage';
import ResetPasswordApplyPage from 'pages/reset-password-apply/ResetPasswordApplyPage';
import ConfirmAccountPage from 'pages/confirm-account/ConfirmAccountPage';
import { Role } from 'shared/interfaces/Role';
import Unauthorized from 'pages/unauthorized/Unauthorized';


const ALL_ROLES = [Role.Admin, Role.Teacher, Role.Student];

const NO_STUDENTS = [Role.Admin, Role.Teacher];

export default [
    {
        path: paths.MY_DIAGRAM,
        component: MyDiagramsPage,
        routeSteps: [{
            title: "My Solutions",
            to: paths.MY_DIAGRAM
        }],
        roles: ALL_ROLES
    },
    {
        path: paths.NEW_DIAGRAM,
        component: CreateDiagram,
        disableHeader: true,
        roles: ALL_ROLES

    },
    {
        path: paths.EDIT_DIAGRAM,
        component: EditDiagramPage,
        disableHeader: true,
        roles: ALL_ROLES
    },
    {
        path: paths.STUDENT_ASSIGNMENTS,
        component: MyAssignmentsPage,
        routeSteps: [{
            title: "My Assignments",
            to: paths.STUDENT_ASSIGNMENTS
        }],
        roles: ALL_ROLES
    },
    {
        path: `${paths.EDIT_ASSIGNMENT}/:id?`,
        component: EditAssignmentPage,
        routeSteps: [
            STEPS.ASSIGNMENTS,
            {
                title: 'Edit',
                to: paths.EDIT_ASSIGNMENT
            }
        ],
        roles: NO_STUDENTS
    },
    {
        path: paths.CREATE_ASSIGNMENT,
        component: EditAssignmentPage,
        routeSteps: [
            STEPS.ASSIGNMENTS,
            {
                title: 'Create',
                to: paths.CREATE_ASSIGNMENT
            }
        ],
        roles: NO_STUDENTS
    },
    {
        path: paths.PROFESSOR_ASSIGNMENTS,
        component: ProfessorAssignmentsPage,
        routeSteps: [STEPS.PROFESSOR_ASSIGNMENTS],
        roles: NO_STUDENTS
    },
    {
        path: paths.REGISTER,
        component: RegisterPage,
        disableHeader: true,
        secure: false
    },
    {
        path: paths.LOGIN,
        component: LoginPage,
        disableHeader: true,
        secure: false
    },
    {
        path: paths.NOT_AUTHENTICATED,
        component: NotAuthenticatedPage,
        secure: false,
        disableHeader: true
    },
    {
        path: paths.NOT_FOUND,
        component: NotFoundPage,
        disableHeader: true,
        secure: false
    },
    {
        path: paths.CREATE_PLAN,
        component: CreatePlanPage,
        routeSteps: [
            STEPS.PLANS,
            {
                title: "Create",
                to: paths.CREATE_PLAN
            }
        ],
        roles: NO_STUDENTS
    },
    {
        path: `${paths.EDIT_PLAN}/:id`,
        component: EditPlanPage,
        routeSteps: [
            STEPS.PLANS,
            {
                title: "Edit",
                to: paths.EDIT_PLAN
            }
        ],
        roles: NO_STUDENTS
    },
    {
        path: paths.PLANS,
        component: PlanListPage,
        routeSteps: [STEPS.PLANS],
        roles: NO_STUDENTS
    },
    {
        path: paths.GROUPS,
        component: GroupsPage,
        routeSteps: [STEPS.GROUPS],
        roles: NO_STUDENTS
    },
    {
        path: paths.USERS,
        component: UsersPage,
        routeSteps: [STEPS.USERS],
        roles: [Role.Admin]
    },
    {
        path: paths.CHANGE_PASSWORD,
        component: ChangePasswordPage,
        routeSteps: [STEPS.CHANGE_PASSWORD],
        roles: ALL_ROLES
    },
    {
        path: paths.EDIT_PROFILE,
        component: EditProfilePage,
        routeSteps: [STEPS.EDIT_PROFILE],
        roles: ALL_ROLES
    },
    {
        path: paths.ALL_ASSIGNMENTS,
        component: AllAssignmentsPage,
        routeSteps: [STEPS.ASSIGNMENTS],
        roles: NO_STUDENTS

    },
    {
        path: paths.FORGOT_PASSWORD,
        component: ResetPasswordPage,
        secure: false,
        disableHeader: true
    },
    {
        path: paths.RESET_PASSWORD,
        component: ResetPasswordApplyPage,
        secure: false,
        disableHeader: true
    },
    {
        path: paths.CONFIRM_ACCOUNT,
        component: ConfirmAccountPage,
        secure: false,
        disableHeader: true
    },
    {
        path: paths.UNAUTHORIZED,
        component: Unauthorized,
        disableHeader: true
    }
] as {
    secure?: boolean,
    path: string,
    component: any,
    disableHeader?: boolean,
    routeSteps?: RoutePathStep[],
    roles?: Role[]
}[];
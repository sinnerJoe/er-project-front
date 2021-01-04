import React from 'react';
import paths from 'paths';
import  MyDiagramsPage from 'pages/my-diagrams/MyDiagramsPage';
import  CreateDiagram from 'pages/create-diagram/CreateDiagram';
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



export default [
    {
        path: paths.MY_DIAGRAM,
        component: MyDiagramsPage
    },
    {
        path: paths.NEW_DIAGRAM,
        component: CreateDiagram,
        disableHeader: true,
    },
    {
        path: paths.EDIT_DIAGRAM,
        component: EditDiagramPage,
        disableHeader: true,
    },
    {
        path: paths.STUDENT_ASSIGNMENTS,
        component: MyAssignmentsPage
    },
    {
        path: `${paths.EDIT_ASSIGNMENT}/:id?`,
        component: EditAssignmentPage
    },
    {
        path: paths.CREATE_ASSIGNMENT,
        component: EditAssignmentPage
    },
    {
        path: `${paths.PROFESSOR_ASSIGNMENTS}`,
        component: ProfessorAssignmentsPage
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
        component: CreatePlanPage
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
        ]
    },
    {
        path: paths.PLANS,
        component: PlanListPage,
        routeSteps: [STEPS.PLANS]
    },
    {
        path: paths.GROUPS,
        component: GroupsPage
    },
    {
        path: paths.USERS,
        component: UsersPage
    },
    {
        path: paths.CHANGE_PASSWORD,
        component: ChangePasswordPage
    },
    {
        path: paths.EDIT_PROFILE,
        component: EditProfilePage
    },
    {
        path: paths.ALL_ASSIGNMENTS,
        component: AllAssignmentsPage
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
    }
] as {
    secure?: boolean, 
    path: string, 
    component: any, 
    disableHeader?: boolean,
    routeSteps?: RoutePathStep[]

}[];
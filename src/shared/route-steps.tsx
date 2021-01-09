import paths from 'paths';
import React from 'react';

export interface RoutePathStep {
    title: string,
    to?: string,
    icon?: React.ReactNode
}

const STEPS: {[key: string]: RoutePathStep} = {
    MY_DIAGRAM: {
        title: "My diagrams",
        to: paths.MY_DIAGRAM
    },
    STUDENT_ASSIGNMENTS: {
        title: "My assignments",
        to: paths.STUDENT_ASSIGNMENTS
    },
    PLANS: {
        title: "Educational Plans",
        to: paths.PLANS
    },
    GROUPS: {
        title: 'Groups',
        to: paths.GROUPS
    },
    ASSIGNMENTS: {
        title: 'Assignments',
        to: paths.ALL_ASSIGNMENTS
    },
    EDIT_PROFILE: {
        title: 'Edit Profile',
        to: paths.EDIT_PROFILE
    },
    CHANGE_PASSWORD: {
        title: 'Change Password',
        to: paths.CHANGE_PASSWORD
    },
    USERS: {
        title: 'Users',
        to: paths.USERS
    },
    PROFESSOR_ASSIGNMENTS: {
        title: 'Submissions'
    }
};

export default STEPS
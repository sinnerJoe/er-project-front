import { PlannedAssignment } from 'interfaces/Assignment';
import { CollegeGroup } from 'interfaces/Group';
import { EvaluatedSolution, ServerSolution } from 'interfaces/Solution';
import _ from 'lodash';
import { Moment } from 'moment';
import {reshape, shapeBack} from 'shared/reshape';
import { IdIndex } from './Id';
import {Role} from './Role';

export interface User {
    id: IdIndex;
    password?: string;
    email: string;
    role: Role;
    firstName?: string;
    lastName?: string;
    group: string;
    createdAt?: string | Moment
}

export interface Student extends Omit<User, 'group'> {
    group?: CollegeGroup
}

export interface EvaluatedStudent extends Student {
    solution?: EvaluatedSolution
}

export interface UserSummary extends Student {
    evaluatedSolutions: ServerSolution[]
    disabled: '0' | '1';
}

const shape = {
        password: 'password',
        email: 'email',
        role_level: {defaultValue: Role.Student, property: 'role'},
        'first_name': 'firstName',
        'last_name': 'lastName',
        college_group: { defaultValue: 'N/A', property: 'group'}
        
};

export function toUser(object: Object): User {
    return reshape(shape, object);
}

export function fromUser(object:User): Object {
    return shapeBack(shape, object);    
}

export interface Teacher extends Omit<User, 'group'> {
    role: Role.Teacher,
    groups: CollegeGroup[]
}
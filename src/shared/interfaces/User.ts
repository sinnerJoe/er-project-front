import _ from 'lodash';
import {reshape, shapeBack} from 'shared/reshape';
import {Role} from './Role';

export interface User {
    password?: string;
    email: string;
    role: Role;
    firstName?: string;
    secondName?: string;
    group: string
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
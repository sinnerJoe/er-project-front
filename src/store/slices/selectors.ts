import { useRef } from 'react';
import {shallowEqual, useSelector} from 'react-redux';
import {UserState} from './user';



export function useUserSelector(): UserState {
    return useSelector<{user: UserState}, UserState>(state => state.user, shallowEqual);
}
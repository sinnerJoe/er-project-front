import React, { useEffect } from 'react'
import {Redirect} from 'react-router-dom';

import { useUserSelector } from 'store/slices/selectors';
import paths from 'paths';
import { Role } from 'shared/interfaces/Role';
import { useDispatch } from 'react-redux';
import { fetchCurrentUser } from 'store/slices/user';
import { useLoadingRequest, useSynchronizedRequest } from 'utils/hooks';
import withRequestedUser from 'utils/withRequestedUser';

function pickRoute(role: Role): string {
    if(role !== Role.Student) {
        return paths.PROFESSOR_ASSIGNMENTS;
    }
    return paths.MY_DIAGRAM;
}

function EmptyPage() {
    const {role} = useUserSelector();
    return (<Redirect to={pickRoute(role)} />);
}

export default withRequestedUser(() => <Redirect to={paths.LOGIN}/>, EmptyPage);
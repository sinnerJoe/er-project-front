
import React, { useEffect } from 'react'
import {Redirect, useLocation} from 'react-router-dom';

import { useUserSelector } from 'store/slices/selectors';
import paths from 'paths';
import { Role } from 'shared/interfaces/Role';
import { useDispatch } from 'react-redux';
import { fetchCurrentUser } from 'store/slices/user';
import { useLoadingRequest} from 'utils/hooks';

export default function withRequestedUser(UnauthenticatedComponent: React.FC, AuthenticatedComponent: React.FC, assumeAuth: boolean = false) {
    
    return () => {
        const location = useLocation<{avoidAuth: boolean}>();
        const {userId} = useUserSelector();
        const dispatch = useDispatch();
        
        const [requestUser, data, loading] = useLoadingRequest(() => dispatch(fetchCurrentUser()) as any, null, true);
        
        useEffect(() => {
            if(userId === -1 && !location?.state?.avoidAuth) {
                requestUser().catch();
            }
        }, [])

        if(location?.state?.avoidAuth) {
            return assumeAuth ? <AuthenticatedComponent/> : <UnauthenticatedComponent />;
        }
        
        if(userId === -1 && loading) {
            return null;
        }

        if(userId !== -1) {
            return <AuthenticatedComponent />
        }
        
        return <UnauthenticatedComponent />;
    }
}
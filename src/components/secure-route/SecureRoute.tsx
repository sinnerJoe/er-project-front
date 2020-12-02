import paths from 'paths';
import React from 'react'
import { useDispatch } from 'react-redux';
import { Route, useHistory } from 'react-router-dom';
import { useUserSelector } from 'store/slices/selectors'
import { fetchCurrentUser } from 'store/slices/user';

export interface SecureRouteProps{
    path: string;
    component: React.FC<any>
}

export default function SecureRoute({component: Component, path}: SecureRouteProps) {
    const userData = useUserSelector();
    const dispatch = useDispatch();
    const history = useHistory();
    return (
        <Route 
            path={path} 
            render = {(props) => {
                if(userData.userId === -1) {
                    (dispatch(fetchCurrentUser()) as any).then((data: any) => {
                        if(!data.payload) {
                            history.replace(paths.NOT_AUTHENTICATED);
                        }
                    })
                    return null;
                }

                return <Component {...props} />
            }}
        />
    )
}
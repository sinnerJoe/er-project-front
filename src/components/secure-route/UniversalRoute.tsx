import React from 'react'
import { Route } from 'react-router-dom'
import SecureRoute from './SecureRoute'


export interface UniversalRouteProps{
    secure?: boolean;
    exact?: boolean;
    path: string;
    component: React.FC<any>
};

export default function UniversalRoute({secure=true, exact=false, path, component: Component}: UniversalRouteProps) {

    if(secure) {
        return <SecureRoute component={Component} exact={exact} path={path} />;
    }

    return (
        <Route path={path} exact={exact}>
            <Component />
        </Route>
    );
}
import React from 'react'
import { Route } from 'react-router-dom'
import SecureRoute from './SecureRoute'


export interface UniversalRouteProps{
    secure?: boolean;
    path: string;
    component: React.FC<any>
};

export default function UniversalRoute({secure=true, path, component: Component}: UniversalRouteProps) {

    if(secure) {
        return <SecureRoute component={Component} path={path} />;
    }

    return (
        <Route path={path}>
            <Component />
        </Route>
    );
}
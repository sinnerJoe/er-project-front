import React from 'react'

import RoutePathBreadcrumbs from './RoutePathBreadcrumbs';

import './navigation-menu.scss';
import { Header } from 'antd/lib/layout/layout';

type Props = {
    children: any,
}

export default function NavigationMenu({children}: Props) {
    return (
        <Header style={{position: 'fixed', zIndex: 1, width: '100%'}} className="pr-0 pl-0">
            <nav className="nav-menu">
                <div className="full-width"><RoutePathBreadcrumbs /> </div>
                <ul className="nav-menu-items">
                    {children}
                </ul>
            </nav>
        </Header>
    )
}
import React from 'react'

import RoutePathBreadcrumbs from './RoutePathBreadcrumbs';

import './navigation-menu.scss';

type Props = {
    children: any,
}

export default function NavigationMenu({children}: Props) {
    return (
        <nav className="nav-menu">
            <div className="full-width"><RoutePathBreadcrumbs /> </div>
            <ul className="nav-menu-items">
                {children}
            </ul>
        </nav>
    )
}
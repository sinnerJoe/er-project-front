import React from 'react'


import './navigation-menu.scss';

type Props = {
    children: any
}

export default function NavigationMenu({children}: Props) {
    return (
        <nav className="nav-menu">
            <ul className="nav-menu-items">
                {children}
            </ul>
        </nav>
    )
}
import React, { useCallback, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

type Props = {
    icon: any
    destination: string,
    children?: React.ReactElement
}

export function NavItem(props: Props) {
    const [open, setOpen] = useState(false);
    const children: React.ReactNode = useMemo(() => !props.children ? null : 
        React.cloneElement(props.children, {onClose: () => setOpen(false)}), 
    [props.children]);
    return (
        <li className='nav-item'>
            <a className="icon-button" onClick={useCallback(() => setOpen(!open), [])}>
                {props.icon}
            </a>
                {open &&children}
        </li>
    )
}

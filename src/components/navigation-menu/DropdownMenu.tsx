import React, { ReactNode, useState, useContext, useEffect, useRef } from 'react'
import { CSSTransition } from 'react-transition-group';
import _ from 'lodash';
import { useOutsideClickEvent } from 'utils/hooks';
import { Link } from 'react-router-dom';
import { link } from 'fs';
import { useSelector } from 'react-redux';
import { StoreData } from 'store';
import { Role } from 'shared/interfaces/Role';
import routes from 'routes';

const EventContext = React.createContext({ goToMenu: _.noop });

const DEFAULT_STYLE = {};

type Props = {
    children?: React.ReactNode,
    rightMenus?: { [k: string]: React.ReactNode },
    className?: string
    onClose?: () => void
}

function DropdownMenu({ rightMenus = {}, children, onClose, className="" }: Props) {
    const [activeMenu, setActiveMenu] = useState("main");
    const [menuHeight, setMenuHeight] = useState<number | null>(null)
    const dropDownRef = useRef<any>(null)
    useOutsideClickEvent(dropDownRef, onClose || _.noop);
    useEffect(() => {
        setMenuHeight(dropDownRef.current?.firstChild.offsetHeight);
    }, [])

    function calcHeight(el: HTMLElement) {
        const height = el.offsetHeight;
        setMenuHeight(height)
    }

    const menuContent = (
        <div className={`dropdown ${className}`} ref={dropDownRef} style={menuHeight ? { height: (menuHeight as number) } : DEFAULT_STYLE}>
            <CSSTransition
                in={activeMenu === 'main'}
                timeout={400}
                classNames="menu-primary"
                onEnter={calcHeight}
                unmountOnExit>
                <div className="menu">
                    {children}
                </div>
            </CSSTransition>
            { Object.entries(rightMenus).map(([k, v]) => (
                <CSSTransition
                    in={activeMenu === k}
                    timeout={400}
                    classNames="menu-secondary"
                    onEnter={calcHeight}
                    unmountOnExit>
                    <div className="menu">
                        {v}
                    </div>
                </CSSTransition>
            ))}
        </div>
    )
    if (_.isEmpty(rightMenus)) {
        return menuContent;
    }

    return (
        <EventContext.Provider value={{ goToMenu: setActiveMenu }}>
            {menuContent}
        </EventContext.Provider>
    )
}

// const forwardedRefDropdown = React.forwardRef(DropdownMenu);

export { DropdownMenu }

const ROLE_RESTRICTIONS: Record<string, Role[]> = Object.values(routes).reduce((acc, {path, roles}) => {
    acc[path] = roles;
    return acc;
}, {});


export function DropdownItem({link, children, leftIcon, rightIcon, openedMenu, onClick}: { 
    link?: string, 
    children: ReactNode, 
    leftIcon?: ReactNode, 
    rightIcon?: ReactNode, 
    openedMenu?: string, 
    onClick?: () => void, 
    roles?: Role[] }) {
    const { goToMenu } = useContext(EventContext);
    const role = useSelector<StoreData, Role>((state) => state.user.role);
    
    if(link && ROLE_RESTRICTIONS[link] && !ROLE_RESTRICTIONS[link].includes(role)) {
        return null;
    }

    const content = (
        <React.Fragment>
            <span className="icon-button">{leftIcon}</span>
            <span className="ml-2">{children}</span>
            <span className="icon-right">{rightIcon}</span>
        </React.Fragment>
    );

    if (!link)
        return (
            <a className="menu-item" onClick={() => {
               if(openedMenu) {
                   goToMenu(openedMenu)
                }
                if (onClick) {
                    onClick();
                }
            }}>
                { content }
            </a>
        )

    return (
        <Link className="menu-item" to={link}>
            { content }
        </Link>
    )
}
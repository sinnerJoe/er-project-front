import React, { ReactNode, useState, useContext, useEffect, useRef } from 'react'
import { CSSTransition } from 'react-transition-group';
import _ from 'lodash';
import { useOutsideClickEvent } from 'utils/hooks';
import { Link } from 'react-router-dom';
import { link } from 'fs';

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

export function DropdownItem(props: { link?: string, children: ReactNode, leftIcon?: ReactNode, rightIcon?: ReactNode, openedMenu?: string, onClick?: () => void }) {
    const { goToMenu } = useContext(EventContext);
    const content = (
        <React.Fragment>
            <span className="icon-button">{props.leftIcon}</span>
            <span className="ml-2">{props.children}</span>
            <span className="icon-right">{props.rightIcon}</span>
        </React.Fragment>
    );

    if (!props.link)
        return (
            <a className="menu-item" onClick={() => {
               if(props.openedMenu) {
                   goToMenu(props.openedMenu)
                }
                if (props.onClick) {
                    props.onClick();
                }
            }}>
                { content }
            </a>
        )

    return (
        <Link className="menu-item" to={props.link}>
            { content }
        </Link>
    )
}
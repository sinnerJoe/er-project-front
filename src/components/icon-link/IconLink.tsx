import React, {memo} from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Row } from 'antd';

type IconLinkProps = {label: string, className?: string, to:string, icon: React.ReactNode};
function IconLink({label, to, className, icon}: IconLinkProps) {
    return (
        <NavLink to={to} >
            <Row align="middle">
                <span className="pr-2">{icon}</span>
                <span className={className}>{label}</span>
            </Row>
        </NavLink>
    )
}

export default memo(IconLink);
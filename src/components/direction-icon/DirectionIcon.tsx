import { DownOutlined } from '@ant-design/icons';
import _ from 'lodash';
import React, {useState, useRef, useCallback, useMemo} from 'react';
import "./DirectionIcon.scss";

export interface DirectionIconProps {
    open: boolean,
    className?: string,
    onClick?: (ev: React.MouseEvent<HTMLSpanElement, globalThis.MouseEvent>) => void
};

export default function DirectionIcon({open, className="", onClick}: DirectionIconProps) {
    
    const openClass = open ? 'open': '';
    const computedClass = `direction-icon ${className} ${openClass}`;

    return (
        <DownOutlined className={computedClass} onClick={onClick}/>
    );
}
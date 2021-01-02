import { PlusCircleFilled } from '@ant-design/icons';
import { Affix, Button } from 'antd';
import React, {useState, useEffect, useRef, useCallback, useMemo} from 'react';
import { Link } from 'react-router-dom';
import './FloatingPlus.scss';
export interface FloatingPlusProps {
    onClick?: () => void,
    link?: string
};

function FloatingPlus({onClick, link}: FloatingPlusProps) {
   
    const button = (
            <button onClick={onClick} >
                <PlusCircleFilled className="plus" />
            </button>
    )
    return (
        <Affix offsetBottom={50} className="floating-plus">
            {link && <Link to={link}>{button}</Link>}
            {!link && button}
        </Affix>
    )
}

export default React.memo(FloatingPlus);
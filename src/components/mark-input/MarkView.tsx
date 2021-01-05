import { Mark } from 'interfaces/Mark'
import React, { HTMLAttributes } from 'react'
import { IdIndex } from 'shared/interfaces/Id';

import {getMarkClass} from './mark-helpers';

import './mark-view.scss';

export interface MarkViewProps extends HTMLAttributes<HTMLSpanElement> {
    mark?: React.ReactNode,
    containerClass?: string,
    iconClass?: string
}

export default function MarkView({mark, className, onClick, containerClass="", iconClass=getMarkClass(1), ...rest}: MarkViewProps) {
    const renderedMark = mark || 'N/A';

    const markClass = ['string', 'number'].includes(typeof mark) ? getMarkClass(mark as any) : iconClass;

    return (
        <span onClick={onClick} className={ `mark-input ${containerClass}` } {...rest}>
            <span className={ `mark-icon ${markClass} ${className}` }>
                {renderedMark}
            </span>
        </span>
    )
}

MarkView.defaultProps = {
    className: ''
}
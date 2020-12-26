import { Mark } from 'interfaces/Mark'
import React, { HTMLAttributes } from 'react'
import { IdIndex } from 'shared/interfaces/Id';

import {getMarkClass} from './mark-helpers';

import './mark-view.scss';

export interface MarkViewProps extends HTMLAttributes<HTMLSpanElement> {
    mark?: IdIndex
}

export default function MarkView({mark, className, onClick, ...rest}: MarkViewProps) {
    const renderedMark = mark || 'N/A';

    return (
        <span onClick={onClick} className="mark-input" {...rest}>
            <span className={ `mark-icon ${getMarkClass(mark)} ${className}` }>
                {renderedMark}
            </span>
        </span>
    )
}

MarkView.defaultProps = {
    className: ''
}
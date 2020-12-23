import { Mark } from 'interfaces/Mark'
import React from 'react'
import { IdIndex } from 'shared/interfaces/Id';

import {getMarkClass} from './mark-helpers';

import './mark-view.scss';

export interface MarkViewProps {
    onClick?: () => void,
    className: string,
    mark?: IdIndex
}

export default function MarkView(props: MarkViewProps) {
    const mark = props.mark || 'N/A';

    return (
        <span onClick={props.onClick} className="mark-input">
            <span className={ `mark-icon ${getMarkClass(props.mark)} ${props.className}` }>
                {mark}
            </span>
        </span>
    )
}

MarkView.defaultProps = {
    className: ''
}
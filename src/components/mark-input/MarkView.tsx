import { Mark } from 'interfaces/Mark'
import React from 'react'

import {getMarkClass} from './mark-helpers';

import './mark-view.scss';

type Props = Partial<Mark> & {
    onClick?: () => void,
    className: string
}

export default function MarkView(props: Props) {
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
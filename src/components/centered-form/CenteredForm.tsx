import { Row } from 'antd';
import React from 'react'

import './CenteredForm.scss';

type Props = {
    children: React.ReactChild | React.ReactNode[],
    width?: number,
    height?: number,
    style?: any
}

const CenteredForm = ({ children, width = 350, height = 500, style }: Props) => {

    return (
        <Row justify="center">
            <div style={{...style, width, height }} className="centered-form">
                <div className="inner-wrapper">
                    {children}
                </div>
            </div>
        </Row>
    )
}


export default CenteredForm;
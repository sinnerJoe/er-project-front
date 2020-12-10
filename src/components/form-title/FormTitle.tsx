import React from 'react'
import {Typography} from 'antd';

import './form-title.scss';
const {Title} = Typography;

type Props = {
    children: React.ReactNode
}

export default function FormTitle(props: Props) {
    return (
            <div className="mb-6 form-title">
                <div className="container">
                <div className="title-content">
                    <Title level={3} className="pb-0 mb-0">
                        {props.children}
                    </Title>
                </div>
                </div>
            </div>
    )
}
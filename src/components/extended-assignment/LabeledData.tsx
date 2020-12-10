import React from 'react'
import {Typography} from 'antd';

const {Text} = Typography;

type Props = {
    children: React.ReactNode,
    label: string
}

export default function LabeledData({children, label} : Props) {
    return (
        <React.Fragment>
            <Text strong>
                {label}
            </Text>
            <div className="mt-1">
                {children}
            </div>
        </React.Fragment>
    )
}
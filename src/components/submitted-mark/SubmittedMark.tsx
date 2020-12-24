import { Space, Typography } from 'antd';
import MarkView from 'components/mark-input/MarkView';
import { Moment } from 'moment';
import React, {useState, useEffect, useRef, useCallback, useMemo} from 'react';
import { IdIndex } from 'shared/interfaces/Id';
import { Teacher } from 'shared/interfaces/User';

const {Text}= Typography;

export interface SubmittedMarkProps {
    
mark?: IdIndex, 
reviewedAt?: string | Moment, 
reviewer: Teacher, 
className?: string
};

export default function SubmittedMark(props: SubmittedMarkProps) {

    return (
        <Space direction="vertical" className={props.className || ''} >
            <Space direction="horizontal" size="small">
                <MarkView mark={props.mark} />
                <Text>
                    by <Text strong>
                        {props.reviewer.firstName} {props.reviewer.lastName}
                        </Text>
                </Text>
                <Text type="secondary">{`(${props.reviewedAt})`}</Text>
            </Space>
        </Space>
    )
}

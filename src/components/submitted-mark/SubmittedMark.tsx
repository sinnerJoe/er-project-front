import { Space, Typography } from 'antd';
import MarkView from 'components/mark-input/MarkView';
import { Moment } from 'moment';
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { IdIndex } from 'shared/interfaces/Id';
import { Teacher } from 'shared/interfaces/User';

const { Text } = Typography;

const ReviewerName = ({ reviewer }: { reviewer?: Teacher }) => {
    if (!reviewer) {
        return <i>Deleted User</i>
    }

    return <i>{`${reviewer.firstName} ${reviewer.lastName}`}</i>;
}
export interface SubmittedMarkProps {

    mark?: IdIndex,
    reviewedAt?: string | Moment,
    reviewer?: Teacher,
    className?: string
};

export default function SubmittedMark(props: SubmittedMarkProps) {

    return (
        <Space direction="vertical" className={props.className || ''} >
            <Space direction="horizontal" size="small">
                <MarkView mark={props.mark} />
                <Text>
                    by <Text strong>
                        <ReviewerName reviewer={props.reviewer} />
                    </Text>
                </Text>
                <Text type="secondary">{`(${props.reviewedAt})`}</Text>
            </Space>
        </Space>
    )
}

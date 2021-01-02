import { DeleteFilled, LinkOutlined } from '@ant-design/icons';
import { Button, Popover, Space, Typography } from 'antd';
import AttachmentLink from 'components/attachment-link/AttachmentLink';
import PromiseButton from 'components/promise-button/PromiseButton';
import { PlannedAssignment } from 'interfaces/Assignment';
import paths from 'paths';
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { deleteAssignment } from 'shared/endpoints';
import { IdIndex } from 'shared/interfaces/Id';
import { useLoadingRequest } from 'utils/hooks';

const {Title, Text} = Typography;

export interface DeleteAssignmentButtonProps {
    id: IdIndex,
    plannedAssignments: PlannedAssignment[],
    onDelete: () => void
};

export default function DeleteAssignmentButton({ id, plannedAssignments, onDelete }: DeleteAssignmentButtonProps) {

    const disabled = plannedAssignments.length > 0;

    const button = (
        <span>
            <PromiseButton
                onClick={(stopLoading) => deleteAssignment(id, stopLoading).then(onDelete)}
                danger
                disabled={disabled}
                type="primary"
                icon={<DeleteFilled />}>
                Delete
            </PromiseButton>
        </span>
    );

    if (!disabled) {
        return button;
    }

    return (
        <Popover
            trigger="hover"
            content={
                <Space className={!disabled ? 'display-none' : undefined} direction="vertical" size="small">
                    <Title level={5}>
                       Scheduled in 
                    </Title>
                    {plannedAssignments.filter(p => !!p.plan).map(planned => (
                        <Link to={`${paths.EDIT_PLAN}/${planned.plan?.id}`} target="_blank">
                            <AttachmentLink>
                                {planned.plan?.name}
                            </AttachmentLink>
                        </Link>
                    ))}
                </Space>
            }>
            {button}
        </Popover>
    )
}

import _ from 'lodash';
import moment from 'moment'
import { Plan } from 'interfaces/Plan';
import { Button, Card, Col, Form, Input, Row, Space, Typography } from 'antd';
import PlannedAssignmentsList, { PlannedAssignmentMode } from './PlannedAssignmentsList';
import { addPlannedAssignments, deletePlan } from 'shared/endpoints';
import React, { useState, useRef, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import paths from 'paths';
import { DeleteFilled } from '@ant-design/icons';
import { useLoadingRequest } from 'utils/hooks';
import { SERVER_DATE_TIME } from 'shared/constants';
import { openConfirmPromise } from 'utils/modals';
import { IdIndex } from 'shared/interfaces/Id';

const { Text } = Typography;
export interface PlanDisplayProps {
    data: Plan,
    onDelete?: () => void
};

export default function PlanDisplay({ data, onDelete = _.noop }: PlanDisplayProps) {

    const [requestDelete, d, loading] = useLoadingRequest(deletePlan, null);

    const handleOnDeleteClick = (id: IdIndex) => {
        openConfirmPromise({
            onOk: () => requestDelete(id),
            content: (
                <div>
                    Are you sure you want to delete plan <b>{data.name}</b>?
                    <ul>
                        <li>Student solutions submitted to the assignments in this plan will be unsubmitted.</li>
                        <li>The reviews for those submissions will be removed as well.</li>
                        <li>The groups under this educational plan will be left with no plan.</li>
                    </ul>
                </div>
            )
        }).then(onDelete).catch(_.noop);

    }

    return (
        <Card title={data.name}>
            <PlannedAssignmentsList mode={PlannedAssignmentMode.View} value={data.plannedAssignments} />
            <Row justify="space-between" align="middle" className="mt-4">
                <Col>
                    <Text type="secondary">
                        Updated at {moment(data.updatedAt).format(SERVER_DATE_TIME)}
                    </Text>
                </Col>
                <Col>
                    <Link to={`${paths.EDIT_PLAN}/${data.id}`}>
                        <Button type="primary" className="mr-2">
                            Edit
                    </Button>
                    </Link>
                    <Button
                        onClick={() => {
                            if (data.id) {
                                handleOnDeleteClick(data.id);
                            }
                        }}
                        loading={loading}
                        icon={<DeleteFilled />}
                        type="primary" danger>
                        Delete
                </Button>
                </Col>
            </Row>
        </Card>
    )
}
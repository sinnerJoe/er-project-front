
import _ from 'lodash';
import { Plan } from 'interfaces/Plan';
import { Button, Card, Form, Input, Row, Space } from 'antd';
import PlannedAssignmentsList, { PlannedAssignmentMode } from './PlannedAssignmentsList';
import { addPlannedAssignments, deletePlan } from 'shared/endpoints';
import React, {useState, useRef, useCallback, useMemo} from 'react';
import { Link } from 'react-router-dom';
import paths from 'paths';
import { DeleteFilled } from '@ant-design/icons';
import { useLoadingRequest } from 'utils/hooks';

export interface PlanDisplayProps {
   data: Plan,
   onDelete?: () => void
};

export default function PlanDisplay({data, onDelete = _.noop}: PlanDisplayProps) {

    const [request, d, loading] = useLoadingRequest(deletePlan, null);

    return (
        <Card title={data.name}>
            <PlannedAssignmentsList mode={PlannedAssignmentMode.View} value={data.plannedAssignments}/>
            <Row justify="end" className="mt-4">
                <Link to={`${paths.EDIT_PLAN}/${data.id}`}>
                    <Button type="primary" className="mr-2">
                        Edit
                    </Button>
                </Link>
                <Button
                    onClick={() => {
                        if(data.id) {
                            deletePlan(data.id).then(onDelete);
                        }
                    }}
                    loading={loading} 
                    icon={<DeleteFilled />} 
                    type="primary" danger>
                    Delete
                </Button>
            </Row>
        </Card>
    )
}
import { PlannedAssignment, ServerAssignment } from 'interfaces/Assignment';
import React, { useState, useRef, useCallback, useMemo } from 'react';
import moment, { Moment } from 'moment';
import { Plan } from 'interfaces/Plan';
import { Button, Form, Input, Row } from 'antd';
import PlannedAssignmentsList, { PlannedAssignmentMode } from './PlannedAssignmentsList';
import { filterAdded, filterRemoved } from './helpers';
import { IdIndex } from 'shared/interfaces/Id';
import { SERVER_DATE, SERVER_DATE_TIME } from 'shared/constants';
import { firstSecond, lastSecond } from 'utils/datetime';
import { emptySpace } from 'shared/validators';

export interface SentPlannedAssignment {
    startDate: string,
    endDate: string,
    assignment: {
        id: IdIndex
    }
}

export interface PlanEditorProps {
    initialState?: Plan,
    onSave: (name: string, assignments: { added: SentPlannedAssignment[], removed: IdIndex[], modified: { startDate: string, endDate: string }[] }) => Promise<unknown>,
};

const defaultState: Plan = {
    name: '',
    updatedAt: moment(),
    plannedAssignments: []
}

export default function PlanEditor({ initialState: propsState, onSave }: PlanEditorProps) {

    const editing = useMemo(() => !propsState, []);

    const initialState = propsState || defaultState;

    const [form] = Form.useForm()

    const [loading, setLoading] = useState(false);

    const handleSendData = (data: any) => {
        setLoading(true);
        onSave(data.name, prepareAssignments(initialState.plannedAssignments, data.plannedAssignments)).then(() => setLoading(false));
    }
    return (
        <Form
            form={form}
            initialValues={initialState}
            className="full-width"
            layout="vertical"
            name="plan-form"
            onFinish={handleSendData}>
            <Form.Item label="Title" name="name" rules={[{ 
                validator: emptySpace, 
                message: "Title field is mandatory." }]} >
                <Input type="text" />
            </Form.Item>
            <h3 className="bold mb-4">Planned Assignments</h3>
            <Form.Item name="plannedAssignments" noStyle>
                <PlannedAssignmentsList mode={PlannedAssignmentMode.Edit} />
            </Form.Item>
            <Form.Item>
                <Row justify="end" className="mt-4">
                    <Button size="large" type="primary" htmlType="submit" loading={loading}>
                        {editing ? "Create Plan" : "Apply Changes"}
                    </Button>
                </Row>
            </Form.Item>
        </Form>
    )
}

function prepareAssignments(oldAssignments: PlannedAssignment[], newAssignments: PlannedAssignment[]) {
    const getId = (a: PlannedAssignment) => a.id;
    const oldIds = oldAssignments.map(getId);
    const newIds = newAssignments.map(getId)
    const modified = newAssignments.filter((assign) => {
        const oldAssignment = oldAssignments.find(v => v.id === assign.id);
        if (!oldAssignment) {
            return false;
        }
        return !(oldAssignment as any).startDate.isSame(assign.startDate) || !(oldAssignment as any).endDate.isSame(assign.endDate);
    });

    const added = filterAdded(oldIds, newIds);

    const removed = filterRemoved(oldIds, newIds);

    return {
        removed,
        added: added.map(id => {
            const assign = newAssignments.find(v => v.id === id);
            return {
                assignment: {
                    id: assign?.assignment.id
                },
                endDate: lastSecond(assign?.endDate).format(SERVER_DATE_TIME),
                startDate: firstSecond(assign?.startDate).format(SERVER_DATE_TIME)
            } as SentPlannedAssignment;
        }),
        modified: modified.map(v => ({
            endDate: lastSecond(v.endDate).format(SERVER_DATE_TIME),
            startDate: firstSecond(v.startDate).format(SERVER_DATE_TIME),
            id: v.id
        }))
    }
}
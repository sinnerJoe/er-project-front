import { Typography } from 'antd';
import { Plan } from 'interfaces/Plan';
import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { fetchAllPlans, getTeachers } from 'shared/endpoints';
import { Teacher, User } from 'shared/interfaces/User';
import { getCurrentYear } from 'utils/datetime';
import { useLoadingRequest, useQueryStringMaster } from 'utils/hooks';
import PickerModal, { PickerModalProps, StandardOverridenProps } from '../picker-modal/PickerModal';

export interface PlanPickerModalProps extends Omit<PickerModalProps<Teacher>, StandardOverridenProps> {
    onOk: (user: Plan) => void,
    initialValue: Plan | null
};

const { Text } = Typography;

export default function PlanPickerModal({ onOk, initialValue, visible, ...rest }: PlanPickerModalProps) {

    const [request, data, loading, err] = useLoadingRequest(fetchAllPlans, [], true);

    useEffect(() => {
        if (visible) {
            request();
        }
    }, [visible])

    const selectedTeacher = useMemo(() => data.find(t => initialValue?.id === t.id) || null, [data]);

    return (
        <PickerModal
            data={data}
            initialSelected={selectedTeacher}
            loading={loading}
            onOk={onOk}
            renderItem={({ name, plannedAssignments }) => {
                return (
                    <div title={plannedAssignments.map(planned => planned.assignment.title).join('\n')}>
                        {name}
                    </div>
                )
            }}
            width={450}
            title="Pick Plan"
            visible={visible}
            {...rest}
        />
    )
}
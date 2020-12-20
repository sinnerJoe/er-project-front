import { Typography } from 'antd';
import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { getTeachers } from 'shared/endpoints';
import { Teacher, User } from 'shared/interfaces/User';
import { getCurrentYear } from 'utils/datetime';
import { useLoadingRequest, useQueryStringMaster } from 'utils/hooks';
import PickerModal, { PickerModalProps, StandardOverridenProps } from '../picker-modal/PickerModal';

export interface CoordinatorPickerModalProps extends Omit<PickerModalProps<Teacher>, StandardOverridenProps> {
    onOk: (user: Teacher) => void,
    initialValue: Teacher | null
};

const { Text } = Typography;

export default function CoordinatorPickerModal({ onOk, initialValue, visible, ...rest }: CoordinatorPickerModalProps) {

    const [request, data, loading, err] = useLoadingRequest(getTeachers, [], true);

    const {year = getCurrentYear()} = useQueryStringMaster()

    useEffect(() => {
        if (visible) {
            request(year);
        }
    }, [visible])

    const selectedTeacher = useMemo(() => data.find(t => initialValue?.id === t.id) || null, [data]);

    return (
        <PickerModal
            data={data}
            initialSelected={selectedTeacher}
            loading={loading}
            onOk={onOk}
            renderItem={({ groups, firstName, lastName, id }) => {
                return (
                    <React.Fragment key={id}>
                        <div>{`${firstName} ${lastName}`}</div>
                        <Text type="secondary">{
                            !!groups.length ? `Groups: ${groups.map(g => g.name).join(', ')}`
                                          : 'No groups assigned'
                    }</Text>
                    </React.Fragment>
                )
            }}
            width={450}
            title="Pick Coordinator"
            visible={visible}
            {...rest}
        />
    )
}
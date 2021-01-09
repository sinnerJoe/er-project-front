import { DeleteFilled } from '@ant-design/icons';
import { Button, Table } from 'antd';
import PromiseButton from 'components/promise-button/PromiseButton';
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { setStudentGroup } from 'shared/endpoints';
import { IdIndex } from 'shared/interfaces/Id';
import { Student, User } from 'shared/interfaces/User';
import { useSearch } from 'shared/sorting';
import { openConfirmPromise } from 'utils/modals';

export interface StudentListTableProps {
    onChange: () => void,
    data: Student[],

};

export default function StudentListTable(props: StudentListTableProps) {
    return (<Table
        dataSource={props.data}
        pagination={false}
        rowKey={(v) => v.id}
        columns={[
            {
                title: "Name",
                dataIndex: 'firstName',
                render: (key, student) => `${student.firstName} ${student.lastName}`,
                ...useSearch('name', (v: Student) => `${v.firstName} ${v.lastName}`)
            },
            {
                title: "Email",
                dataIndex: 'email',
                ...useSearch('email address', (v: Student) => v.email)
            },
            {
                title: "Registration Date",
                dataIndex: 'createdAt'
            },
            {
                dataIndex: 'id',
                width: 110,
                render: (id: IdIndex, {firstName, lastName}) => (
                    <PromiseButton 
                        type="primary"
                        danger
                        icon={<DeleteFilled />}
                        onClick={() => {
                            return openConfirmPromise({
                                onOk: () => { 
                                    const promise = setStudentGroup(id, null)
                                    promise.then(props.onChange);
                                    return promise;
                                },
                                content: `Are you sure you want to remove ${firstName} ${lastName} from the group?`
                            }).catch();
                        }} >
                        Remove
                    </PromiseButton>
                )
            },
        ]}
    />);
}
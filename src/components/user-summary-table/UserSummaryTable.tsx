import { DeleteFilled } from '@ant-design/icons';
import { Table } from 'antd';
import PromiseButton from 'components/promise-button/PromiseButton';
import React, {useState, useEffect, useRef, useCallback, useMemo} from 'react';
import { deleteUser } from 'shared/endpoints';
import { IdIndex } from 'shared/interfaces/Id';
import { Role } from 'shared/interfaces/Role';
import { UserSummary } from 'shared/interfaces/User';
import EvaluationSummary from './EvaluationSummary';
import RoleSwitcher from './RoleSwitcher';

export interface UserSummaryTableProps {
    users: UserSummary[],
    onChange: () => void,
    loading: boolean
};

export default function UserSummaryTable({users, onChange, loading}: UserSummaryTableProps) {

    const expandedRowRender =  (user: UserSummary) => <EvaluationSummary user={user} />
    return (
        <Table
            loading={loading}
            expandable={{
                expandedRowRender,
                rowExpandable: (user: UserSummary) => !!user.evaluatedSolutions.length
            }}
            rowKey="id"
            dataSource={users}
            columns={[
                {
                    title: "Full Name",
                    dataIndex: 'firstName',
                    key: 'firstName',
                    render: (v, user) => `${user.firstName} ${user.lastName}`
                },
                {
                    title: "Email Address",
                    dataIndex: 'email',
                    key: 'email'
                },
                {
                    title: "Registration Date",
                    dataIndex: "createdAt",
                    key: "createdAt"
                },
                {
                    title: "Role",
                    dataIndex: "role",
                    key: "role",
                    render: (v: IdIndex, user: UserSummary) => {
                        const role: Role = Number(v);
                        return <RoleSwitcher onChange={onChange} role={role} userId={user.id} />
                    }
                },
                {
                    dataIndex: 'id',
                    key: 'delete',
                    render: (id: IdIndex) => (
                        <PromiseButton 
                            danger 
                            type="primary"
                            icon={<DeleteFilled />}
                            onClick={() => {
                                const promise = deleteUser(id);
                                promise.then(onChange);
                                return promise;
                            }}
                        >
                            Delete
                        </PromiseButton>
                    )
                }
            ]}
        />
    )
}
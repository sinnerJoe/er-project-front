import { DeleteFilled } from '@ant-design/icons';
import { Table } from 'antd';
import PromiseButton from 'components/promise-button/PromiseButton';
import React, {useState, useEffect, useRef, useCallback, useMemo} from 'react';
import { deleteUser } from 'shared/endpoints';
import { IdIndex } from 'shared/interfaces/Id';
import { Role } from 'shared/interfaces/Role';
import { UserSummary } from 'shared/interfaces/User';
import { sortNullable, stringSort, useSearch } from 'shared/sorting';
import EvaluationSummary from './EvaluationSummary';
import RoleSwitcher from './RoleSwitcher';

export interface UserSummaryTableProps {
    users: UserSummary[],
    onChange: () => void,
    loading: boolean
};
const extractFullName = (user: UserSummary) => `${user.firstName} ${user.lastName}`
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
                    render: (v, u) => extractFullName(u),
                    ...useSearch('name', extractFullName) as any
                },
                {
                    title: "Email Address",
                    dataIndex: 'email',
                    key: 'email',
                    ...useSearch('email', (u: UserSummary) => u.email)
                },
                {
                    title: "Registration Date",
                    dataIndex: "createdAt",
                    key: "createdAt"
                },
                {
                    title: "Group",
                    dataIndex: ['group', 'name'],
                    render: (v) => v || 'No group',
                    sorter: (u1: UserSummary, u2: UserSummary) => {
                        return sortNullable(u1?.group?.name, u2?.group?.name, stringSort);
                    }
                },
                {
                    title: "Role",
                    dataIndex: "role",
                    key: "role",
                    render: (v: IdIndex, user: UserSummary) => {
                        const role: Role = Number(v);
                        return <RoleSwitcher onChange={onChange} role={role} userId={user.id} />
                    },
                    sorter: (u1, u2) => stringSort(u1.role, u2.role)
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
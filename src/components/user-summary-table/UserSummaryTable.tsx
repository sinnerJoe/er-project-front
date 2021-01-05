import { CheckSquareOutlined, CloseSquareOutlined, DeleteFilled } from '@ant-design/icons';
import { Table, Typography } from 'antd';
import PromiseButton from 'components/promise-button/PromiseButton';
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { deleteUser } from 'shared/endpoints';
import { IdIndex } from 'shared/interfaces/Id';
import { Role } from 'shared/interfaces/Role';
import { UserSummary } from 'shared/interfaces/User';
import { sortNullable, stringSort, useSearch } from 'shared/sorting';
import { openConfirmPromise } from 'utils/modals';
import EvaluationSummary from './EvaluationSummary';
import RoleSwitcher from './RoleSwitcher';

const { Text } = Typography;
export interface UserSummaryTableProps {
    users: UserSummary[],
    onChange: () => void,
    loading: boolean
};
const extractFullName = (user: UserSummary) => `${user.firstName} ${user.lastName}`
export default function UserSummaryTable({ users, onChange, loading }: UserSummaryTableProps) {

    const expandedRowRender = (user: UserSummary) => <EvaluationSummary onRefresh={onChange} user={user} />
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
                    title: "Active",
                    dataIndex: 'disabled',
                    key: 'disabled',
                    className: 'text-center',
                    render: (v) => {
                        const style = { fontSize: '20px' };
                        switch (v) {
                            case '1': return <Text type="danger">  <CloseSquareOutlined style={style} /></Text>
                            default: return <Text type="success">  <CheckSquareOutlined style={style} /></Text>
                        }
                    },
                    sorter: (u1, u2) => stringSort(u1.disabled, u2.disabled) 
                },
                {
                    title: "Full Name",
                    dataIndex: 'firstName',
                    key: 'firstName',
                    render: (v, u) => extractFullName(u),
                    ...useSearch('name', extractFullName)
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
                    },
                    ...useSearch('group', (u: UserSummary) => u?.group?.name || 'No group')
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
                    render: (id: IdIndex, user) => (
                        <PromiseButton
                            danger
                            type="primary"
                            icon={<DeleteFilled />}
                            onClick={() => {
                                return openConfirmPromise({
                                    onOk: () => {
                                        const promise = deleteUser(id);
                                        promise.then(onChange);
                                        return promise;
                                    },
                                    content: (
                                        <React.Fragment>
                                            <span>
                                                Are you sure you want to delete the user
                                                <b className="ml-1">{user.firstName} {user.lastName}</b>?
                                            </span>
                                            <div>

                                                <Text strong>
                                                    The following will be removed FOREVER:
                                                </Text>
                                                <ul>
                                                    <li>User's personal data.</li>
                                                    <li>All of the solutions created by the user.</li>
                                                    <li>All reviews of those solution.</li>
                                                </ul>
                                                <Text strong type="danger">
                                                    <div className="text-center">This is irreversible!</div>
                                                </Text>
                                            </div>
                                        </React.Fragment>
                                    )
                                })
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
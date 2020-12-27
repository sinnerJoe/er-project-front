import { DeleteFilled } from '@ant-design/icons';
import { Input, List, Typography, Form, Modal } from 'antd';
import React, {useState, useEffect, useRef, useCallback, useMemo} from 'react';
import { deleteCurrentUser } from 'shared/endpoints';
import { useLoadingRequest } from 'utils/hooks';

const {Text} = Typography;

export interface ConfirmAccountDeleteModalProps {
    visible: boolean,
    onCancel: () => void
};

export default function ConfirmAccountDeleteModal({visible, onCancel}: ConfirmAccountDeleteModalProps) {
    const [password, setPassword] = useState('');

    const [request, rsp, loading, err] = useLoadingRequest(deleteCurrentUser, null);

    return (
        <Modal
            width={350}
            okButtonProps={{
                icon: <DeleteFilled />,
                loading, disabled: !password.length, danger: true}}
            okText="DELETE"
            title="Delete this account"
            onCancel={onCancel}
            closable
            visible={visible}
            onOk={() => {
                request(password).then(onCancel).catch(() => {})
            }}
        >
            <Text type='danger'>
                This change is irreversible. Every piece of data associated with this account will be 
                deleted including:
            <ul>
                <li>
                    All posted solutions
                </li>
                <li>
                    Received marks
                </li>
                <li>
                   Your personal data (email, name) 
                </li>
            </ul>
            </Text>
            <Form.Item label="Password">
            <Input.Password
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                />
            </Form.Item>
        </Modal>
    )
}
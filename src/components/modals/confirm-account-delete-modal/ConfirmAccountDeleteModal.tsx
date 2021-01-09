import { DeleteFilled } from '@ant-design/icons';
import { Input, List, Typography, Form, Modal } from 'antd';
import React, {useState, useEffect, useRef, useCallback, useMemo} from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { deleteCurrentUser } from 'shared/endpoints';
import { clearData } from 'store/slices/user';
import { useLoadingRequest } from 'utils/hooks';
import { hashPassword } from 'utils/password';

const {Text} = Typography;

export interface ConfirmAccountDeleteModalProps {
    visible: boolean,
    onCancel: () => void
};

export default function ConfirmAccountDeleteModal({visible, onCancel}: ConfirmAccountDeleteModalProps) {
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const history = useHistory();

    const [request, rsp, loading, err] = useLoadingRequest(deleteCurrentUser, null);

    const onResponse = () => {
        dispatch(clearData());
        onCancel();
        history.push(""); 
    }

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
                request(hashPassword(password)).then(onResponse).catch(() => {});
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
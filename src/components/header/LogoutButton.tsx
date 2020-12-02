import { LoadingOutlined, LogoutOutlined } from '@ant-design/icons';
import { DropdownItem } from 'components/navigation-menu/DropdownMenu';
import paths from 'paths';
import React from 'react'
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { logoutSession } from 'shared/endpoints';
import { clearData } from 'store/slices/user';
import { useLoadingRequest } from 'utils/hooks';

export default function LogoutButton() {
    const dispatch = useDispatch();

    const history = useHistory();


    const [logoutRequest, response, logoutPending] = useLoadingRequest(logoutSession, null);

    const handleLogout = () => {
        logoutRequest().then(() => {
            history.replace(paths.LOGIN);
            dispatch(clearData());
        });
    };

    return (<DropdownItem onClick={handleLogout} leftIcon={logoutPending ? <LoadingOutlined /> : <LogoutOutlined />}>
                        Log Out
            </DropdownItem>)
}
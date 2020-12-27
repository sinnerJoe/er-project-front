import { DeleteFilled } from '@ant-design/icons';
import { Button } from 'antd';
import ConfirmAccountDeleteModal from 'components/modals/confirm-account-delete-modal/ConfirmAccountDeleteModal';
import { useModal } from 'components/modals/modal-hooks';
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';

export interface DeleteUserButtonProps {

};

export default function DeleteUserButton(props: DeleteUserButtonProps) {
    const [modal, open] = useModal(ConfirmAccountDeleteModal, {});
    return (
        <React.Fragment>
            {modal}
            <Button
                icon={<DeleteFilled />}
                onClick={open}
                className="full-width"
                size="large"
                danger
                type="primary">
                DELETE ACCOUNT
            </Button>
        </React.Fragment>
    );
}
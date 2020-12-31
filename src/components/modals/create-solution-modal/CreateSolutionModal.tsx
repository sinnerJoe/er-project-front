import React, { useCallback, useEffect, useState } from 'react'
import {Input, Modal, Select} from 'antd'
import _ from 'lodash';
import { useHistory } from 'react-router-dom';
import paths from 'paths';

export interface CreateSolutionModalProps {
    onCancel?: () => void;
    visible: boolean,
    onOk?: (title: string) => void
}

export default function CreateSolutionModal({onCancel = _.noop, visible, onOk}:CreateSolutionModalProps) {

    const [title, setTitle] = useState("");

    const history = useHistory();

    const handleOk = useCallback(() => {
        if(!onOk) {
            history.push(paths.NEW_DIAGRAM, {title});
        } else {
            onOk(title);
        }
        onCancel();
    }, [title]);

    return (
        <Modal 
            title="Create Solution"
            okText="Start editimg"
            onOk={handleOk}
            visible={visible}
            onCancel={onCancel || _.noop}
            okButtonProps={{disabled: title.trim().length === 0}}
            closable>
                <label>
                    Title
                </label>
                <Input 
                    value={title}
                    className="full-width"
                    onChange={(event) => setTitle(event.target.value)}
                />
            </Modal>
    )
}
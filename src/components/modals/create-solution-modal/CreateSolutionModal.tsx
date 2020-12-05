import React, { useCallback, useEffect, useState } from 'react'
import {Input, Modal, Select} from 'antd'
import { Solution } from 'interfaces/Solution'
import { getSolutions } from 'actions/diagram';
import { useHistory } from 'react-router-dom';
import paths from 'paths';

export interface CreateSolutionModalProps {
    onClose: () => void;
    visible: boolean
}

export default function CreateSolutionModal(props:CreateSolutionModalProps) {

    const [title, setTitle] = useState("");

    const history = useHistory();

    const handleOk = useCallback(() => {
        history.push(paths.NEW_DIAGRAM, {title});
        props.onClose();
    }, [title]);

    return (
        <Modal 
            title="Create Solution"
            okText="Start editimg"
            onOk={handleOk}
            visible={props.visible}
            onCancel={props.onClose}
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
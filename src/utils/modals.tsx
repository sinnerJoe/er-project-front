import React from 'react';
import { ExclamationCircleOutlined, ExclamationOutlined } from '@ant-design/icons';
import {Modal, Typography} from 'antd';
import { ModalFuncProps, ModalProps } from 'antd/lib/modal';
import { PartialBy } from 'interfaces/helpers';

const {Title} = Typography;
export interface ConfirmModalProps extends Omit<ModalFuncProps, 'onOk'> {
    onOk?: () => Promise<unknown> | void
} 

export const openConfirmPromise = ({onOk, onCancel, ...rest}: ConfirmModalProps = {}) => {
    return new Promise((resolve, reject) => {
        Modal.confirm({
            icon: <Title 
                level={1} 
                type="warning" 
                className="mb-4 text-center">
                    <ExclamationCircleOutlined type="success" />
                </Title>,
            ...rest,
            onOk: (close) => {
                if(onOk) {
                    const potentialPromise = onOk();
                    if(potentialPromise) {
                        potentialPromise.then(resolve);
                    } else {
                        resolve(undefined);
                    }
                    close();
                } else {
                    resolve(undefined);
                }
            },
            onCancel: () => {
                if(onCancel) {
                    onCancel();
                }
                reject();
            }
        })
    })
}
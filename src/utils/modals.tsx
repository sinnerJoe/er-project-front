import React from 'react';
import { ExclamationOutlined } from '@ant-design/icons';
import {Modal} from 'antd';
import { ModalFuncProps, ModalProps } from 'antd/lib/modal';
import { PartialBy } from 'interfaces/helpers';

export interface ConfirmModalProps extends Omit<ModalFuncProps, 'onOk'> {
    onOk?: () => Promise<unknown> | void
} 

export const openConfirmPromise = ({onOk, onCancel, ...rest}: ConfirmModalProps = {}) => {
    return new Promise((resolve, reject) => {
        Modal.confirm({
            icon: <ExclamationOutlined />,
            ...rest,
            onOk: (close) => {
                if(onOk) {
                    const potentialPromise = onOk();
                    if(potentialPromise) {
                        potentialPromise.then(resolve);
                    } else {
                        resolve();
                    }
                    close();
                } else {
                    resolve();
                }
            },
            onCancel: (close) => {
                reject();
                if(onCancel) {
                    onCancel(close);
                }

                close();    
            }
        })
    })
}
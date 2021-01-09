import { LoadingOutlined } from '@ant-design/icons';
import _ from 'lodash';
import { Empty, Modal, Skeleton } from 'antd';
import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';

import './PickAssignmentModal.scss';
import PickerListSkeleton from './PickerListSkeleton';

export type StandardOverridenProps = 'onOk' | 'data' | 'loading' | 'initialSelected' | 'renderItem' | 'title';

export interface PickerModalProps<T> extends Omit<React.ComponentProps<typeof Modal>, 'onOk'> {
    controls?: React.ReactNode,
    data: T[],
    renderItem: (itemData: T) => React.ReactNode,
    loading: boolean,
    onOk: (selectedItem: T) => void | Promise<unknown>,
    initialSelected: T | null,
};

export default function PickerModal<T>({ 
    controls = null,
    initialSelected = null, 
    data, 
    renderItem, 
    onOk, 
    loading, 
    visible, ...rest }: PickerModalProps<T>) {

    const [selected, setSelected] = useState<T | null>(initialSelected);

    const [okLoading, setOkLoading] = useState(false);

    useEffect(() => {
        if(!!initialSelected) {
            setSelected(initialSelected);
        }
    }, [initialSelected]);

    useEffect(() => {
        if(!!selected && !data.includes(selected)) {
            setSelected(null);
        }
    }, [data])

    useEffect(() => {
        if(!visible) {
            setOkLoading(false);
        }
    }, [visible])

    return (
        <Modal
            closable
            onOk={(e) => {
                if(selected) {
                    const potentialPromise = onOk(selected);
                    if(!!potentialPromise) {
                        setOkLoading(true);
                        potentialPromise.then(() => {
                            rest.onCancel?.(e);
                            setOkLoading(false);
                        }).catch(() => {
                            setOkLoading(false);
                        })
                    } else {
                        rest.onCancel?.(e);
                    }
                }
            }}
            okButtonProps={{ disabled: !selected, loading: okLoading} }
            visible={visible}
            {...rest}
        >

        {controls}

        { !loading && (<div className="modal-picker">
                {data.map(v => {
                    const selectedClass = v === selected ? 'selected-entry' : '';

                    return (
                        <div className={`pl-2 pr-2 pt-2 pb-2 list-entry ${selectedClass}`}
                             onClick={() => setSelected(v)}>
                            {renderItem(v)}
                        </div>
                    )
                })}
            </div>)
        }

        {loading && <PickerListSkeleton/>}

        {!loading && !data.length && <Empty/>}

        
        </Modal>

    )
}
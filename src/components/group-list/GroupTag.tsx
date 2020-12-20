import React, {useState, useRef, useCallback, useMemo} from 'react';
import _ from 'lodash';
import { Tag } from 'antd';
import { IdIndex } from 'shared/interfaces/Id';
import { DeploymentUnitOutlined, LoadingOutlined } from '@ant-design/icons';

import './GroupTag.scss'

export interface GroupTagProps extends Omit<React.ComponentProps<typeof Tag>, 'onClose' | 'onClick' | 'id'> {
    onClose: (id: IdIndex) => Promise<unknown>
    onClick: (id: IdIndex) => void;
    id: IdIndex
}
export default function GroupTag({onClick, className, onClose, id, ...rest}: GroupTagProps) {
    const [loading, setLoading] = useState(false);
    return (
        <Tag
            {...rest}
            className={`group-tag ${className}`}
            onClose={() => {
                setLoading(true);
                onClose(id).catch(_.noop).then(() => setLoading(false));
            }}
            onClick={ () => onClick(id) }
            icon={loading ? <LoadingOutlined /> : <DeploymentUnitOutlined />}
            closable={true}
        />
    ) 
}
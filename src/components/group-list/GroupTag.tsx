import React, { useState, useRef, useCallback, useMemo } from 'react';
import _ from 'lodash';
import { Tag, Typography } from 'antd';
import { IdIndex } from 'shared/interfaces/Id';
import { CloseOutlined, DeploymentUnitOutlined, LoadingOutlined } from '@ant-design/icons';

import './GroupTag.scss'
import { openConfirmPromise } from 'utils/modals';

const { Text } = Typography;
export interface GroupTagProps extends Omit<React.ComponentProps<typeof Tag>, 'onClose' | 'onClick' | 'id'> {
    onClose?: (id: IdIndex) => Promise<unknown>
    onClick: (id: IdIndex) => void;
    id: IdIndex
}
export default function GroupTag({ onClick, className, onClose, children, id, ...rest }: GroupTagProps) {
    const [loading, setLoading] = useState(false);

    let secondaryAction = <span className="pl-1"></span>;
    if(onClose && !loading) {
        secondaryAction = <CloseOutlined className="ml-2" onClick={(e) => {
                e.stopPropagation();
                setLoading(true);
                openConfirmPromise({
                    content: (
                        <span>
                            <span>
                                Are you sure you want to remove the group <Text strong>{children}?</Text>
                            </span>
                            <div>
                                <Text type="danger">
                                    All of the submissons and evaluations of exercises will be undone!
                                </Text>
                            </div>
                        </span>
                    ),
                    onOk: () => id ? onClose(id) : Promise.resolve()
                }).catch(_.noop).then(()=> setLoading(false));
            }} />
    }

    return (
        <Tag
            {...rest}
            className={`group-tag ${className}`}
            onClick={() => onClick(id)}
            icon={loading ? <LoadingOutlined /> : <DeploymentUnitOutlined />}
        >
         <div className="inline-flex">
             {children} { secondaryAction }
          </div>   
        </Tag>
    )
}
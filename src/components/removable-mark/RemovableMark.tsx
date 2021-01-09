import _ from 'lodash';
import { CloseOutlined, LoadingOutlined } from '@ant-design/icons';
import { getMarkClass } from 'components/mark-input/mark-helpers';
import MarkView from 'components/mark-input/MarkView';
import React, {useState, useEffect, useRef, useCallback, useMemo, HTMLAttributes} from 'react';
import { assignMark } from 'shared/endpoints';
import { IdIndex } from 'shared/interfaces/Id';
import { useLoadingRequest } from 'utils/hooks';
import { openConfirmPromise } from 'utils/modals';

import './RemovableMark.scss'

export interface RemovableMarkProps extends HTMLAttributes<HTMLDivElement> {
    mark?: IdIndex,
    onRemove: () => void,
    solutionId: IdIndex
};

export default function RemovableMark({mark, onRemove, solutionId="", className="", ...props}: RemovableMarkProps) {
    
    const [loading, setLoading] = useState(false);

    const removeMark = () => {
        if(solutionId) {
            setLoading(true);
            assignMark(solutionId, null, () => {
                setLoading(false);
                onRemove();
            });
        }
    }

    return (
        <div {...props}
            onClick={() => { 
                openConfirmPromise({onOk: removeMark, content: "Are you sure you want to remove the assigned mark?"}).catch(_.noop)
            }}
            className={ `removable-mark cursor-pointer ${className}` } >
            <MarkView 
                mark={loading ? <LoadingOutlined className="center" />: mark} 
                iconClass={loading ? getMarkClass(9): undefined} 
                containerClass="normal"/>
            <MarkView 
                iconClass={loading ? getMarkClass(9): getMarkClass(1)} 
                mark={loading ? <LoadingOutlined className="center" /> : <CloseOutlined className="center"/>} 
                containerClass="hovered"/>
        </div>
    )
}
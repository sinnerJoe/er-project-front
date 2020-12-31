import { Skeleton, Space } from 'antd';
import React, {useState, useEffect, useRef, useCallback, useMemo} from 'react';

export interface PickerListSkeletonProps {
    entryCount?: number
};

const BASE_WIDTH = 50;

const BASE_DESCRIPTION_WIDTH = 65;

function PickerListSkeleton({entryCount = 6}: PickerListSkeletonProps) {
   
    return (
        <div className="modal-picker">

        {Array.from({length: entryCount}).map((v, k) => (
            <div className="list-entry pl-2 pr-2 pt-2 pb-2" key={k}>
                <div className="title" style={{width: `${BASE_WIDTH + Math.random()*25}%`}}>
                    <Skeleton.Input className="full-width" size="small" active={true} />
                </div>
                <div className="description mb-2 mt-2"
                     style={{width: `${BASE_DESCRIPTION_WIDTH + Math.random()*35}%`}}>
                    <Skeleton.Input className="full-width" size="small" active={true} />
                </div>
            </div>
        ))}
        </div>
    )
}

export default React.memo(PickerListSkeleton);
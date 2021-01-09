import { Spin } from 'antd';
import React, {useState, useEffect, useRef, useCallback, useMemo} from 'react';
import './FullScreenLoader.scss';
export interface FullScreenCoverProps {
   tip?: string 
};

export default function FullScreenLoader({tip}: FullScreenCoverProps) {
    if(!tip) {
        return null;
    }
    return (
        <div className="full-screen-cover">
                <Spin size="large" className="full-screen-loader-content" tip={tip} spinning={!!tip}>
                <div className="full-screen-loader-content">

                </div>
                </Spin> 
        </div>
    )
}
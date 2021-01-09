import { Image } from 'antd';
import React, {useState, useEffect, useRef, useCallback, useMemo, HTMLAttributes} from 'react';
import { IMG_FALLBACK } from 'shared/constants';

import './PreviewImage.scss';

export interface PreviewImageProps extends HTMLAttributes<HTMLDivElement> {
    heightPercent?: number,
    poster?: string
};

function PreviewImage({heightPercent=80, poster, ...rest}: PreviewImageProps) {
    return (
        <div 
            {...rest} 
            className='preview-container preview-img-component' 
            style={{paddingBottom: `${heightPercent}%`}}>
            <Image src={poster} fallback={IMG_FALLBACK} className="cursor-pointer full-width preview-image" />
        </div>
    )
}

export default React.memo(PreviewImage);
import { Col, Image, Row, Tooltip } from 'antd';
import PreviewImage from 'components/preview-image/PreviewImage';
import React, {useState, useEffect, useRef, useCallback, useMemo} from 'react';
import './ThumbnailList.scss';
export interface ThumbnailListProps {
    thumbnails: {image: string, tooltipContent: React.ReactNode}[]
};

export default function ThumbnailList(props: ThumbnailListProps) {
   
    const content = (
        props.thumbnails.map(({image, tooltipContent}, index) => (
            <Col span={4} lg={3} xxl={2} key={index}>
                <Tooltip title={tooltipContent}>
                    <PreviewImage heightPercent={100} poster={image} key={index} />
                </Tooltip>
            </Col>
        ))
    )

    return (
        <Image.PreviewGroup>
            <Row className="full-width">
                {content}
            </Row>
        </Image.PreviewGroup>
    )
}
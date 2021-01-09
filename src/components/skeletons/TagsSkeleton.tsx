import { Col, Row, Skeleton } from 'antd';
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';

export interface TagsSkeletonProps extends React.ComponentProps<typeof Row> {
    count?: number
};

export default function TagsSkeleton({ count = 5, className = "", ...props }: TagsSkeletonProps) {
    return (
        <Row className={`full-width ${className}`} gutter={[10, 10]} {...props}>
            {new Array(count).fill(<Col><Skeleton.Input active style={{ width: '60px' }} /></Col>)}
        </Row>
    )
}
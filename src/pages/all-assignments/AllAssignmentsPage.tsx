import { Empty, Skeleton, Space } from 'antd';
import AssignmentReceipt from 'components/assignment-receipt/AssignmentReceipt';
import FloatingPlus from 'components/floating-plus/FloatingPlus';
import NoData from 'components/no-data/NoData';
import PageContent from 'components/page-content/PageContent';
import paths from 'paths';
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { fetchAllAssignments } from 'shared/endpoints';
import { useLoadingRequest } from 'utils/hooks';

export default function AllAssignmentsPage(props: {}) {

    const [request, data, loading] = useLoadingRequest(fetchAllAssignments, []);

    useEffect(() => {
        request();
    }, []);

    const floatingButton = <FloatingPlus link={paths.CREATE_ASSIGNMENT} />;
    let content = null;

    if (!loading && data.length > 0) {
        content = (
            <React.Fragment>
                { data.map(assignment => <AssignmentReceipt onChange={request} {...assignment} key={assignment.id} />)}
            </React.Fragment>
        )
    } else if (loading) {
        content = (
            <React.Fragment>
                {new Array(5).fill(<Skeleton active />)}
            </React.Fragment>
        )
    } else {
        return <div>
            <NoData description="No assignments created yet." />
            {floatingButton}
            </div>
    }


    return (
        <PageContent spaceTop>
            <Space direction="vertical" className="full-width" size="large">
                {content}
            </Space>
            {floatingButton}
        </PageContent>
    )

}
import { Skeleton, Space } from 'antd';
import FloatingPlus from 'components/floating-plus/FloatingPlus';
import NoData from 'components/no-data/NoData';
import PageContent from 'components/page-content/PageContent';
import PlanDisplay from 'components/plan-editor/PlanDisplay';
import SearchBox from 'components/searchbox/SearchBox';
import paths from 'paths';
import React, {useState, useRef, useCallback, useMemo, useEffect} from 'react';
import { fetchAllPlans } from 'shared/endpoints';
import { normalizePlanDates } from 'utils/datetime';
import { useLoadingRequest } from 'utils/hooks';

export interface PlanListPageProps {
    
};

export default function PlanListPage(props: PlanListPageProps) {
    const [request, data, loading, err] = useLoadingRequest(fetchAllPlans, [], {initialLoading: true});

    useEffect(() => {
        request();
    }, []);


    let content = null;

    useMemo(() => {
        data.forEach(normalizePlanDates);
    }, [data]);

    if(!loading && !data.length) {
        return (
            <div>
                <NoData description="There are no educational plans found."/>
                <FloatingPlus link={paths.CREATE_PLAN} />
            </div>
        )
    }

    if(!loading) {
        content = data.map((plan) => 
            <PlanDisplay onDelete={request} data={plan} key={plan?.id || undefined} /> 
        );
    } else {
        content = new Array(5).fill(<Skeleton active />)
    }

    return (
        <PageContent spaceTop>
            <Space direction="vertical" size="large" className="full-width">
                {content}
            </Space>
            <FloatingPlus link={paths.CREATE_PLAN} />
        </PageContent>

    )
}
import { Space } from 'antd';
import PageContent from 'components/page-content/PageContent';
import PlanDisplay from 'components/plan-editor/PlanDisplay';
import SearchBox from 'components/searchbox/SearchBox';
import React, {useState, useRef, useCallback, useMemo, useEffect} from 'react';
import { fetchAllPlans } from 'shared/endpoints';
import { momentifyFields } from 'utils/datetime';
import { useLoadingRequest } from 'utils/hooks';

export interface PlanListPageProps {
    
};

export default function PlanListPage(props: PlanListPageProps) {
    const [request, data, loading, err] = useLoadingRequest(fetchAllPlans, [], true);

    useEffect(() => {
        request();
    }, []);


    let content = null;

    useMemo(() => momentifyFields(data), [data]);

    if(!loading) {
        content = data.map((plan) => 
            <PlanDisplay onDelete={request} data={plan} key={plan?.id || undefined} /> 
        );
    }

    return (
        <PageContent>
            <SearchBox onChange={ () => null } />
            <Space direction="vertical" size="large" className="full-width">
                {content}
            </Space>
        </PageContent>

    )
}
import { Space } from 'antd';
import PageContent from 'components/page-content/PageContent';
import PlanDisplay from 'components/plan-editor/PlanDisplay';
import SearchBox from 'components/searchbox/SearchBox';
import UserSummaryTable from 'components/user-summary-table/UserSummaryTable';
import YearAxis from 'components/year-axis/YearAxis';
import React, {useState, useRef, useCallback, useMemo, useEffect} from 'react';
import { fetchAllPlans, fetchAllUsers } from 'shared/endpoints';
import { getCurrentYear, momentifyFields } from 'utils/datetime';
import { useLoadingRequest, useQueryStringMaster } from 'utils/hooks';

export interface UsersPageProps {
    
};

export default function UsersPage(props: UsersPageProps) {
    const [request, users, loading, err] = useLoadingRequest(fetchAllUsers, [], {initialLoading: true, resetValueOnLoading: false});

    const {year = getCurrentYear()} = useQueryStringMaster();

    useEffect(() => {
        request(year);
    }, [year]);


    let content = null;

    if(!loading) {
        content = <UserSummaryTable onChange={() => request(year)} users={users} /> 
    }

    return (
        <PageContent>
            <YearAxis />
            <Space direction="vertical" size="large" className="full-width">
                {content}
            </Space>
        </PageContent>

    )
}
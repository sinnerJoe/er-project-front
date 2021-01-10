import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { Button, Empty, Skeleton, Space } from 'antd'
import { BrowserRouter as Router, Route, NavLink, useHistory } from 'react-router-dom'
import PageContent from 'components/page-content/PageContent'
import ExtendedAssignment from 'components/extended-assignment/ExtendedAssignment'
import YearAxis from 'components/year-axis/YearAxis'
import { useEffectOnce, useLoadingRequest, useQueryStringMaster } from 'utils/hooks'
import { getPlannedAssignmentsWithAnswers, getShallowGroups, getSubmissionGroups } from 'shared/endpoints'
import GroupList from 'components/group-list/GroupList'
import { getCurrentYear } from 'utils/datetime'
import { IdIndex } from 'shared/interfaces/Id'
import TagsSkeleton from 'components/skeletons/TagsSkeleton'


export default function ProfessorAssignmentsPage(props: any) {
  const [fetchGroups, groups, loadingGroups] = useLoadingRequest(getSubmissionGroups, [], {initialLoading: true, resetValueOnLoading: false});
  const [fetch, assignments, loading] = useLoadingRequest(getPlannedAssignmentsWithAnswers, [], {initialLoading: true, resetValueOnLoading: false});
  const queryMaster = useQueryStringMaster();
  const history = useHistory();
  const { year = getCurrentYear(), group } = queryMaster;

  const selectedGroupName = useMemo(() => {
    if (groups.length == 0) {
      return '';
    }

    if (group && groups.find(g => g.name === group)) {
      return group;
    }

    return groups[0].name;
  }, [groups, group]);

  const selectedGroupId = useMemo(() => {
    if (selectedGroupName && !loadingGroups) {
      return groups.find(g => g.name == selectedGroupName)?.id || '';
    }
    return '';
  }, [selectedGroupName, loadingGroups])

  useEffect(() => {
    fetchGroups(year);
  }, [year]);

  const lastFetchedGroupId = useRef<IdIndex>('');

  useEffect(() => {
    if (selectedGroupId && selectedGroupId !== lastFetchedGroupId.current) {
      lastFetchedGroupId.current = selectedGroupId
      fetch(selectedGroupId);
    }
  }, [selectedGroupId]);

  let content = <div className="flex-center">No groups with assigned plans for this year, or maybe you are not coordinating any of them.</div>;
  if (groups.length || loadingGroups) {
    content = (<React.Fragment> 
      {!loadingGroups ? (
      <GroupList
        className="flex-center"
        groups={groups}
        badgeTitleGenerator={(count) => count ? `${count} submitted solutions pending evaluation` : undefined}
        badgeSelector={(group) => group.uncheckedSubmissionCount || null}
        onSelect={(id) => {
          fetch(id);
          queryMaster.group = groups.find(g => g.id == id)?.name || '';
          if (selectedGroupName != queryMaster.group) {
            history.push(queryMaster.fullpath);
          } else {
            history.replace(queryMaster.fullpath);
          }
        }}
        selectedGroupId={selectedGroupId}
      />): <TagsSkeleton justify="center" />}
      <Space direction="vertical" size="large" className="full-width mt-5">
        { !loading && assignments.map((assignment) => (
            <ExtendedAssignment
              assignment={assignment}
              key={assignment.id}
              groupId={selectedGroupId}
              onRefreshData={() => { fetchGroups(year) }}
            />
          ))
        }
        { !loading && !assignments.length &&
          <Empty description="The is no plan defined for this group" />
        }
        { loading && new Array(4).fill(<Skeleton active/>)}
      </Space>
    </React.Fragment>);
  }


  return (
    <PageContent minWidth={1086}>
      <YearAxis />
      <div className="mt-10">
        {content}
      </div>
    </PageContent>
  )
}
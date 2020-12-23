import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { Button, Space } from 'antd'
import { BrowserRouter as Router, Route, NavLink, useHistory } from 'react-router-dom'
import UploadedDiagram from 'components/uploaded-diagram/UploadedDiagram'
import PageContent from 'components/page-content/PageContent'
import { Solution } from 'interfaces/Solution'
import { getSolutions } from 'actions/diagram'
import moment from 'moment'
import SearchBox from 'components/searchbox/SearchBox'
import { PlusSquareFilled } from '@ant-design/icons'
import paths from 'paths'
import { AssignmentModel } from 'interfaces/Assignment'
import { getAssignments } from 'actions/assignments'
import Assignment from 'components/assignment/Assignment'
import ExtendedAssignment from 'components/extended-assignment/ExtendedAssignment'
import YearAxis from 'components/year-axis/YearAxis'
import { useEffectOnce, useLoadingRequest, useQueryStringMaster } from 'utils/hooks'
import { getPlannedAssignmentsWithAnswers, getShallowGroups, getSubmissionGroups } from 'shared/endpoints'
import GroupList from 'components/group-list/GroupList'
import { getCurrentYear } from 'utils/datetime'
import { IdIndex } from 'shared/interfaces/Id'


export default function ProfessorAssignmentsPage(props: any) {
  const [fetchGroups, groups, loadingGroups, errGroups] = useLoadingRequest(getSubmissionGroups, [], {initialLoading: true, resetValueOnLoading: false});
  const [fetch, assignments, loading, err] = useLoadingRequest(getPlannedAssignmentsWithAnswers, [], {initialLoading: true, resetValueOnLoading: false});
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

  let content = <div className="flex-center">No groups with plans assignmed for this year</div>;
  if (groups.length || loadingGroups) {
    content = (<React.Fragment> 
      {!loadingGroups && (
      <GroupList
        className="flex-center mt-10 mb-5"
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
      />)}
      <Space direction="vertical" size="large" className="full-width">
        {
          !loading && assignments.map((assignment) => (
            <ExtendedAssignment
              assignment={assignment}
              key={assignment.id}
              groupId={selectedGroupId}
              onRefreshData={() => { fetchGroups(year) }}
            />
          ))
        }
      </Space>
    </React.Fragment>);
  }


  return (
    <PageContent>
      <YearAxis />
      {content}
    </PageContent>
  )
}
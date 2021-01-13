import React, { useEffect, useState, useCallback } from 'react'
import { Button, Skeleton, Space } from 'antd'
import PageContent from 'components/page-content/PageContent'
import SearchBox from 'components/searchbox/SearchBox'
import Assignment from 'components/assignment/Assignment'
import { useLoadingRequest } from 'utils/hooks'
import { getPlannedAssignments } from 'shared/endpoints'
import NoData from 'components/no-data/NoData'

export default function MyAssignmentsPage(props: any) {
  const [request, assignments, loading] = useLoadingRequest(getPlannedAssignments, []);
  useEffect(() => {
    request()
  }, []);

  const submitSolution = () => { request(); } 

  if(!loading && !assignments.length) {
    return (
      <NoData description="There are no assignments for you to complete yet." />
    )
  }

  return (
    <PageContent spaceTop>
      <Space direction="vertical" size="large" className="full-width">
        { !loading && assignments.map((assignment) => (
            <Assignment
              onSubmit={submitSolution} 
              {...assignment}
              />
          ))
        }
        { loading && new Array(5).fill(<Skeleton active />)}
      </Space>
    </PageContent>
  )
}
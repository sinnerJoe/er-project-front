import React, { useEffect, useState, useCallback } from 'react'
import { Button, Skeleton, Space } from 'antd'
import PageContent from 'components/page-content/PageContent'
import SearchBox from 'components/searchbox/SearchBox'
import Assignment from 'components/assignment/Assignment'
import { useLoadingRequest } from 'utils/hooks'
import { getPlannedAssignments } from 'shared/endpoints'

export default function MyAssignmentsPage(props: any) {
  const [request, assignments, loading] = useLoadingRequest(getPlannedAssignments, []);
  console.log(assignments)
  useEffect(() => {
    request()
  }, []);

  const submitSolution = () => { request(); } 

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
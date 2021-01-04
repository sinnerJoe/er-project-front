import React, { useEffect, useState, useCallback } from 'react'
import { Button, Skeleton, Space } from 'antd'
import _ from 'lodash';
import UploadedDiagram from 'components/uploaded-diagram/UploadedDiagram'
import PageContent from 'components/page-content/PageContent'
import { parseSolution, Solution, SolutionTab } from 'interfaces/Solution'
import paths from 'paths'
import { getOwnSolutions } from 'shared/endpoints'
import FloatingPlus from 'components/floating-plus/FloatingPlus';
import NoData from 'components/no-data/NoData';

export default function MyDiagramsPage(props: any) {
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchSolutions = useCallback(() => {
    setLoading(true);
    getOwnSolutions()
      .then((response) => response.data.data.map(parseSolution))
      .then(setSolutions as any).catch(_.noop)
      .then(() => setLoading(false));
  }, []);
  useEffect(fetchSolutions, [...Object.values(props)])

  if (!loading && !solutions.length) {
    return (
      <div>
        <NoData description="You currently have no solutions" />
        <FloatingPlus
          link={paths.NEW_DIAGRAM}
        />
      </div>
    )
  }

  return (
    <PageContent spaceTop>
      <Space direction="vertical" size="large" className="full-width">
        {!loading && solutions.map((solution) => (
          <UploadedDiagram
            userId={solution.userId}
            reviewedAt={solution.reviewedAt}
            reviewer={solution.reviewer}
            mark={solution.mark}
            title={solution.title || ''}
            onDelete={fetchSolutions}
            tabs={solution.tabs || []}
            id={solution.id || 0}
            assignment={solution.assignment}
            updatedOn={solution.updatedOn} />
        ))
        }
        {loading && Array.from({ length: 5 }).map((v, k) => <Skeleton />)}
      </Space>
      <FloatingPlus
        link={paths.NEW_DIAGRAM}
      />
    </PageContent>
  )
}
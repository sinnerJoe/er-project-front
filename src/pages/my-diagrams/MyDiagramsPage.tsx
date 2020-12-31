import React, { useEffect, useState, useCallback } from 'react'
import { Button, Skeleton, Space } from 'antd'
import _ from 'lodash';
import { BrowserRouter as Router, Route, NavLink, useHistory } from 'react-router-dom'
import UploadedDiagram from 'components/uploaded-diagram/UploadedDiagram'
import PageContent from 'components/page-content/PageContent'
import { parseSolution, Solution, SolutionTab } from 'interfaces/Solution'
import moment from 'moment'
import SearchBox from 'components/searchbox/SearchBox'
import { PlusSquareFilled } from '@ant-design/icons'
import paths from 'paths'
import CreateSolutionModal from 'components/modals/create-solution-modal/CreateSolutionModal'
import { useModal } from 'components/modals/modal-hooks'
import { getOwnSolutions } from 'shared/endpoints'

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
  const [modal, openModal] = useModal(CreateSolutionModal, {});
  return (
    <PageContent>
      {modal}
      <SearchBox 
        onChange={()=>{}} 
        onButtonClick={openModal} 
        buttonLabel="Create New Solution" />
      <Space direction="vertical" size="large" className="full-width">
        { !loading && solutions.map((solution) => (
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
        { loading && Array.from({length: 5}).map((v, k) => <Skeleton />)
        }
      </Space>
    </PageContent>
  )
}
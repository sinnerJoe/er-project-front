import React, { useEffect, useState, useCallback } from 'react'
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

export default function MyDiagramsPage(props: any) {
  const [solutions, setSolutions] = useState<Partial<Solution>[]>([]);
  const updateSolutions = useCallback(() => { getSolutions().then(setSolutions as any) }, []);
  useEffect(updateSolutions, [...Object.values(props)])
  console.log(solutions)
  const history = useHistory();
  return (
    <PageContent>
      <SearchBox 
        onChange={()=>{}} 
        onButtonClick={() => { history.push(paths.NEW_DIAGRAM) }} 
        buttonLabel="Create New Solution" />
      <Space direction="vertical" size="large" className="full-width">
        {
          solutions.map((solution) => (
            <UploadedDiagram 
              onDelete={updateSolutions} 
              tabs={solution.tabs} 
              id={solution.id} 
              assignments={solution.assignments} 
              updatedOn={solution.updatedOn} />
          ))
        }
        {/* <UploadedDiagram />
    <UploadedDiagram />
    <UploadedDiagram /> */}
      </Space>
    </PageContent>
  )
}
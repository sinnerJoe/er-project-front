import React from 'react'
import Diagram from 'components/diagram'
import { diagramImage, testInput } from 'constant/test-consts';
import { createSolution } from 'actions/diagram';
import { useHistory } from 'react-router-dom';
import paths from 'paths';
export default function CreateDiagram(props: any) {
  const history = useHistory()
  return (
    <Diagram defaultSetup={[]}
      onSave={(xmlData) => {
        const tabs = xmlData.map(({ title, poster = diagramImage, schema }, index) => ({
          id: index,
          diagramXml: schema,
          title,
          poster,
        }));
        createSolution(tabs).then(() => {
          history.push(paths.MY_DIAGRAM)
        })
      }} />
  )
}
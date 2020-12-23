import React from 'react'
import Diagram from 'components/diagram'
import { diagramImage, testInput } from 'constant/test-consts';
import { createSolution } from 'shared/endpoints';
import { useHistory, useLocation } from 'react-router-dom';
import paths from 'paths';
export default function CreateDiagram(props: any) {
  const history = useHistory();
  const location = useLocation<{title: string}>();
  console.log(location.state);

  return (
    <Diagram defaultSetup={[]}
      onSave={(xmlData) => {
        const tabs = xmlData.map(({ title, type, poster = diagramImage, schema }) => ({
          content: schema,
          name: title,
          image: poster,
          type
        }));
        createSolution({diagrams: tabs, title: location.state.title}).then(() => {
          history.push(paths.MY_DIAGRAM)
        })
      }} />
  )
}
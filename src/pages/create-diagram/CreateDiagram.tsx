import React from 'react'
import Diagram from 'components/diagram'
import {testInput} from 'constant/test-consts';
export default function CreateDiagram(props:any) {
    return (
            <Diagram defaultSetup={[
              {diagramXml: testInput, title: "test diagram"},
              {diagramXml: testInput, title: "test diagram"}  
            ]} />
    )
}
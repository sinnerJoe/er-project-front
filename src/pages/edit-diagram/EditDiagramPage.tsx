import React, { useEffect, useState } from 'react'
import { useRouteMatch, useParams, useLocation, useHistory } from 'react-router-dom'
import {getSolution, saveSolution} from 'actions/diagram';
import { Solution, SolutionTab } from 'interfaces/Solution';
import Diagram from 'components/diagram';
import paths from 'paths';
import { diagramImage } from 'constant/test-consts';
type Params = {
    solutionId: number
}

export default function EditDiagramPage(props:any) {
    // const {solutionId} = useParams();
    const location = useLocation<{solId: string}>();
    const history = useHistory();
    const [solution, setSolution] = useState<Solution>();
    const solutionId = new URLSearchParams(location.search).get('solId')
    useEffect(() => {
        getSolution(solutionId).then((data: any) => setSolution(data))
    }, [solutionId]);

    if(!solution) {
        return null;
    }

    return (
        <Diagram 
            defaultSetup={solution.tabs} 
            onSave={(xmlData) => {
                if(solution) {
                    saveSolution({
                        ...(solution as any), 
                        tabs: xmlData.map(({title, poster=diagramImage, schema}, index) => ({
                            id: index,
                            diagramXml: schema, 
                            title,
                            poster,
                        })) as any,
                    }).then(() => {
                        history.push(paths.MY_DIAGRAM);
                    })
                    // .then(() => getSolution(solutionId))
                    // .then(setSolution)
                }
            }}
        />
    )
    
}
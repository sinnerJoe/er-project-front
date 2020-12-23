import React, { useEffect, useState } from 'react'
import { useRouteMatch, useParams, useLocation, useHistory } from 'react-router-dom'
import {fetchSolution, getImageBase64, updateSolution} from 'shared/endpoints';
import { parseSolution, Solution, SolutionTab } from 'interfaces/Solution';
import Diagram from 'components/diagram';
import paths from 'paths';
import { diagramImage } from 'constant/test-consts';
import { RequestErrorStatus } from 'shared/interfaces/ResponseType';

export default function EditDiagramPage(props:any) {
    // const {solutionId} = useParams();
    const location = useLocation<{solId: string}>();
    const history = useHistory();
    const [solution, setSolution] = useState<Partial<Solution>>();
    const solutionId = new URLSearchParams(location.search).get('solId')
    useEffect(() => {
        fetchSolution(Number(solutionId))
        .then((response) => setSolution(parseSolution(response.data.data)))
        .catch(({response}) => {
            if(response.data.status === RequestErrorStatus.NotFound) {
                history.replace(paths.NOT_FOUND);
            }
        })
    }, [solutionId]);

    if(!solution) {
        return null;
    }

    console.log(solution);

    return (
        <Diagram 
            defaultSetup={solution.tabs} 
            onSave={async (xmlData) => {
                console.log("DATA", xmlData);
                if(solution) {
                    const diagramPromises = xmlData.map(async ({title, poster, schema, type}: any, index: number) => {
                        let image = poster;

                        if(!poster) {
                            const oldImage = (solution as any)?.tabs?.[index]?.poster;
                            if(oldImage) {
                                image = await getImageBase64(oldImage);
                            } else {
                                image = diagramImage;
                            }
                        }

                        return {
                            content: schema, 
                            name: title,
                            image,
                            type
                        };
                    });

                    const diagrams = await Promise.all(diagramPromises)
                    
                    updateSolution(Number(solutionId), diagrams).then(() => {
                        history.push(paths.MY_DIAGRAM);
                    })
                }
            }}
        />
    )
    
}
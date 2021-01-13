import React, { useEffect, useState } from 'react'
import { useRouteMatch, useParams, useLocation, useHistory } from 'react-router-dom'
import {fetchSolution, getImageBase64, updateSolution} from 'shared/endpoints';
import { parseSolution, Solution, SolutionTab } from 'interfaces/Solution';
import Diagram from 'components/diagram';
import paths from 'paths';
import { useBlockHistory, useQueryStringMaster } from 'utils/hooks';
import { useSelector } from 'react-redux';
import { StoreData } from 'store';
import FullScreenLoader from 'components/full-screen-loader/FullScreenLoader';
import { IMG_FALLBACK, SolutionLoadingMessage } from 'shared/constants';
import { redirectNotFound } from 'shared/error-handlers';

const PNG_BASE64_HEADER = 'data:image/png;base64,';
export default function EditDiagramPage({viewOnly = false}:{viewOnly?: boolean}) {
    const history = useHistory();
    const [solution, setSolution] = useState<Partial<Solution>>();
    const solutionId = useQueryStringMaster().solId;
    const unblockHistory = useBlockHistory();
    useEffect(() => {
        fetchSolution(Number(solutionId))
        .then((response) => setSolution(parseSolution(response.data.data)))
        .then(() => setMessage(undefined))
        .catch(() => {
            unblockHistory();
            redirectNotFound.trigger();
        })
    }, [solutionId]);

    const userId = useSelector<StoreData>((state) => state.user.userId)

    const viewMode = viewOnly || !!solution?.reviewer || (solution?.userId != userId);

    const [message, setMessage] = useState<SolutionLoadingMessage | undefined>(SolutionLoadingMessage.loadingMessage)


    return (
        <React.Fragment>
        <FullScreenLoader tip={message} />
        {solution && <Diagram 
            defaultSetup={solution.tabs} 
            viewMode={viewMode}
            onSave={async (xmlData) => {
                if(solution) {
                    const diagramPromises = xmlData.map(async ({title, poster, schema, type}: any, index: number) => {
                        setMessage(SolutionLoadingMessage.sendingMessage);
                        let image = poster;

                        if(!poster) {
                            const oldImage = (solution as any)?.tabs?.[index]?.poster;
                            if(oldImage) {
                                image = await getImageBase64(oldImage)
                                        .then(img => PNG_BASE64_HEADER+img)
                                        .catch(() => IMG_FALLBACK);
                            }
                        }

                        return {
                            content: schema, 
                            name: title,
                            image,
                            type
                        };
                    });
                    try {

                        const diagrams = await Promise.all(diagramPromises)
                        
                        await updateSolution(Number(solutionId), diagrams)
                        unblockHistory();
                        history.push(paths.MY_DIAGRAM);
                    } catch(error) {
                        setMessage(undefined);
                    }
                }
            }}
            />
        }
        </React.Fragment>
    )
    
}
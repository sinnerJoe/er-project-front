import React, { useEffect, useMemo, useRef, useState } from 'react'
import Diagram from 'components/diagram'
import { diagramImage, testInput } from 'constant/test-consts';
import { createSolution } from 'shared/endpoints';
import { useHistory, useLocation } from 'react-router-dom';
import paths from 'paths';
import ModalController from 'app/modal-manager/ModalController';
import { ModalType } from 'store/slices/modals';
import FullScreenLoader from 'components/full-screen-loader/FullScreenLoader';
import { SolutionLoadingMessage } from 'shared/constants';
import { useBlockHistory } from 'utils/hooks';
export default function CreateDiagram(props: any) {
  const history = useHistory();
  const location = useLocation<{title: string}>();

  const [message, setMessage] = useState<string | undefined>();

  const unblockHistory = useBlockHistory();

  return (
    <React.Fragment>
      <FullScreenLoader tip={message} />
    <Diagram defaultSetup={[]}
      onSave={(xmlData) => {
        const requestCreateSolution = (title: string) =>  {
          console.log("USED TITLE", title)
          setMessage(SolutionLoadingMessage.sendingMessage);
          const tabs = xmlData.map(({ title, type, poster = diagramImage, schema }) => ({
            content: schema,
            name: title,
            image: poster,
            type
          }));
          createSolution({diagrams: tabs, title}, () => setMessage(undefined)).then(() => {
            unblockHistory();
            history.push(paths.MY_DIAGRAM)
          })
        }

        const title = location?.state?.title;
        
        if(title) {
          requestCreateSolution(title)
        } else {
          ModalController.open(ModalType.CreateSolution, {onOk: requestCreateSolution})
        }
        
      }} />
      </React.Fragment>
  )
}
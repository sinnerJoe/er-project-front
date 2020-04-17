import {Stage, Graphics} from '@inlet/react-pixi';
import { Point, utils } from 'pixi.js'
import React, { useState, useRef, useReducer, useContext } from 'react';
import Entity from './Entity/index'
import Movable from './Functional/Movable';
import IDiagramElement from '../../shared/interfaces/IDiagramElement'
import {CursorDispatch, CursorType, withCursorStyle} from '../CursorManager';
import {DiagramState, ActionContext, Action, ChangeDispatcher} from './actions'

const ids = []

const defaultState: DiagramState = 
{
    lines:[],
    elements: {

    [utils.uid()]: {
            width: 100,
            height: 100,
            selected: false,
            position: new Point(200, 50),
            text: "Test text more text bitch such my"
        },
    [utils.uid()]: {
            width: 100,
            height: 100,
            selected: false,
            position: new Point(200, 50),
            text: "Test text more text bitch such my"
        },
    }
}
    
function useForceUpdate() {
    const [last, rerender] = useState(true);
    return () => { rerender(!last); }
}

const InteractiveDiagram = (props: any = {diagramData: defaultState} ) => {

    const forceUpdate = useForceUpdate();
    const diagramData = defaultState;
    const changeCursor = useContext(CursorDispatch)
    const [entities, setEntities] = useState<DiagramState>(diagramData);
        // console.log(entities)
    const createOnSelect = (id:number) => () => {
        Object.keys(entities.elements).forEach((key: unknown) => {
            // console.log(id, key);
            entities.elements[key as number].selected = key as number === id;
        })
        entities.elements[id].selected = true;
        setEntities({...entities});
        forceUpdate();
    }
    const changeDispatcher = useRef(new ChangeDispatcher(diagramData))

    const dispatchAction = (action: Action) => {
        changeDispatcher.current.applyAction(action);
        // setEntities({...entities});
        forceUpdate();
    }

    return (
        <Stage width={1280}
        height={720}
        options={
            {
                antialias: true,
                backgroundColor: 0xFFFFFF,
            }
        }>
            
            <CursorDispatch.Provider value={changeCursor}>
                <ActionContext.Provider value={dispatchAction}>
                {Object.keys(entities.elements).map((key: unknown) => 
                    <Entity {...entities.elements[key as number]} 
                            onSelect={createOnSelect(key as number)} 
                            id={key}
                            key={key as string} />
                )}
                </ActionContext.Provider>
            </CursorDispatch.Provider>
        </Stage>
    )
}

export default withCursorStyle(InteractiveDiagram);
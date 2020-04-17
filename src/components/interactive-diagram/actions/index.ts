import IDiagramElement from "../../../shared/interfaces/IDiagramElement";
import { Point } from "pixi.js";
import React from 'react'

export const ActionContext = React.createContext<(action: Action) => void>(() => {})

type Line = any;

export interface DiagramState {
  lines: {[id: number]:any},
  elements: { [id: number]: IDiagramElement }
}

export class ElementStore {
  state: DiagramState
  constructor(state: DiagramState) {
    this.state = state;
  }

  getLine(id: number) {
    return this.state.lines[id];
  }

  getElement(id: number){
    return this.state.elements[id];
  }

  // getEntity<T extends ElementType>(type: T, id: string): T extends ElementType.Line 
  //                                                      ? Line
  //                                                      : T extends ElementType.Element ? IDiagramElement
  //                                                      : never
  // {                               
  //   if(type === ElementType.Line) {
  //     return this.getLine(id);
  //   } 
  //   return this.getElement(id);
    
  // }

}

export enum ActionType {
  Move = 0,
  Resize,
};

export enum ElementType {
  Element = 0,
  Line
}

interface ActionPrototype {
  elementId: number,
  elementType: ElementType,
  type: ActionType,
  data: unknown
}

export interface MoveAction extends ActionPrototype{
  type: ActionType.Move;
  data: Point;
};

export interface ResizeAction extends ActionPrototype{
  type: ActionType.Resize;
  data: {width: number, height: number};
};

export type Action = (MoveAction | ResizeAction) 

export class ChangeDispatcher {
  
  store: ElementStore;

  constructor(state: DiagramState) {
    this.store = new ElementStore(state); 
  }

  applyAction(action: Action) {
    switch(action.type) {
      case ActionType.Move: {
        // console.log(action)
        const element = this.store.getElement(action.elementId);
        element.position.x = action.data.x;
        element.position.y = action.data.y;
        break;  
      }
      case ActionType.Resize: {
        // console.log("RESIZING")
        const element = this.store.getElement(action.elementId);
        element.width = action.data.width;
        element.height = action.data.height;
      }
      default: return;
    }
  }

  getStore() {
    return this.store;
  }

  get state() {
    return this.store.state
  }


}
import * as PIXI from 'pixi.js'; 
export default interface IDiagramElement {
  position: PIXI.Point,
  width: number,
  height: number,
  selected: boolean,
  // onSelect: () => void,
  // onDrag: () => void,
  // startDrag: () => void,
  // endDragging: () => void,
  [key:string]: any,
};

import { Stage, Text, Graphics, PixiComponent, useApp, Container,  } from '@inlet/react-pixi';

import { Point, Rectangle, interaction, utils } from 'pixi.js';
import React, { useState, useContext, useEffect, useMemo, memo, useCallback, useReducer, useRef } from 'react';
import IMovable from '../../../shared/interfaces/IMovable';
import IDiagramElement from '../../../shared/interfaces/IDiagramElement';
import { DrawableRectangle } from '../GraphicalElements/DrawableRectangle';
import { CursorDispatch, CursorType } from '../../CursorManager';
import { substractAbs } from '../utils';
import { ActionContext, ElementType, ActionType, ResizeAction } from '../actions';

const CONTAINER_PADDING = 20;
const DOT_WIDTH = 5;

function computeCoordinates(position: Point, width: number, height: number) {

  const halfPaddedWidth = (width + CONTAINER_PADDING) / 2;
  const halfPaddedHeight = (height + CONTAINER_PADDING) / 2;
  const left = position.x - halfPaddedWidth;
  const right = position.x + halfPaddedWidth;
  const bottom = position.y + halfPaddedHeight;
  const top = position.y - halfPaddedHeight;
  return {left, right, bottom, top};
}



function computePointPositions(position: Point, width: number, height: number): Point[] {
  const {left, right, bottom, top} = computeCoordinates(position, width, height);
  const smallRectanglePositions = [
    new Point(left, top),
    new Point(position.x, top),
    new Point(right, top),
    new Point(right, position.y),
    new Point(right, bottom),
    new Point(position.x, bottom),
    new Point(left, bottom),
    new Point(left, position.y),
  ]

  return smallRectanglePositions;
}


enum ResizeKind {
  None = 0,
  Vertical,
  Horizontal,
  Both
};

type ResizeEvent = (xCoefficient: number, yCoefficient:number) => void

interface NoResize {
    kind: ResizeKind.None;
} 
  
interface ResizingState {
    kind: Omit<ResizeKind, ResizeKind.None>;
    distance: Point;
    initialDistance: Point;
    initialWidth: number,
    initialHeight: number,
}

type ResizeState = NoResize | ResizingState;

type MoverEdgesProps = { 
  position: Point, 
  width: number, 
  height: number, 
  onResize: ResizeEvent,
  onResizeStop: ResizeEvent,
  onResizeStart: ResizeEvent,
};

const MoverEdges = (props: MoverEdgesProps ) => {
  
  const edgeThickness = 2
  const { position, width, height, onResize } = props;

  const [
    northWest,
    north,
    northEast,
    east,
    southEast,
    south,
    southWest,
    west,
  ] = computePointPositions(position, width, height);

  const app = useApp();

  const paddedWidth = east.x - west.x;
  const paddedHeight = south.y - north.y;
  const setCursorStyle = useContext(CursorDispatch);

  const unhover = () => setCursorStyle('inherit');
  const verticalResizeStyle = () => setCursorStyle('e-resize');
  const horizontalResizeStyle = () => setCursorStyle('s-resize');

  const edgeFill = { alpha: 1, color: 0 };

  const [resizeData, setResizeData] = useState<ResizeState>({ kind: ResizeKind.None})

  const startResize = useCallback( (resizeKind: Omit<ResizeKind, ResizeKind.None>) => 
    (event: interaction.InteractionEvent) => {
      if(resizeData.kind !== ResizeKind.None) {
        return;
      }
      const pointerLocation = event.data.getLocalPosition(app.stage)
      const initialDistance = substractAbs(position, pointerLocation)
      setResizeData({
        initialDistance,
        initialWidth: width,
        initialHeight: height,
        distance: initialDistance,
        kind: resizeKind
      });
  }, [app, position, resizeData]);
  

  

  const stopResize = useCallback(() => { unhover(); console.log("STOP RESIZE"); setResizeData({kind: ResizeKind.None})}, [])

  const reduceResize = (n: number) => 1 + (n - 1) / 1000;

  const pointerMoveResize = useCallback((event: interaction.InteractionEvent) => {
    // if(resizeData.kind !== ResizeKind.None) console.log(resizeData)
    // event.stopPropagation();
    switch(resizeData.kind) {
      case ResizeKind.Vertical: {
        const pointerLocation = event.data.getLocalPosition(app.stage);
        const currentDistance = substractAbs(position, pointerLocation);
        onResize(1, reduceResize(currentDistance.y / (resizeData as ResizingState).initialDistance.y / 100));
        break;
      }
      case ResizeKind.Horizontal: {  
        const pointerLocation = event.data.getLocalPosition(app.stage);
        const currentDistance = substractAbs(position, pointerLocation);
        onResize(reduceResize(currentDistance.x / (resizeData as ResizingState).initialDistance.x), 1);
        break;
      }
      case ResizeKind.Both: {
        const pointerLocation = event.data.getLocalPosition(app.stage);
        const currentDistance = substractAbs(position, pointerLocation);
        onResize(
          reduceResize(currentDistance.x / (resizeData as ResizingState).initialDistance.x),
          reduceResize(currentDistance.y / (resizeData as ResizingState).initialDistance.y)
        );
        (resizeData as ResizingState).initialDistance = currentDistance
        setResizeData(resizeData)
        break;
      }
      default: return;
    }
  }, [resizeData, app, onResize, position])

  const startHorizontalResize = useCallback(startResize(ResizeKind.Horizontal), [startResize]);
  const startVerticalResize = useCallback(startResize(ResizeKind.Vertical), [startResize]);
  const startCombinedResize = useCallback(startResize(ResizeKind.Both), [startResize]);

  

  const HorizontalEdge = (props: { position: Point }) => {
    const { position } = props;
    return (
    <DrawableRectangle 
      fill={edgeFill}
      width={paddedWidth}
      height={edgeThickness}
      position={position}
      pointerover={horizontalResizeStyle}
      pointerout={unhover}
      pointerdown={startVerticalResize}
      pointermove={pointerMoveResize}
      // pointerup={stopResize}
      // pointerupoutside={stopResize}
      interactive={true}
      hitArea = {new Rectangle(
        position.x - paddedWidth / 2, 
        position.y - edgeThickness / 2, 
        paddedWidth, edgeThickness * 1.5
      )}
    />)
  };

  const VerticalEdge = (props: {position: Point}) => {
    const {position} = props;
    return (
    <DrawableRectangle
      fill={edgeFill}
      width={edgeThickness}
      height={paddedHeight}
      position={position}
      pointerover={verticalResizeStyle}
      pointerout={unhover}
      pointerdown={startHorizontalResize}
      pointermove={pointerMoveResize}
      // pointerup={stopResize}
      // pointerupoutside={stopResize}
      interactive={true}
      hitArea={new Rectangle(
        position.x - edgeThickness,
        position.y - paddedHeight / 2,
        edgeThickness * 2,
        paddedHeight,
      )}
    />)
  };
  
  const Dot = (props: { 
          cursorStyle: CursorType, 
          position: Point, 
          startResize: (event: interaction.InteractionEvent) => void}) => {
    const { cursorStyle, position, startResize } = props;
    return (<DrawableRectangle
      fill={edgeFill}
      width={DOT_WIDTH}
      height={DOT_WIDTH}
      position={position}
      pointerover={() => setCursorStyle(cursorStyle)}
      pointerout={unhover}
      // pointerup={stopResize}
      // pointerupoutside={stopResize}
      pointermove={pointerMoveResize}
      pointerdown={startResize}
      hitArea = {new Rectangle(
        position.x - DOT_WIDTH, 
        position.y - DOT_WIDTH, 
        DOT_WIDTH*2, 
        DOT_WIDTH*2)}
      interactive={true}
    />)
  }

  return (
    <Container 
      interactiveChildren={true}
      interactive={true}
      pointerup={stopResize}
      pointerupoutside={stopResize}
      >
      <VerticalEdge position={ east }/>
      <VerticalEdge position={ west }/>
      <HorizontalEdge position={ north }/>
      <HorizontalEdge position={ south }/>
      <Dot 
        position={northWest} 
        startResize={startCombinedResize}
        cursorStyle={'se-resize'}/>
      <Dot 
        position={north} 
        startResize={startVerticalResize}
        cursorStyle={'s-resize'}/>
      <Dot 
        position={northEast} 
        startResize={startCombinedResize}
        cursorStyle={'sw-resize'}/>
      <Dot 
        position={east}
        startResize={startHorizontalResize}
        cursorStyle={'e-resize'}/>
      <Dot 
      position={southEast} 
      startResize={startCombinedResize}
      cursorStyle={'se-resize'}/>
      <Dot 
        position={south} 
        startResize={startVerticalResize}
        cursorStyle={'s-resize'}/>
      <Dot 
        position={southWest} 
        startResize={startCombinedResize}
        cursorStyle={'sw-resize'}/>
      <Dot 
        position={west} 
        startResize={startHorizontalResize}
        cursorStyle={'e-resize'}/>
    </Container>
  )
}


const withMovalbe = (WrappedComponent:any) => 
(props: IDiagramElement ) => {
    const {
      width,
      height,
      onSelect,
      position,
      selected,
      id
    } = props;

    const dispatchAction = useContext(ActionContext);


    const app = useApp();

  const resizeAction = useRef<ResizeAction>({
    data: {
      height: 0,
      width: 0,
    },
    elementId: id,
    elementType: ElementType.Element,
    type: ActionType.Resize
  });

    // const [position, setPosition] = useState(propPosition);
    const [offset, setOffset] = useState({x: 0, y: 0});
    const [dragged, setDragged] = useState(false);
  const stopDragging = () => (setDragged(false));
  
  const upperLeftCorner = new Point(position.x - (width + CONTAINER_PADDING) / 2, position.y - (height + CONTAINER_PADDING) / 2)
  const containerWidth = width + CONTAINER_PADDING;
  const containerHeight = height + CONTAINER_PADDING;


  const startDragging = ((event: interaction.InteractionEvent) => {
    const offset = event.data.getLocalPosition(app.stage);
    setOffset({
      x: offset.x - position.x,
      y: offset.y - position.y
    });
    
    setDragged(true);
    if(!selected) {
      onSelect();
    }
  });
  
  const onDrag = ((event:interaction.InteractionEvent) => {
    if (dragged) {
      const newPosition = event.data.getLocalPosition(app.stage)
      dispatchAction({ 
        elementId: id, 
        data: new Point(newPosition.x - offset.x, newPosition.y - offset.y),
        elementType: ElementType.Element,
        type: ActionType.Move
      })
    }
  });
  
  const childProps = { 
    ...props, 
    position, 
    startDragging, 
    stopDragging
  };

  
    return (
      <Container>
        { selected && 
        <Graphics
          draw = {g => {
            g.clear();
            g.beginFill(0xFFFFFF, 0.01);
            g.drawRect(upperLeftCorner.x, upperLeftCorner.y, containerWidth, containerHeight);
            g.endFill();
          }}
          interactive={true}
          hitArea = {new Rectangle(upperLeftCorner.x, upperLeftCorner.y, containerWidth, containerHeight)}
          pointerdown={startDragging}
          pointerupoutside = {stopDragging}
          pointermove={onDrag}
          pointerup={stopDragging}
        />
        }

        {selected && 
        <MoverEdges 
          position={position} 
          width={width} 
          height={height} 
          onResize={(x: number, y: number) => {
              resizeAction.current.elementId = id;
              resizeAction.current.data.width = width * x;
              resizeAction.current.data.height = height *  y;
              dispatchAction(resizeAction.current)
            }}
          onResizeStop={() => {console.log('stopResizing')}}
          onResizeStart={() => {console.log('startResizing')}}
          />
        }

        <WrappedComponent { ...childProps } />
     </Container>
    )
}


export default withMovalbe;
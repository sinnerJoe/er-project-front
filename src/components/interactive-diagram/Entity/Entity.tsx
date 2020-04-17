
import {Stage, Text, Graphics, PixiComponent, useApp } from '@inlet/react-pixi';

import {Point} from 'pixi.js';
// import {Text} from 'pixi.js'
import React, { useState, useContext } from 'react';

import IDiagramElement from '../../../shared/interfaces/IDiagramElement'
import { CursorDispatch } from '../../CursorManager';

type PropTypes = {
    position: PIXI.Point;
    text: string;
    // updatePosition: (position: Point) => void
}

export default (props: IDiagramElement) => {
    const { position, text ,width, height } = props;
    // const width = 100;
    // const height = 100;
    const fontSize = 9;
    return (
        <Graphics 
        draw = {g => {
            g.clear()
            g.lineStyle(2, 0xaa00ff, 1);
            g.beginFill(0xff700b, 1);
            g.moveTo(position.x - width / 2, position.y)
            g.lineTo(position.x, position.y + height / 2);
            g.lineTo(position.x + width / 2, position.y);
            g.lineTo(position.x, position.y - height / 2);
            g.lineTo(position.x - width / 2, position.y);
            g.endFill();
            }}    
        pointerdown = {props.startDragging}

        pointerupoutside = {props.stopDragging}
        pointerup = {props.stopDragging}
        interactive = {true}
        >
            <Text
            text = {text}
            position={new Point(position.x - width * 1/3, position.y - fontSize / 2 * 3)}
            style = {{
                break: true,
                wordWrap: true,
                wordWrapWidth: width * 2/3,
                fontSize,
                align:'center',
            }}
            />
        </Graphics>
    )
}

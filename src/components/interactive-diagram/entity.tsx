
import {Stage, Text, Graphics, PixiComponent, useApp } from '@inlet/react-pixi';

// import {Text} from 'pixi.js'
import React from 'react';
import Coordinate from '../../shared/interfaces/Position'

type PropTypes = {
    position: Coordinate;
    text: string;
}

export default (props: PropTypes) => {
    // const app = useApp();
    const { position, text } = props;
    const width = 100;
    const height = 100;
    return (
        <Graphics 
            draw = {g => {
                g.beginFill();
                g.lineStyle(2, 0xaa00ff, 1);
                g.beginFill(0xff700b, 1);
                g.moveTo(position.x - width / 2, position.y)
                g.lineTo(position.x, position.y + height / 2);
                g.lineTo(position.x + width / 2, position.y);
                g.lineTo(position.x, position.y - height / 2);
                g.lineTo(position.x - width / 2, position.y)
                g.endFill()
                // const txtObj = new Text(text, { fill: 0xffffff, fontSize: 9, x: position.x, y:position.y});
                // console.log(txtObj.width)
                // g.addChild(txtObj)
            }}
        >
         <Text>
             text
         </Text>
        </Graphics>
    )
}

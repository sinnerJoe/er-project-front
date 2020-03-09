
import {Stage, Graphics, PixiComponent} from '@inlet/react-pixi';
import React from 'react';
import Coordinate from '../../shared/interfaces/Position'

type PropTypes = {
    position: Coordinate;

}

export default PixiComponent('Entity', {
    create: () => new Graphics(),
    applyProps: (g, _, props: PropTypes) => {
        const {position} = props;
        g.clear();
        g.beginFill(0xff0000);
        g.drawRect(position.x, position.y, 100, 200);
        g.endFill();
    }   
})
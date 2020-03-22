
import { Stage, Text, Graphics, PixiComponent, useApp } from '@inlet/react-pixi';

import PIXI, { Point } from 'pixi.js';
// import {Text} from 'pixi.js'
import React, { useState } from 'react';
import { ExtractProps } from '../../../shared/interfaces/helpers';

type ARGBColor = { 
  alpha?: number, 
  color?: number 
}

type GraphicsWithoutFill = Omit<ExtractProps<Graphics>, "fill">;
export function DrawableRectangle (props: {
                                      width: number,
                                      height: number,
                                      position: Point,
                                      fill?: ARGBColor, 
                                      border?: ARGBColor & {width: number}, 
                                      } & GraphicsWithoutFill) {
  const {
    fill: propFill,
    border: propBorder,
    width,
    height,
    position,
    ...rest
  } = props;

  const border:any = propBorder || {};
  const fill = propFill || {};
  return (<Graphics
    {...rest}
    draw = {g => {
      g.clear()
      g.lineStyle(border.width, border.color, border.alpha);
      g.beginFill(fill.color, fill.alpha);
      g.drawRect(position.x - width / 2, position.y - height / 2, width, height);
      g.endFill();
    }}
  />)
}
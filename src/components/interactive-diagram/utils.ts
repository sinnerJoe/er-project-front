import { Point } from "pixi.js";

export function substract(a: Point, b: Point): Point {
  return new Point(a.x - b.x, a.y - b.y);
}
export function substractAbs(a: Point, b: Point): Point {
  return new Point(Math.abs(a.x - b.x), Math.abs(a.y - b.y));
}
export function distance(a: Point, b: Point): Number {
  const xDiff = a.x - b.x;
  const yDiff = a.y - b.y;
  return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
}
export default interface IMovable {
  position: PIXI.Point,
  width: number,
  height: number,
  selected: boolean,
  onSelect: () => void,
};
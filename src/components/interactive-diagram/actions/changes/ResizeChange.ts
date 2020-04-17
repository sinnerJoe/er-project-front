import { Change, ChangePrototype } from "../History";
import IDiagramElement from "../../../../shared/interfaces/IDiagramElement";
import { Point } from "pixi.js";
import { MoveAction, ActionType, ElementType, ResizeAction } from "..";

export default class ResizeChange extends ChangePrototype<ResizeAction, ResizeAction> {
  revert() {
    return this.revertData;
  }
}
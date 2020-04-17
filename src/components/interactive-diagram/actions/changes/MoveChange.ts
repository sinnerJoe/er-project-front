import { Change, ChangePrototype } from "../History";
import IDiagramElement from "../../../../shared/interfaces/IDiagramElement";
import { Point } from "pixi.js";
import { MoveAction, ActionType, ElementType } from "..";

export default class MoveChange extends ChangePrototype<MoveAction, MoveAction> {
  revert() {
    return this.revertData;
  }
}
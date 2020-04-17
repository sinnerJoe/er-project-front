import { Action, ChangeDispatcher, ActionType, ElementStore, ElementType } from ".";
import MoveChange from "./changes/MoveChange";

export interface Change<A extends Action> {
  revert: () => A;
}

export abstract class ChangePrototype<A extends Action=Action, RA extends Action=Action > implements Change<RA> {
  protected revertData: A;
  protected store: ElementStore;
  constructor(store: ElementStore, action: A) {
    this.revertData = action;
    this.store = store;
  }

  public get actionType() {
    return this.revertData.type;
  }

  abstract revert(): RA;
}


const changeDisctionary: any = {
  [String(ActionType.Move)]: MoveChange.constructor,
}

class History {
  changes: ChangePrototype<Action, Action>[] = [];
  dispatcher: ChangeDispatcher
  lastChange: ChangePrototype<Action, Action> | null = null;
  constructor(dispatcher: ChangeDispatcher) {
    this.dispatcher = dispatcher;
  }

  commitChange() {
    if(this.lastChange) {
      this.changes.push(this.lastChange);
      this.lastChange = null;
    }
  }

  applyChange(action: Action) {
    if((!this.lastChange || this.lastChange.actionType !== action.type) 
       && changeDisctionary.hasOwnProperty(action.type)){
      this.lastChange = new changeDisctionary[action.type](this.dispatcher.getStore(), action);
    }
    this.dispatcher.applyAction(action);
  }

  undoChange() {
    if(this.lastChange !== null) {
      this.dispatcher.applyAction(this.lastChange.revert());
      this.lastChange = null;
    } 
    else if(this.changes.length > 0 ) {
      const topChange = this.changes.pop() as ChangePrototype;
      this.dispatcher.applyAction(topChange.revert());
    }
  }
}
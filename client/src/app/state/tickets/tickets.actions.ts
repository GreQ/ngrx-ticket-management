import { Action } from '@ngrx/store';
import { Ticket } from '../../models/ticket';

export const enum TicketActionTypes {
  ACTIVITY = '[tickets] activity',
  FILTER = '[tickets] filter',
  LOADED = '[tickets] loaded',
  SAVED = '[ticket] saved',
  SELECTED = '[ticket] selected',

  LOADALL = '[tickets] load',
  SAVE = '[ticket] save',
  COMPLETE = '[ticket] complete',
  ASSIGN = '[ticket] assign',
  CREATE = '[ticket] create'
}

export class TicketFilterOptions {
  constructor(public filterBy: string, public showAll = true) {}
}

// ***************************************************************
// Request 'Actions'
// ***************************************************************

export class LoadAllTicketsAction implements Action {
  readonly type = TicketActionTypes.LOADALL;
  readonly data = null;
}

export class FilterTicketsAction implements Action {
  readonly type = TicketActionTypes.FILTER;
  constructor(public data: TicketFilterOptions) {}
}

export class CompleteTicketAction implements Action {
  readonly type = TicketActionTypes.COMPLETE;
  constructor(public data: Ticket) {}
}

export class SaveTicketAction implements Action {
  readonly type = TicketActionTypes.SAVE;
  constructor(public data: Ticket) {}
}

export class AssignUserAction implements Action {
  readonly type = TicketActionTypes.ASSIGN;
  constructor(public data: Ticket) {}
}

// ***************************************************************
// Document 'Action'
// ***************************************************************

export class TicketsProcessingAction implements Action {
  readonly type = TicketActionTypes.ACTIVITY;
  constructor(public data: boolean) {}
}

export class TicketsLoadedAction implements Action {
  readonly type = TicketActionTypes.LOADED;
  constructor(public data: Array<Ticket>) {}
}

export class TicketSavedAction implements Action {
  readonly type = TicketActionTypes.SAVED;
  constructor(public data: Ticket) {}
}

export class SelectTicketAction implements Action {
  readonly type = TicketActionTypes.SELECTED;
  constructor(public data: string) {}
}

export type TicketAction =
  // Request Actions
  | FilterTicketsAction
  | TicketsProcessingAction
  // Event Actions
  | LoadAllTicketsAction
  | SaveTicketAction
  | SelectTicketAction
  | AssignUserAction
  | CompleteTicketAction
  // Document Actions
  | TicketsLoadedAction
  | TicketSavedAction;

import {Ticket} from '../../models/ticket';

export class TicketsFilter {
  constructor(public filterBy:string,  public showAll = true){ }
}

export type TicketAction = {
  type : string,
  data?: any
};

export const enum TicketActionTypes {
  FILTER   = '[tickets] filter',
  TICKETS  = '[tickets] list',
  LOADALL  = '[tickets] load',

  SAVE     = '[ticket] save',
  COMPLETE = '[ticket] complete',
  ASSIGN   = '[ticket] assign',
  CREATE   = '[ticket] create'
};

  // ***************************************************************
  // Request 'Actions'
  // ***************************************************************

  export function loadAllAction():TicketAction {
    return { type: TicketActionTypes.LOADALL };
  }

  export function completeAction(ticket:Ticket):TicketAction {
    return { type: TicketActionTypes.COMPLETE, data: ticket };
  }

  export function saveAction(ticket:Ticket): TicketAction {
    return { type: TicketActionTypes.SAVE, data: ticket };
  }

  export function  assignAction(ticket:Ticket): TicketAction {
    return { type: TicketActionTypes.ASSIGN, data: ticket };
  }

  // ***************************************************************
  // Document 'Action'
  // ***************************************************************

  export function ticketsAction(list:Ticket[]): TicketAction{
    return { type: TicketActionTypes.TICKETS, data: list};
  }


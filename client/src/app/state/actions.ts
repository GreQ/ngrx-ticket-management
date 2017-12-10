import {Ticket} from '../models/ticket';

export type TicketAction = {
  type : string,
  data?: any
};

export const enum TicketActionTypes {
  FILTER   = '[tickets] filter',

  TICKETS  = '[tickets] list',
  TICKET   = '[tickets] add',

  LOAD     = '[tickets] load',
  SAVE     = '[tickets] save',
  COMPLETE = '[tickets] complete',
};
  // ***************************************************************
  // Request 'Actions'
  // ***************************************************************

  export function loadAllAction():TicketAction {
    return { type: TicketActionTypes.LOAD };
  }

  export function completeAction(ticket:Ticket):TicketAction {
    return { type: TicketActionTypes.COMPLETE, data: ticket };
  }

  export function saveAction(ticket:Ticket): TicketAction {
    console.log(Date.now(), ticket);
    return { type: TicketActionTypes.SAVE, data: ticket };
  }

  // ***************************************************************
  // Document 'Action'
  // ***************************************************************

  export function ticketsAction(list:Ticket[]): TicketAction{
    return { type: TicketActionTypes.TICKETS, data: list};
  }


import {isArray} from 'rxjs/util/isArray';
import {Ticket} from '../models/ticket';

import { TicketAction, TicketActionTypes } from './actions';

// ***************************************************************
// Real Reducer
// ***************************************************************

export function ticketsReducer(list: Ticket[], action: TicketAction): Ticket[] {
  if ( action.type = TicketActionTypes.TICKET ) {
    const items = isArray(action.data) ? action.data : [action.data];
    action = {type: TicketActionTypes.TICKETS, data: items};
  }
  
  switch(action.type) {
    case TicketActionTypes.TICKETS :
      const items = action.data as Ticket[];
      list = items.reduce((acc, it)=> {
          return addTicket(it, acc);
      },list);

      break;
    case TicketActionTypes.COMPLETE : 
      const ticket = action.data as Ticket;
      list = addTicket( {...ticket, completed : true }, list );
      break;
  }

  return list;
}

/**
 * Notice this is analogous to a Redux `reducer` function...
 * @param list
 * @param filter
 */
export function ticketsFilter(criteria:string, list:Ticket[]):Ticket[] {
  const inComplete = (t:Ticket):boolean => (t.completed !== true);
  return list
    .filter(it => matchesCriteria(criteria,it))
    .filter( inComplete );
}

/**
 * Add ticket to existing list. If already existing,
 * overwrite with new values. Maintain ticket order.
 */
function addTicket(ticket:Ticket, list:Ticket[]):Ticket[] {
  const found = findExisting(ticket, list);
  const result = !!found ? list.map(it => {
      return (it.id == ticket.id) ? {...it, ...ticket} : it;
  }) : list.concat(ticket);

  return result;
}



// ***************************************************************
// Simple data model methods
// ***************************************************************

/**
 * Determine if criteria matches ticket description
 */
function matchesCriteria(criteria:string, ticket:Ticket):boolean {
  const description = ticket.description.toLowerCase();
  const title       = ticket.title.toLowerCase();

    criteria = criteria.toLowerCase();

  return title.includes(criteria) || description.includes(criteria);
}

/**
 * Find existing ticket (if present)
 */
function findExisting(ticket:Ticket, buffer:Ticket[]):Ticket {
  return buffer.reduce((prev, curr):Ticket=> {
    return prev ? prev : ((curr.id == ticket.id) ? curr : null);
  }, null);
}

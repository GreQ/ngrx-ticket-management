import {createSelector} from '@ngrx/store';
import { createEntityAdapter, EntityState, EntityAdapter } from '@ngrx/entity';

import {Ticket} from '../../models/ticket';
import {TicketAction, TicketActionTypes, TicketFilterOptions} from './tickets.actions';

import {ApplicationState} from '../app.state';

export interface TicketsState extends EntityState<Ticket> {
  list              : Array<Ticket>;
  filterCriteria    : TicketFilterOptions;
  selectedTicketId  : string | null;
  loaded            : boolean;
  processing        : number;
}
export const ticketAdapter: EntityAdapter<Ticket> = createEntityAdapter<Ticket>({
  selectId: (ticket: Ticket) => ticket.id,
  sortComparer: false,
});


const INITAL_STATE: TicketsState = ticketAdapter.getInitialState({
  list              : [ ],
  filterCriteria    : { filterBy: '', showAll:true},
  selectedTicketId  : null,
  loaded            : false,
  processing        : 0
});

// ***************************************************************
// Real Reducer
// ***************************************************************

export function ticketsReducer(state:TicketsState = INITAL_STATE, action: TicketAction): TicketsState {
  const  process = (state, isProcessing) => state.processing + (isProcessing ? 1 : -1);

  switch(action.type) {
    case TicketActionTypes.ACTIVITY :   return {...state,  processing : process(state, !!action.data)};
    case TicketActionTypes.SELECTED:    return {...state,  selectedTicketId : action.data     };
    case TicketActionTypes.FILTER:      return {...state,  filterCriteria : action.data       };
    case TicketActionTypes.LOADED :     return {...ticketAdapter.addMany(action.data,state)   };
    case TicketActionTypes.SAVED :      return { ...ticketAdapter.addOne(action.data, state)  };
  }

  return state;
}


// ***************************************************************
// Queries used by @ngrx Store
// ***************************************************************

export namespace TicketsQuery {
  export const isProcessing  = (state: ApplicationState) => state.tickets.processing > 0;
  export const getAllTickets = (state: ApplicationState) => state.tickets.list;
  export const getLoaded = (state: ApplicationState) => state.tickets.loaded;
  export const getFilter = (state: ApplicationState) => state.tickets.filterCriteria;
  export const getTickets = createSelector(
            getAllTickets, getFilter, (tickets, filters) => {
              return applyTicketFilters(filters,  tickets);
            }
          );

  export const getSelectedTicketId = (state: ApplicationState) => state.tickets.selectedTicketId;
  export const getSelectedTicket = createSelector( getAllTickets, getSelectedTicketId,
              (tickets, id) => {
                let ticket = tickets.find(ticket => ticket.id == id);
                return ticket ? Object.assign({}, ticket) : undefined;
              }
          );
}


/**
 * Notice this is analogous to a Redux `reducer` function...
 * @param list
 * @param filter
 */
export function applyTicketFilters(filters:TicketFilterOptions, list:Ticket[]):Ticket[] {
  return list
    .filter(it => matchesCriteria(filters.filterBy,it))
    .filter( filters.showAll ? showAll : notCompleted );
}

const showAll = (it => it);
const notCompleted = (t:Ticket):boolean => (t.completed !== true);




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


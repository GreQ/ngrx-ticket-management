import { createSelector } from '@ngrx/store';
import { ApplicationState } from '../app.state';

import { isArray } from 'rxjs/util/isArray';
import { Ticket } from '../../models/ticket';

import {
  TicketAction,
  TicketActionTypes,
  TicketFilterOptions
} from './tickets.actions';

export interface TicketsState {
  list: Array<Ticket>;
  filterCriteria: TicketFilterOptions;
  selectedTicketId: string | null;
  loaded: boolean;
  processing: number;
}

const INITAL_STATE: TicketsState = {
  list: [],
  filterCriteria: { filterBy: '', showAll: true },
  selectedTicketId: null,
  loaded: false,
  processing: 0
};

// ***************************************************************
// Real Reducer
// ***************************************************************

export function ticketsReducer(
  state: TicketsState = INITAL_STATE,
  action: TicketAction
): TicketsState {
  let list;

  switch (action.type) {
    case TicketActionTypes.ACTIVITY:
      const processing = state.processing + (!!action.data ? 1 : -1);
      state = { ...state, processing };
      break;

    case TicketActionTypes.SELECTED:
      const selectedTicketId = action.data;
      state = { ...state, selectedTicketId };
      break;

    case TicketActionTypes.FILTER:
      state = { ...state, filterCriteria: action.data };
      break;

    case TicketActionTypes.LOADED:
      const loaded = true;
      list = action.data as Ticket[];

      state = { ...state, list };
      break;

    case TicketActionTypes.SAVED:
      const items = [action.data];

      list = items.reduce((acc, it) => {
        return addTicket(it, acc);
      }, state.list);

      state = { ...state, list, loaded };
      break;
  }

  return state;
}

// ***************************************************************
// Queries used by @ngrx Store
// ***************************************************************

export namespace TicketsQuery {
  export const isProcessing = (state: ApplicationState) =>
    state.tickets.processing > 0;
  export const getAllTickets = (state: ApplicationState) => state.tickets.list;
  export const getLoaded = (state: ApplicationState) => state.tickets.loaded;
  export const getFilter = (state: ApplicationState) =>
    state.tickets.filterCriteria;
  export const getTickets = createSelector(
    getAllTickets,
    getFilter,
    (tickets, filters) => {
      return applyTicketFilters(filters, tickets);
    }
  );

  export const getSelectedTicketId = (state: ApplicationState) =>
    state.tickets.selectedTicketId;
  export const getSelectedTicket = createSelector(
    getAllTickets,
    getSelectedTicketId,
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
export function applyTicketFilters(
  filters: TicketFilterOptions,
  list: Ticket[]
): Ticket[] {
  return list
    .filter(it => matchesCriteria(filters.filterBy, it))
    .filter(filters.showAll ? showAll : notCompleted);
}

const showAll = it => it;
const notCompleted = (t: Ticket): boolean => t.completed !== true;

/**
 * Add ticket to existing list. If already existing,
 * overwrite with new values. Maintain ticket order.
 */
function addTicket(ticket: Ticket, list: Ticket[]): Ticket[] {
  const found = findExisting(ticket, list);
  const result = !!found
    ? list.map(it => {
        return it.id == ticket.id ? { ...it, ...ticket } : it;
      })
    : list.concat(ticket);

  return result;
}

// ***************************************************************
// Simple data model methods
// ***************************************************************

/**
 * Determine if criteria matches ticket description
 */
function matchesCriteria(criteria: string, ticket: Ticket): boolean {
  const description = ticket.description.toLowerCase();
  const title = ticket.title.toLowerCase();

  criteria = criteria.toLowerCase();

  return title.includes(criteria) || description.includes(criteria);
}

/**
 * Find existing ticket (if present)
 */
function findExisting(ticket: Ticket, buffer: Ticket[]): Ticket {
  return buffer.reduce((prev, curr): Ticket => {
    return prev ? prev : curr.id == ticket.id ? curr : null;
  }, null);
}

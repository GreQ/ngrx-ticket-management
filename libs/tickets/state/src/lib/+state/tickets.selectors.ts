import { createFeatureSelector, createSelector } from '@ngrx/store';
import {applyTicketFilters, TicketsState} from './tickets.reducers';

// ***************************************************************
//    Feature 'ticket' state definition (see tickets.reducer.ts):
//    This is the client-side, in-memory data structure used to manage state for
//    all ticket-related data.
//
//    export interface TicketsState {
//      loaded           : boolean;
//      processing       : number;
//      list             : Array<Ticket>;
//      filterCriteria   : TicketFilterOptions;
//      selectedTicketId : string | null;
//    }
// ***************************************************************

/**
 * Get the feature 'store slice' state
 */
const getTicketsState = createFeatureSelector<TicketsState>('tickets');

// ***************************************************************
//   Queries used by @ngrx Store
// ***************************************************************

const isProcessing  = createSelector(getTicketsState, (state:TicketsState) => state.processing > 0);
const getLoaded     = createSelector(getTicketsState, (state:TicketsState) => state.loaded);
const getFilter     = createSelector(getTicketsState, (state:TicketsState) => state.filterCriteria);

const getAllTickets = createSelector(getTicketsState, (state:TicketsState) => state.list);
const getTickets    = createSelector(
  getAllTickets,
  getFilter,
  (tickets, filters) => {
    return applyTicketFilters(filters, tickets);
  }
);
const getSelectedTicketId = createSelector(getTicketsState, (state:TicketsState) => state.selectedTicketId);
const getSelectedTicket = createSelector(
  getAllTickets,
  getSelectedTicketId,
  (tickets, id) => {
    let ticket = tickets.find(ticket => ticket.id == id);
    return ticket ? Object.assign({}, ticket) : undefined;
  }
);

export const TicketsQuery = {
  isProcessing,
  getAllTickets,
  getLoaded,
  getFilter,
  getTickets,
  getSelectedTicketId,
  getSelectedTicket
};

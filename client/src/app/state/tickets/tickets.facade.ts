import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Actions } from '@ngrx/effects';

import { ApplicationState } from '../app.state';
import { UsersFacade } from '../users/users.facade';
import { BackendService } from '../../services/backend.service';
import { Ticket } from '../../models/ticket';
import { TicketsQuery } from './tickets.reducers';
import { LoadAllTicketsAction, SaveTicketAction } from './tickets.actions';
import { AssignUserAction, CompleteTicketAction } from './tickets.actions';
import { SelectTicketAction, FilterTicketsAction } from './tickets.actions';

/**
 *
 */
@Injectable()
export class TicketsFacade {
  users$ = this.users.allUsers$;

  allTickets$ = this.store.select(TicketsQuery.getAllTickets);
  filteredTickets$ = this.store.select(TicketsQuery.getTickets);
  selectedTicket$ = this.store.select(TicketsQuery.getSelectedTicket);

  processing$ = this.store.select(TicketsQuery.isProcessing);

  constructor(
    private actions$: Actions,
    private store: Store<ApplicationState>,
    private users: UsersFacade,
    private backend: BackendService
  ) {}

  // ***************************************************************
  // Public Methods (... that internally dispatch Actions to store)
  // ***************************************************************

  select(ticketId: string) {
    this.store.dispatch(new SelectTicketAction(ticketId));
  }
  filter(filterBy: string, showAll = true) {
    this.store.dispatch(new FilterTicketsAction({ filterBy, showAll }));
  }

  loadAll() {
    this.store.dispatch(new LoadAllTicketsAction());
  }
  save(ticket: Ticket) {
    this.store.dispatch(new SaveTicketAction(ticket));
  }
  add(title: string) {
    this.store.dispatch(new SaveTicketAction({ title }));
  }
  assign(ticket: Ticket) {
    this.store.dispatch(new AssignUserAction(ticket));
  }
  close(ticket: Ticket) {
    this.store.dispatch(new CompleteTicketAction(ticket));
  }

  // ***************************************************************
  // Private Queries
  // ***************************************************************

  /**
   * Used to internal throtte the LoadAllTickets requests
   */
  private loaded$ = this.store.select(TicketsQuery.getLoaded);

  // ***************************************************************
  // Effect Models
  // ***************************************************************
}

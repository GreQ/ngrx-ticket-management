import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Actions } from '@ngrx/effects';

import { UsersFacade } from '@nrwl-tickets/users-state';
import { BackendService } from '@nrwl-tickets/tickets-backend';
import { Ticket } from '@nrwl-tickets/tickets-models';

import { TicketsQuery } from './tickets.selectors';
import { LoadAllTicketsAction, SaveTicketAction } from './tickets.actions';
import { AssignUserAction, CompleteTicketAction } from './tickets.actions';
import { SelectTicketAction, FilterTicketsAction } from './tickets.actions';
import { TicketsState} from './tickets.reducers';

/**
 *
 */
@Injectable({
  providedIn : 'root'
})
export class TicketsFacade {
  users$ = this.users.allUsers$;

  allTickets$ = this.store.select(TicketsQuery.getAllTickets);
  filteredTickets$ = this.store.select(TicketsQuery.getTickets);
  selectedTicket$ = this.store.select(TicketsQuery.getSelectedTicket);

  processing$ = this.store.select(TicketsQuery.isProcessing);

  constructor(
    private actions$: Actions,
    private store: Store<TicketsState>,
    private users: UsersFacade,
    private backend: BackendService
  ) {
    // Auto-select ticket based on Route
    // this.store
    //   .select(TicketsQuery.getRouterState)
    //   .pipe(
    //     filter(router => router.state),
    //     map(router => router.state.params.id)
    //   )
    //   .subscribe(this.select.bind(this));
  }

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
}

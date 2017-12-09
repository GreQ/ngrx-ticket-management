import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Actions, Effect, ROOT_EFFECTS_INIT } from '@ngrx/effects';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { map, switchMap, concatMap, withLatestFrom, tap } from 'rxjs/operators';

import { User } from '../../models/ticket';
import { NoopAction } from '../app.actions';
import { Ticket } from '../../models/ticket';
import { UsersLoadedAction } from '../users/users.actions';
import { TicketAction, TicketActionTypes } from './tickets.actions';
import { TicketsQuery } from './tickets.reducers';
import { TicketsLoadedAction, TicketSavedAction } from './tickets.actions';
import { TicketsProcessingAction } from './tickets.actions';

import { updateWithAvatars } from '../../utils/avatars';

import { ApplicationState } from '../app.state';
import { BackendService } from '../../services/backend.service';

@Injectable()
export class TicketsEffects {
  /**
   * Used to internal throttle the LoadAllTickets requests
   */
  loaded$ = this.store.select(TicketsQuery.getLoaded);

  @Effect()
  loadAllEffect$ = this.actions$
    .ofType(ROOT_EFFECTS_INIT, TicketActionTypes.LOADALL)
    .pipe(
      withLatestFrom(this.loaded$),
      switchMap(([_, loaded]) => {
        return loaded
          ? of([null, null])
          : forkJoin(this.backend.tickets(), this.getUsers());
      }),
      map(([tickets, users]) => {
        if (tickets) {
          tickets = updateWithAvatars(tickets, users);
          return new TicketsLoadedAction(tickets);
        }
        return new NoopAction();
      })
    );

  @Effect()
  saveEffect$ = this.actions$
    .ofType(TicketActionTypes.SAVE)
    .pipe(
      map(toTicket),
      concatMap(ticket =>
        this.backend.newTicket(ticket).pipe(this.trackActivity)
      ),
      map((ticket: Ticket) => new TicketSavedAction(ticket))
    );

  @Effect()
  completeEffect$ = this.actions$
    .ofType(TicketActionTypes.COMPLETE)
    .pipe(
      map(toTicket),
      concatMap(ticket =>
        this.backend.complete(ticket.id, true).pipe(this.trackActivity)
      ),
      map((ticket: Ticket) => new TicketSavedAction(ticket))
    );

  @Effect()
  addNewEffect$ = this.actions$
    .ofType(TicketActionTypes.CREATE)
    .pipe(
      map(toTicket),
      concatMap(ticket =>
        this.backend.newTicket(ticket).pipe(this.trackActivity)
      ),
      map((ticket: Ticket) => new TicketSavedAction(ticket))
    );

  @Effect()
  assignEffect$ = this.actions$
    .ofType(TicketActionTypes.ASSIGN)
    .pipe(
      map(toTicket),
      concatMap(({ id, assigneeId }) =>
        this.backend.assign(id, assigneeId).pipe(this.trackActivity)
      ),
      map((ticket: Ticket) => new TicketSavedAction(ticket))
    );

  constructor(
    private actions$: Actions,
    private store: Store<ApplicationState>,
    private backend: BackendService
  ) {}

  /**
   * HOF used to build pipeable operator to announce start/stop of async action...
   */
  private trackActivity = trackProcess({
    start: () => this.store.dispatch(new TicketsProcessingAction(true)),
    stop: () => this.store.dispatch(new TicketsProcessingAction(false))
  });

  /**
   * Special accessor used by both TicketsFacade (forkJoin)
   * and UsersActionTypes.LOADALL
   */
  getUsers(): Observable<User[]> {
    return this.backend.users().pipe(
      tap(users => {
        const usersLoaded = new UsersLoadedAction(users);
        this.store.dispatch(usersLoaded);
      })
    );
  }
}

const toTicket = (action: TicketAction): Ticket => action.data;

// ***************************************************************
// Pipeable Operator Factory
// ***************************************************************

/**
 * Proxy target observable to add pre- and post- processing event
 * notifications...
 */
function trackProcess({ start, stop }) {
  return (target$: Observable<any>): Observable<any> => {
    return Observable.create(obsrv => {
      start();
      const watch = target$.subscribe(
        resp => {
          obsrv.next(resp);
          obsrv.complete();
          stop();
        },
        () => stop()
      );

      return () => watch.unsubscribe();
    });
  };
}

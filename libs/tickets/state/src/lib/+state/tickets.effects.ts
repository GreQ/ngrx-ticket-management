import {Injectable} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ROUTER_NAVIGATION, RouterNavigationAction} from '@ngrx/router-store';

import {Store, select} from '@ngrx/store';
import {Actions, Effect, ofType, ROOT_EFFECTS_INIT} from '@ngrx/effects';
import {RouterStateTitle} from '@nrwl-tickets/common/state';

import {Observable, combineLatest, of, forkJoin} from 'rxjs';
import {tap, map, switchMap, concatMap, withLatestFrom} from 'rxjs/operators';

import {UsersFacade} from '@nrwl-tickets/users-state';
import {BackendService} from '@nrwl-tickets/tickets-backend';
import {updateWithAvatars, NoopAction} from '@nrwl-tickets/common-utils';

import {Ticket} from '@nrwl-tickets/tickets-models';
import {TicketsState} from './tickets.reducers';
import {TicketsQuery} from './tickets.selectors';
import {
  TicketActionUnion,
  TicketActionTypes,
  TicketsProcessingAction,
  TicketsLoadedAction,
  TicketSavedAction,
  LoadAllTicketsAction
} from './tickets.actions';

@Injectable()
export class TicketsEffects {
  /**
   * Used to internal throttle the LoadAllTickets requests
   */
  loaded$ = this.store.select(TicketsQuery.getLoaded);

  // Update title every time route or context changes,
  // pulling current tickets from the store.
  // @see `custom-router-state.serializer.ts`

  @Effect({dispatch: false})
  updateTitle$ = combineLatest(
      this.actions$.pipe(ofType(ROUTER_NAVIGATION)),
      this.store.pipe(select(TicketsQuery.getTickets)),
      (action: RouterNavigationAction<RouterStateTitle>, tickets: Ticket[]) => {
        const buildTitle = action.payload.routerState.title;
        if ( !!buildTitle ) {
          this.titleService.setTitle(buildTitle({tickets}));
        }
      });

  @Effect()
  loadAllEffect$ = this.actions$
      .pipe(
          ofType(ROOT_EFFECTS_INIT, TicketActionTypes.LOADALL),
          tap(action => console.log(action)),
          withLatestFrom(this.loaded$),
          switchMap(([_, loaded]) => {
            return loaded
                ? of([null, null])
                : forkJoin(this.backend.tickets(), this.users.getUsers());
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
      .pipe(
          ofType(TicketActionTypes.SAVE),
          map(toTicket),
          concatMap(ticket =>
              this.backend.newTicket(ticket).pipe(this.trackActivity)
          ),
          map((ticket: Ticket) => new TicketSavedAction(ticket))
      );

  @Effect()
  completeEffect$ = this.actions$
      .pipe(
          ofType(TicketActionTypes.COMPLETE),
          map(toTicket),
          concatMap(ticket =>
              this.backend.complete(ticket.id, true).pipe(this.trackActivity)
          ),
          map((ticket: Ticket) => new TicketSavedAction(ticket))
      );

  @Effect()
  addNewEffect$ = this.actions$
      .pipe(
          ofType(TicketActionTypes.CREATE),
          map(toTicket),
          concatMap(ticket =>
              this.backend.newTicket(ticket).pipe(this.trackActivity)
          ),
          map((ticket: Ticket) => new TicketSavedAction(ticket))
      );

  @Effect()
  assignEffect$ = this.actions$
      .pipe(
          ofType(TicketActionTypes.ASSIGN),
          map(toTicket),
          concatMap(({id, assigneeId}) =>
              this.backend.assign(id, assigneeId).pipe(this.trackActivity)
          ),
          map((ticket: Ticket) => new TicketSavedAction(ticket))
      );

  constructor(
      private actions$: Actions,
      private store: Store<TicketsState>,
      private backend: BackendService,
      private users: UsersFacade,
      private titleService: Title
  ) {
  }

  /**
   * HOF used to build pipeable operator to announce start/stop of async action...
   */
  private trackActivity = trackProcess({
    start: () => this.store.dispatch(new TicketsProcessingAction(true)),
    stop: () => this.store.dispatch(new TicketsProcessingAction(false))
  });
}

const toTicket = (action: TicketActionUnion): Ticket => action.data;

// ***************************************************************
// Pipeable Operator Factory
// ***************************************************************

/**
 * Proxy target observable to add pre- and post- processing event
 * notifications...
 */
function trackProcess({start, stop}) {
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

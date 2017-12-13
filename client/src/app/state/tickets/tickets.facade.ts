import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Actions, Effect, ROOT_EFFECTS_INIT } from '@ngrx/effects';

import {Observable} from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/observable/forkJoin';
import { map, switchMap, concatMap, withLatestFrom } from 'rxjs/operators';

import {NoopAction} from '../app.actions';
import {ApplicationState} from '../app.state';
import {UsersFacade} from '../users/users.facade';
import {BackendService} from '../../services/backend.service';
import {Ticket} from '../../models/ticket';
import {TicketAction, TicketActionTypes } from './tickets.actions';
import {TicketsQuery} from './tickets.reducers';
import {TicketsLoadedAction, TicketSavedAction} from './tickets.actions';
import {LoadAllTicketsAction, SaveTicketAction} from './tickets.actions';
import {AssignUserAction, CompleteTicketAction} from './tickets.actions';
import {SelectTicketAction, TicketsProcessingAction, FilterTicketsAction} from './tickets.actions';

import {updateWithAvatars} from '../../utils/avatars';

/**
 *
 */
@Injectable()
export class TicketsFacade {
  users$           = this.users.allUsers$;

  allTickets$      = this.store.select(TicketsQuery.getAllTickets);
  filteredTickets$ = this.store.select(TicketsQuery.getTickets);
  selectedTicket$  = this.store.select(TicketsQuery.getSelectedTicket);

  processing$      = this.store.select(TicketsQuery.isProcessing);

  constructor(
      private actions$: Actions,
      private store   : Store<ApplicationState>,
      private users   : UsersFacade,
      private backend : BackendService) {
  }

  // ***************************************************************
  // Public Methods (... that internally dispatch Actions to store)
  // ***************************************************************

  select(ticketId:string) { this.store.dispatch(new SelectTicketAction(ticketId));    }
  filter(filterBy:string, showAll=true)       {
    this.store.dispatch(new FilterTicketsAction({filterBy, showAll} ));
  }

  loadAll()               { this.store.dispatch(new LoadAllTicketsAction());          }
  save(ticket:Ticket)     { this.store.dispatch(new SaveTicketAction(ticket));        }
  add(title:string)       { this.store.dispatch(new SaveTicketAction({title})); }
  assign(ticket:Ticket)   { this.store.dispatch(new AssignUserAction(ticket));        }
  close(ticket:Ticket)    { this.store.dispatch(new CompleteTicketAction(ticket));    }

  // ***************************************************************
  // Private Queries
  // ***************************************************************

  /**
   * Used to internal throttle the LoadAllTickets requests
   */
  private loaded$       = this.store.select(TicketsQuery.getLoaded);

  /**
   * Lettable operator to announce start/stop of async action...
   */
  private trackActivity = this.trackProcess(this.store).bind(this);


  // ***************************************************************
  // Effect Models
  // ***************************************************************

  @Effect()
  loadAllEffect$ = this.actions$
    .ofType(ROOT_EFFECTS_INIT, TicketActionTypes.LOADALL)
    .pipe(
        withLatestFrom(this.loaded$),
        switchMap(([_, loaded]) => {
          return loaded ? of([null, null]) :
                 Observable.forkJoin(this.backend.tickets(), this.users.getUsers());
        }),
        map( ([tickets, users]) => {
          if ( tickets ) {
              tickets = updateWithAvatars(tickets, users);
             return new TicketsLoadedAction(tickets)
           }
           return new NoopAction();
        })
    );

  @Effect()
  saveEffect$ = this.actions$
    .ofType(TicketActionTypes.SAVE)
    .pipe(
      map( toTicket ),
      concatMap(ticket => this.backend
        .newTicket(ticket)
        .pipe( this.trackActivity )
      ),
      map((ticket:Ticket) => new TicketSavedAction(ticket))
    );

  @Effect()
  completeEffect$ = this.actions$
    .ofType(TicketActionTypes.COMPLETE)
    .pipe(
      map(toTicket),
      concatMap(ticket => this.backend
        .complete(ticket.id, true)
        .pipe( this.trackActivity )
      ),
      map((ticket:Ticket) => new TicketSavedAction(ticket))
    );

  @Effect()
  addNewEffect$ = this.actions$
    .ofType(TicketActionTypes.CREATE)
    .pipe(
      map(toTicket),
      concatMap(ticket => this.backend
        .newTicket(ticket)
        .pipe( this.trackActivity )
      ),
      map((ticket:Ticket) => new TicketSavedAction(ticket))
    );

  @Effect()
  assignEffect$ = this.actions$
    .ofType(TicketActionTypes.ASSIGN)
    .pipe(
      map(toTicket),
      concatMap(({id, assigneeId}) => this.backend
        .assign(id, assigneeId)
        .pipe( this.trackActivity )
      ),
      map((ticket:Ticket) => new TicketSavedAction(ticket))
    );

  // ***************************************************************
  // Lettable Operator Factory
  // ***************************************************************

  /**
   * Proxy target observable to add pre- and post- processing event
   * notifications...
   */
  private trackProcess(store:Store<ApplicationState>) {
    return (target$:Observable<any>):Observable<any> => {
      const action = (val) => new TicketsProcessingAction(val);
      const start  = () => store.dispatch( action(true)  );
      const stop   = () => store.dispatch( action(false) );

      return Observable.create(obsrv => {
        start();
        const watch = target$.subscribe(resp => {
                        obsrv.next(resp);
                        obsrv.complete();
                        stop();
                      },() => stop());

        return () => watch.unsubscribe();
      })
    }
  }

}

const toTicket   = (action:TicketAction):Ticket => action.data;




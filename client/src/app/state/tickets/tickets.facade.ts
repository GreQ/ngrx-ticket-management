import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Actions, Effect, ROOT_EFFECTS_INIT } from '@ngrx/effects';

import {Observable} from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { map, switchMap, concat, withLatestFrom, mergeMap } from 'rxjs/operators';
import {updateWithAvatars} from '../../utils/avatars';

import {NoopAction} from '../app.actions';
import {ApplicationState} from '../app.state';
import {UsersFacade} from '../users/users.facade';
import {BackendService} from '../../services/backend.service';
import {Ticket} from '../../models/ticket';
import {
  TicketAction, TicketActionTypes, TicketSelectedAction,
  TicketsProcessingAction
} from './tickets.actions';
import {TicketsQuery} from './tickets.reducers';
import {
  FilterTicketsAction,
  LoadAllTicketsAction,
  SaveTicketAction,
  AssignUserAction,
  CompleteTicketAction,
  TicketsLoadedAction,
  TicketSavedAction,
} from './tickets.actions';
import 'rxjs/add/operator/concat';
import 'rxjs/add/observable/forkJoin';



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

  // ************************************************
  // Public Code (Action Creators)
  // ************************************************

  // ***************************************************************
  // Dispatch Actions
  // ***************************************************************

  filter(filterBy:string, showAll=true)       {
    this.store.dispatch(new FilterTicketsAction({filterBy, showAll} ));
  }

  select(ticketId:string) { this.store.dispatch(new TicketSelectedAction(ticketId));  }
  loadAll()            { this.store.dispatch(new LoadAllTicketsAction());             }
  add(title:string)    { this.store.dispatch(new SaveTicketAction({title}));    }
  close(ticket:Ticket) { this.store.dispatch(new CompleteTicketAction(ticket));       }
  save(ticket:Ticket)  { this.store.dispatch(new SaveTicketAction(ticket));           }
  assign(ticket:Ticket){ this.store.dispatch(new AssignUserAction(ticket));           }

  // ***************************************************************
  // Public API
  // ***************************************************************

  /**
   * Dispatch load request action and return observable to filtered list
   */
  getTickets(): Observable<Ticket[]> {
      this.loadAll();
      return this.filteredTickets$;
    }

  // ***************************************************************
  // Private Queries
  // ***************************************************************

  private loaded$          = this.store.select(TicketsQuery.getLoaded);

  // ***************************************************************
  // Effect Models
  // ***************************************************************

  @Effect()
  autoLoadAllEffect$ = this.actions$
    .ofType(ROOT_EFFECTS_INIT)
    .pipe(
      mergeMap(_ => [
          new LoadAllTicketsAction()
      ])
    );

  @Effect()
  loadAllEffect$ = this.actions$
    .ofType(TicketActionTypes.LOADALL)
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
      switchMap(ticket => this.process(
          this.backend.newTicket(ticket)
      )),
      map((ticket:Ticket) => new TicketSavedAction(ticket))
    );

  @Effect()
  completeEffect$ = this.actions$
    .ofType(TicketActionTypes.COMPLETE)
    .pipe(
      map(toTicket),
      switchMap(ticket => this.process(
          this.backend.complete(ticket.id, true)
      )),
      map((ticket:Ticket) => new TicketSavedAction(ticket))
    );

  @Effect()
  addNewEffect$ = this.actions$
    .ofType(TicketActionTypes.CREATE)
    .pipe(
      map(toTicket),
      switchMap(ticket => this.process(
          this.backend.newTicket(ticket)
      )),
      map((ticket:Ticket) => new TicketSavedAction(ticket))
    );

  @Effect()
  assignEffect$ = this.actions$
    .ofType(TicketActionTypes.ASSIGN)
    .pipe(
      map(toTicket),
      switchMap(({id, assigneeId}) => this.process(
          this.backend.assign(id, assigneeId)
      )),
      map((ticket:Ticket) => new TicketSavedAction(ticket))
    );

  /**
   * Proxy target observable to add pre- and post- processing event
   * notifications...
   */
  private process(target$:Observable<any>):Observable<any> {
    const action = (val) => new TicketsProcessingAction(val);
    const start  = () => this.store.dispatch( action(true)  );
    const stop   = () => this.store.dispatch( action(false) );

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

const toTicket   = (action:TicketAction):Ticket => action.data as Ticket;
const ofType     = (type:string) => (action): boolean => action.type == type;





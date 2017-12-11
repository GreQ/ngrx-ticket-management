import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Actions, Effect, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import {Observable} from 'rxjs/Observable';
import {forkJoin} from 'rxjs/observable/forkJoin';
import { of } from 'rxjs/observable/of';
import {map, switchMap, combineLatest, withLatestFrom, mergeMap, concat} from 'rxjs/operators';

import {NoopAction} from '../app.actions';
import {ApplicationState} from '../app.state';
import {LoadAllUsersAction} from '../users/users.actions';
import {UsersFacade} from '../users/users.facade';
import {BackendService} from '../../services/backend.service';
import {Ticket, User} from '../../models/ticket';
import {TicketAction, TicketActionTypes, TicketSelectedAction} from './tickets.actions';
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



@Injectable()
export class TicketsFacade {
  users$           = this.users.allUsers$;

  filteredTickets$ = this.store.select(TicketsQuery.getTickets);
  selectedTicket$  = this.store.select(TicketsQuery.getSelectedTicket);

  constructor(
      private actions$: Actions,
      private store   : Store<ApplicationState>,
      private users   : UsersFacade,
      private backend : BackendService) {  }

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

  getTickets(): Observable<Ticket[]> {
      this.loadAll();
      return this.filteredTickets$;
    }

  // ***************************************************************
  // Private Queries
  // ***************************************************************

  private loaded$          = this.store.select(TicketsQuery.getLoaded);
  private allTickets$      = this.store.select(TicketsQuery.getAllTickets);

  // ***************************************************************
  // Effect Models
  // ***************************************************************

  @Effect()
  autoLoadAllEffect$ = this.actions$
    .ofType(ROOT_EFFECTS_INIT)
    .pipe(
      mergeMap(_ => [
          new LoadAllUsersAction(),
          new LoadAllTicketsAction()
      ])
    );

  @Effect()
  loadAllEffect$ = this.actions$
    .ofType(TicketActionTypes.LOADALL)
    .pipe(
        withLatestFrom(this.loaded$),
        switchMap(([_, loaded]) => {
          return loaded ? of(null) : this.backend.tickets();
        }),
        map( (tickets : Ticket[] | null) => {
          if ( tickets ) {
              tickets = this.users.updateWithAvatars(tickets);
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
      map((ticket:Ticket) => new TicketSavedAction(ticket))
    );

  @Effect()
  completeEffect$ = this.actions$
    .ofType(TicketActionTypes.COMPLETE)
    .pipe(
      map(toTicket),
      switchMap(ticket => this.backend.complete(ticket.id, true) ),
      map((ticket:Ticket) => new TicketSavedAction(ticket))
    );

  @Effect()
  addNewEffect$ = this.actions$
    .ofType(TicketActionTypes.CREATE)
    .pipe(
      map(toTicket),
      switchMap(ticket => this.backend.newTicket(ticket)),
      map((ticket:Ticket) => new TicketSavedAction(ticket))
    );

  @Effect()
  assignEffect$ = this.actions$
    .ofType(TicketActionTypes.ASSIGN)
    .pipe(
      map(toTicket),
      switchMap(({id, assigneeId}) => this.backend.assign(id, assigneeId)),
      map((ticket:Ticket) => new TicketSavedAction(ticket))
    );



}

const toTicket   = (action:TicketAction):Ticket => action.data as Ticket;
const ofType     = (type:string) => (action): boolean => action.type == type;

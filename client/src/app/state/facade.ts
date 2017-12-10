import { Injectable } from '@angular/core';

import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import {Subject} from 'rxjs/Subject';
import {queue} from 'rxjs/scheduler/queue';
import {observeOn} from 'rxjs/operator/observeOn';
import {combineLatest} from 'rxjs/observable/combineLatest';

import 'rxjs/add/observable/defer';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/merge';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/scan';
import 'rxjs/add/observable/of';

import {Ticket} from '../models/ticket';
import {BackendService} from '../services/backend.service';
import {TicketAction, TicketActionTypes} from './actions';
import {ticketsReducer, ticketsFilter} from './reducers';
import {loadAllAction, completeAction, saveAction, ticketsAction} from './actions';

@Injectable()
export class TicketFacade {
  tickets$ : Observable<Ticket[]>;
  allTickets$ : Observable<Ticket[]>;

  constructor(private backend: BackendService) {
      this.configureStore();
  }

  /**
   * Configure the store and observables
   */
  private configureStore() {
    const filters$      = this.filters$.startWith("");
    const ticketReducer = (acc:Ticket[], action:TicketAction) => {
                            return ticketsReducer(acc, action);
                          };

    this.allTickets$  = this.store.scan( ticketReducer,[] );
    this.tickets$     = combineLatest(this.allTickets$, filters$).map( ([tickets, filter]) => {
                          return ticketsFilter(filter, tickets)
                        });

    this.activateEffects();
    this.loadAllTickets();
  }

  // ***************************************************************
  // Dispatch Actions
  // ***************************************************************

  filter(val:string) {
    this.filters$.next(val);
  }

  loadAllTickets() {
    this.dispatcher.next(loadAllAction());
  }

  addTicket(title:string) {
    this.dispatcher.next(saveAction({title}));
  }

  closeTicket(ticket:Ticket) {
    this.dispatcher.next(completeAction(ticket));
  }


  // ***************************************************************
  // 'Action' Processing
  // ***************************************************************

  private filters$    = new Subject<string>();
  private store       = new Subject<TicketAction>();

  // ***************************************************************
  // Effect Models
  // ***************************************************************

  private dispatcher  = new Subject<TicketAction>();
  private actions$ : Observable<TicketAction> = observeOn.call(this.dispatcher,queue);

  private loadEffect$ = this.actions$
    .filter(ofType(TicketActionTypes.LOAD))
    .switchMap(_ => this.backend.tickets())
    .map((tickets:Ticket[]) => ticketsAction(tickets));

  private completeEffect$ = this.actions$
    .filter(ofType(TicketActionTypes.COMPLETE))
    .map(toTicket)
    .mergeMap(ticket => this.backend.complete(ticket.id))
    .map((ticket:Ticket) => ticketsAction([ticket]));

  private saveEffect$ = this.actions$
    .filter(ofType(TicketActionTypes.SAVE))
    .map(toTicket)
    .mergeMap(ticket => this.backend.newTicket(ticket))
    .do(ticket => console.log(Date.now(),ticket))
    .map((ticket:Ticket) => ticketsAction([ticket]));

  /**
   * Queue all background effects and redirect resulting actions to
   * the store and its reducers...
   */
  private activateEffects() {
    this.watchAllEffects = Observable
          .merge(this.loadEffect$,this.saveEffect$, this.completeEffect$)
          .subscribe(action => this.store.next(action));
  }

  private watchAllEffects : Subscription;

}

const toTicket  = (action:TicketAction):Ticket => action.data as Ticket;
const toTickets = (action:TicketAction):Ticket[] => action.data as Ticket[];
const ofType    = (type:string) => (action): boolean => action.type == type;

import { Injectable } from '@angular/core';

import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import {Subject} from 'rxjs/Subject';
import {queue} from 'rxjs/scheduler/queue';
import {observeOn} from 'rxjs/operator/observeOn';
import {combineLatest} from 'rxjs/observable/combineLatest';
import 'rxjs/add/observable/defer';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/shareReplay';
import {assign} from 'rxjs/util/assign';

import {Ticket, User} from '../../models/ticket';
import {assignAction, TicketAction, TicketActionTypes, TicketsFilter} from './tickets.actions';
import {ticketsReducer, ticketsFilter} from './tickets.reducers';
import {loadAllAction, completeAction, saveAction, ticketsAction} from './tickets.actions';

import {BackendService} from '../../services/backend.service';

@Injectable()
export class TicketsFacade {
  users$ : Observable<User[]>;
  filteredTickets$ : Observable<Ticket[]>;
  allTickets$ : Observable<Ticket[]>;

  constructor(private backend: BackendService) {
      this.configureStore();
  }

  /**
   * Configure the store and observables
   */
  private configureStore() {
    const showAll       = {filterBy:"", showAll:true};
    const filters$      = this.filters$.startWith(showAll);
    const ticketReducer = (acc:Ticket[], action:TicketAction) => {
                            return ticketsReducer(acc, action);
                          };

    this.users$           = this.backend.users().shareReplay(1);
    this.allTickets$      = this.store.scan( ticketReducer,[] );
    this.filteredTickets$ = combineLatest(this.allTickets$, filters$)
                              .map( ([tickets, filters]) => ticketsFilter(filters, tickets));

    this.activateEffects();
    this.loadAll();
  }

  /**
   * Whenever a new ticketID event occurs, search and return the matching ticket
   */
  watchTicketById(ticketId$:Observable<string>):Observable<Ticket> {
    const findTicket = (id) => (acc, it) => {
            return acc ? acc : ((it.id == id) ? it : null);
          };

    return this.allTickets$.combineLatest(ticketId$)
        .map(([tickets, ticketId]) => {
          const ticketReducer = findTicket(ticketId);
          return tickets.reduce( ticketReducer, null );
        });
  }

  // ***************************************************************
  // Dispatch Actions
  // ***************************************************************

  filter(params:TicketsFilter) {  this.filters$.next(params);   }

  loadAll()            { this.dispatcher.next(loadAllAction());           }
  add(title:string)    { this.dispatcher.next(saveAction({title}));}
  close(ticket:Ticket) { this.dispatcher.next(completeAction(ticket));    }
  save(ticket:Ticket)  { this.dispatcher.next(saveAction(ticket));        }
  assign(ticket:Ticket){ this.dispatcher.next(assignAction(ticket));        }

  // ***************************************************************
  // 'Action' Processing
  // ***************************************************************

  private filters$    = new Subject<TicketsFilter>();
  private store       = new Subject<TicketAction>();

  // ***************************************************************
  // Effect Models
  // ***************************************************************

  private dispatcher  = new Subject<TicketAction>();
  private actions$ : Observable<TicketAction> = observeOn.call(this.dispatcher,queue);

  private loadAllEffect$ = this.actions$
            .filter(ofType(TicketActionTypes.LOADALL))
            .switchMap(_ => this.backend.tickets())
            .map((tickets:Ticket[]) => ticketsAction(tickets));

  private saveEffect$ = this.actions$
            .filter(ofType(TicketActionTypes.SAVE))
            .map( toTicket )
            .map((ticket:Ticket) => ticketsAction([ticket]));

  private completeEffect$ = this.actions$
            .filter(ofType(TicketActionTypes.COMPLETE))
            .map(toTicket)
            .switchMap(ticket => this.backend.complete(ticket.id, true) )
            .map((ticket:Ticket) => ticketsAction([ticket]));

  private addNewEffect$ = this.actions$
            .filter(ofType(TicketActionTypes.CREATE))
            .map(toTicket)
            .switchMap(ticket => this.backend.newTicket(ticket))
            .map((ticket:Ticket) => ticketsAction([ticket]));

  private assignEffect$ = this.actions$
            .filter(ofType(TicketActionTypes.ASSIGN))
            .map(toTicket)
            .switchMap(({id, assigneeId}) => this.backend.assign(id, assigneeId))
            .map((ticket:Ticket) => ticketsAction([ticket]));

  /**
   * Queue all background effects and redirect resulting actions to
   * the store and its reducers...
   */
  private activateEffects() {
    this.watchAllEffects = Observable
          .merge(
              this.loadAllEffect$,
              this.saveEffect$,
              this.addNewEffect$,
              this.completeEffect$,
              this.assignEffect$
          )
          .subscribe(action => this.store.next(action));
  }

  private watchAllEffects : Subscription;

}

const toTicket   = (action:TicketAction):Ticket => action.data as Ticket;
const ofType     = (type:string) => (action): boolean => action.type == type;

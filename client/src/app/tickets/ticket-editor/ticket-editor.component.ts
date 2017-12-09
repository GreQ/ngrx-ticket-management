import { Component, OnDestroy } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { map, merge } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';

import { ApplicationState } from '../../state/app.state';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';

import { Ticket, User } from '../../models/ticket';
import {
  SelectTicketAction,
  AssignUserAction,
  CompleteTicketAction,
  SaveTicketAction
} from '../../state/tickets/tickets.actions';
import { TicketsQuery } from '../../state/tickets/tickets.reducers';
import { UsersQuery } from '../../state/users/users.reducers';

@Component({
  selector: 'ticket-editor',
  styleUrls: ['./ticket-editor.component.css'],
  animations: [
    trigger('card', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('700ms', style({ opacity: 1 }))
      ])
    ])
  ],
  template: `      
      <div fxLayout fxLayoutAlign="center center" class="centered" @card>
        <ticket-card  [ticket]="ticket$ | async" 
                      [users]="users$ | async" 
                      (save)="save($event)"
                      (complete)="complete($event)"
                      (reassign)="reassign($event)" >
        </ticket-card>
      </div>
      <a mat-fab title="Add a new ticket" class="floating-button" routerLink="/ticket/new" >
        <mat-icon class="md-24">add</mat-icon>
      </a>
   `
})
export class TicketEditorComponent implements OnDestroy {
  users$: Observable<User[]> = this.store.select(UsersQuery.getUsers);
  ticket$: Observable<Ticket> = this.store.select(
    TicketsQuery.getSelectedTicket
  );

  constructor(
    public store: Store<ApplicationState>,
    public route: ActivatedRoute
  ) {
    this.watch = makeTicketID$(route).subscribe(ticketId => {
      this.store.dispatch(new SelectTicketAction(ticketId));
    });
  }

  private save(ticket) {
    this.store.dispatch(new SaveTicketAction(ticket));
  }

  private complete(ticket) {
    this.store.dispatch(new CompleteTicketAction(ticket));
  }

  private reassign(ticket) {
    this.store.dispatch(new AssignUserAction(ticket));
  }

  ngOnDestroy() {
    this.watch.unsubscribe();
  }

  private watch: Subscription;
}

/**
 * For the current route and for future route changes, prepare an Observable to the route
 * params ticket 'id'
 */
function makeTicketID$(route: ActivatedRoute): Observable<string> {
  const current$ = of(route.snapshot.paramMap.get('id'));
  const future$ = route.params.pipe(map(params => params['id']));

  return current$.pipe(merge(future$));
}

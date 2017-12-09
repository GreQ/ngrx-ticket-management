import { Component } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';

import { Observable } from 'rxjs/Observable';

import { Ticket, User } from '../../models/ticket';
import { TicketsQuery } from '../../state/tickets/tickets.reducers';
import { UsersQuery } from '../../state/users/users.reducers';

import { Store } from '@ngrx/store';
import { ApplicationState } from '../../state/app.state';
import {
  AssignUserAction,
  CompleteTicketAction
} from '../../state/tickets/tickets.actions';

@Component({
  selector: 'ticket-grid',
  styles: [
    `/deep/ .ticket-card {
      min-height : 320px; !important;
      margin-bottom: 20px;
    }`,
    `.grid {
        padding:20px;
        height:93vh;
        background: url('/assets/astronaut.jpg');
    }`,
    `ticket-card {
        max-width: 420px;
        min-width: 380px;
    }`
  ],
  animations: [
    trigger('cards', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('350ms', style({ opacity: 1 }))
      ])
    ])
  ],
  template: `      
    <div fxLayout="row wrap" fxLayoutGap="20px" class="grid" style="height: 93vh">
      <ticket-card 
          @cards
          fxFlex="calc(50% - 20px)"
          *ngFor="let ticket of (tickets$ | async)" 
          [ticket]="ticket" [users]="users$ | async"
          (complete)="complete($event)"
          (reassign)="reassign($event)" >
      </ticket-card>
    </div>
   `
})
export class TicketGridComponent {
  tickets$: Observable<Ticket[]> = this.store.select(TicketsQuery.getTickets);
  users$: Observable<User[]> = this.store.select(UsersQuery.getUsers);

  constructor(public store: Store<ApplicationState>) {}

  private reassign(ticket) {
    this.store.dispatch(new AssignUserAction(ticket));
  }

  private complete(ticket) {
    this.store.dispatch(new CompleteTicketAction(ticket));
  }
}

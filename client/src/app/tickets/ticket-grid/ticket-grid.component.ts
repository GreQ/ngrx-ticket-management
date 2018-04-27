import { Component } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';

import { Observable } from 'rxjs/Observable';

import { Ticket, User } from '../../models/ticket';
import { TicketsFacade } from '../../state/tickets/tickets.facade';

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
          (complete)="service.close($event)"
          (reassign)="service.assign($event)" >
      </ticket-card>
    </div>
   `
})
export class TicketGridComponent {
  tickets$: Observable<Ticket[]> = this.service.filteredTickets$;
  users$: Observable<User[]> = this.service.users$;

  constructor(public service: TicketsFacade) {}
}

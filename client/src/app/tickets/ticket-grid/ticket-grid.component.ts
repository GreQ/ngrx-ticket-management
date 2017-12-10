import {Component} from '@angular/core';
import {Observable} from 'rxjs/Observable';

import {TicketsFacade} from '../../state/tickets/tickets.facade';
import {Ticket} from '../../models/ticket';

@Component({
  selector: 'ticket-grid',
  styles : [
  ],
  template: `      
    <div fxLayout="row wrap" fxFlexFill fxLayoutGap="space-around center">
      <ticket-card *ngFor="let ticket of (tickets$ | async)" [ticket]="ticket">
      </ticket-card>
    </div>
   `
})
export class TicketGridComponent {
  tickets$ : Observable<Ticket[]> = this.service.filteredTickets$;
  constructor(private service:TicketsFacade){}
}

import { Component } from '@angular/core';
import {Observable} from 'rxjs/Observable';

import { TicketFacade } from './state/facade';
import { Ticket } from './models/ticket';

@Component({
  selector: 'ticket-app',
  template: `
    <h2>Tickets</h2>
    <input (input)="service.filter(filter.value)" #filter>
    
    <ul>
      <li *ngFor="let t of (tickets$ | async)">
        Ticket: {{t.id}}, {{t.title}}
        <button (click)="service.closeTicket(t)">Complete</button>
      </li>
    </ul>
  
    <input #newTicket>
    <button (click)="service.addTicket(newTicket.value)">Add New Ticket</button>
   `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  tickets$ : Observable<Ticket[]>   = this.service.tickets$;
  constructor(public service: TicketFacade) { }
}


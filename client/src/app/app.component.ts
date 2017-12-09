import { Component } from '@angular/core';
import { Ticket } from './models/ticket';
import { Backend } from './services/backend.service';

@Component({
  selector: 'ticket-app',
  styleUrls: ['./app.component.css'],
  template: `      
      Filter: <input (input)="noop()" #filter>
      
      <h2>Tickets</h2>
      <ul>
        <li>
          ({{ticket.id}}) {{ticket.title}}
          <button (click)="noop()">Complete</button>
        </li>
      </ul>
      
      <hr> 
      
      <input #newTicket>
      <button (click)="noop()">Add New Ticket</button>
   `
})
export class AppComponent {
  ticket: Ticket = { id: '1', title: 'Prepare Challenge Lessons' };
  constructor(public service: Backend) {}

  noop() {}
}

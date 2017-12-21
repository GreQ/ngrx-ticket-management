import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Ticket} from './models/ticket';
import {Backend} from './services/backend.service';
import {TicketsFacade} from './services/tickets.facade';

/**
 * Issues:
 *  1) Does not handle out-or-order
 *  2) Extracts state instead of using async pipe
 *  3) Does not use observables
 *
 *
 *  applyFilters() is 'like' a redux selector
 */
@Component({
  selector: 'ticket-app',
  template: `
    <h2>Tickets</h2>
    
    <input (input)="tickets.applyFilter(assignee.value)" #assignee type="text">
    
    <ul>
      <li *ngFor="let t of (tickets$ | async)">
        Ticket: {{t.id}}, {{t.title}}
        <button (click)="tickets.markAsComplete(t)">Complete</button>
      </li>
    </ul>
  
    <input value="" #newTicket type="text">
    <button (click)="tickets.addTicket(newTicket.value)">Add New Ticket</button>
   `,
  styleUrls: ['./app.component.css'],
  changeDetection : ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  tickets$ : Observable<Ticket[]> = this.tickets.tickets$;

  constructor(private tickets: TicketsFacade) {  tickets.loadAll(); }
}

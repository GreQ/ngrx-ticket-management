import { Component } from '@angular/core';
import {Ticket} from './models/ticket';
import {Backend} from './services/backend.service';

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
    
    <input (input)="doFilter(assignee.value)" #assignee type="text">
    
    <ul>
      <li *ngFor="let t of tickets">
        Ticket: {{t.id}}, {{t.title}}
        <button (click)="doComplete(t)">Complete</button>
      </li>
    </ul>
  
    <input value="" #newTicket type="text">
    <button (click)="doAddTicket(newTicket.value)">Add New Ticket</button>
   `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  tickets    : Ticket[] = [];   // filtered tickets
  allTickets : Ticket[] = [];   // all known tickets
  filter     : string   = "";   // filter criteria

  constructor(private backend: Backend) {
    backend.tickets().subscribe((list:Ticket[]) => {
      this.allTickets = list;
      this.tickets    = this.refreshFilteredList();
    });
  }

  // ***************************************************************
  // Actions
  // ***************************************************************

  doFilter(val:string) {
    this.filter  = val;
    this.tickets = this.refreshFilteredList();
  }

  doAddTicket(title:string) {
    this.backend
      .newTicket( {title} )
      .subscribe((ticket:Ticket) => {
        this.allTickets = this.addTicket(ticket);
        this.tickets    = this.refreshFilteredList();
      });
  }

  doComplete(ticket:Ticket) {
    this.backend
      .complete(ticket.id, true)
      .subscribe((ticket:Ticket) => {
        this.allTickets = this.completeTicket(ticket);
        this.tickets    = this.refreshFilteredList();
      })
  }

  // ***************************************************************
  // 'Action methods'
  // ***************************************************************

  refreshFilteredList() {
    return applyFilters(this.filter, this.allTickets);
  }

  addTicket(ticket:Ticket) {
    return addTicket(ticket, this.allTickets);
  }

  completeTicket(ticket:Ticket) {
    ticket.completed = true;
    return addTicket( ticket, this.allTickets );
  }

}

/**
 * Notice this is analogous to a Redux `reducer` function...
 * @param list
 * @param filter
 */
function applyFilters(criteria:string, list:Ticket[]):Ticket[] {
  const inComplete = (t:Ticket):boolean => (t.completed !== true);
  return list
    .filter(it => matchesCriteria(criteria,it))
    .filter( inComplete );
}

/**
 * Add ticket to existing list. If already existing,
 * overwrite with new values. Maintain ticket order.
 */
function addTicket(ticket:Ticket, buffer:Ticket[]):Ticket[] {
  const found = findExisting(ticket, buffer);
  const result = !!found ? buffer.map(it => {
      return (it.id == ticket.id) ? {...it, ...ticket} : it;
  }) : buffer.concat(ticket);

  return result;
}



// ***************************************************************
// Simple data model methods
// ***************************************************************

/**
 * Determine if criteria matches ticket description
 */
function matchesCriteria(criteria:string, ticket:Ticket):boolean {
  const description = ticket.description.toLowerCase();
  const title       = ticket.title.toLowerCase();

    criteria = criteria.toLowerCase();

  return title.includes(criteria) || description.includes(criteria);
}

/**
 * Find existing ticket (if present)
 */
function findExisting(ticket:Ticket, buffer:Ticket[]):Ticket {
  return buffer.reduce((prev, curr):Ticket=> {
    return prev ? prev : ((curr.id == ticket.id) ? curr : null);
  }, null);
}

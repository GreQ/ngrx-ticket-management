import { Component } from '@angular/core';

import { TicketsFacade } from '@nrwl-tickets/tickets-state';
import { Ticket } from '@nrwl-tickets/tickets-models';
import { fadeInItem, fadeInList } from '@nrwl-tickets/common-utils';

@Component({
  selector: 'ticket-list',
  styleUrls: ['./ticket-list.component.css'],
  animations: [fadeInList('listChange'), fadeInItem('listItem')],
  template: `      
    <mat-nav-list [@listChange]="numTickets">
      <h2 matSubheader> {{showAll ? 'All': 'Pending' }} Tickets </h2>
      <mat-slide-toggle 
          [checked]="showAll" 
          (change)="toggleShowAll($event.checked)">
        Show All
      </mat-slide-toggle>
      
      <ticket-search 
        [criteria]="searchCriteria" 
        (search)="updateSearchBy($event)">
      </ticket-search>
      
      <a *ngFor="let ticket of (tickets$ | async); trackBy: trackByFn"
         mat-list-item 
         @listItem
         title="{{ticket.title}}"
         [routerLink]="['/ticket', ticket.id]" >
        <img mat-list-avatar class="circle"
             [src]="ticket.imageURL" 
             alt="Picture of {{ticket.assigneeId}}" >  
        <p mat-line 
           [ngClass]="{'completed': ticket.completed}">
          {{ticket.title | truncate: 30}}
        </p>
      </a>
      
    </mat-nav-list>
    <p class="copyright">Copyright 2017, All Rights Reserved - Nrwl, Inc.</p>
   `
})
export class TicketListComponent {
  searchCriteria = '';
  numTickets     = 0;
  showAll        = true;
  tickets$       = this.srvTickets.filteredTickets$;

  constructor(private srvTickets: TicketsFacade) {
    this.tickets$.subscribe(tickets => {
      this.numTickets = tickets.length;
    });
  }

  trackByFn(index:number, ticket: Ticket) {  // @todo check trackBy signature
    return ticket.id;
  }
  toggleShowAll(showAll: boolean) {
    this.showAll = showAll;
    this.updateFilters();
  }
  updateSearchBy(criteria: string) {
    this.searchCriteria = criteria;
    this.updateFilters();
  }

  private updateFilters() {
    this.srvTickets.filter(this.searchCriteria, this.showAll);
  }
}
